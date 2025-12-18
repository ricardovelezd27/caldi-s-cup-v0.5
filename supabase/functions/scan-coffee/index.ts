import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Dynamic CORS - restrict to known origins in production
const getAllowedOrigin = (requestOrigin: string | null): string => {
  const allowedOrigins = [
    Deno.env.get("APP_ORIGIN"),
    "https://lovable.dev",
    "https://lovableproject.com",
  ].filter(Boolean);
  
  // In development, allow localhost
  if (requestOrigin?.includes("localhost") || requestOrigin?.includes("127.0.0.1")) {
    return requestOrigin;
  }
  
  // Check if origin matches allowed list or their subdomains
  if (requestOrigin) {
    for (const allowed of allowedOrigins) {
      if (allowed && (requestOrigin === allowed || requestOrigin.endsWith(`.${new URL(allowed).host}`))) {
        return requestOrigin;
      }
    }
    // Allow *.lovableproject.com subdomains
    if (requestOrigin.endsWith(".lovableproject.com")) {
      return requestOrigin;
    }
  }
  
  // Default to first allowed origin or restrictive fallback
  return allowedOrigins[0] || "https://lovable.dev";
};

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": getAllowedOrigin(origin),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

// Tribe keywords for matching
const TRIBE_KEYWORDS: Record<string, string[]> = {
  fox: ["Geisha", "Rare", "Competition", "Anaerobic", "90+", "Award", "Exclusive", "Limited", "Auction"],
  owl: ["Washed", "Light Roast", "Elevation", "MASL", "Typica", "Bourbon", "Clean", "Precision", "Single Origin"],
  hummingbird: ["Natural", "Fruit", "Fermented", "Co-ferment", "Funky", "Blend", "Strawberry", "Experimental", "Wild"],
  bee: ["House Blend", "Dark Roast", "Medium Roast", "Chocolate", "Nutty", "Caramel", "Bold", "Classic", "Smooth"],
};

interface ScanRequest {
  imageBase64: string;
  userTribe: string | null;
}

// Input validation constants
const MAX_STRING_LENGTH = 500;
const MAX_BRAND_STORY_LENGTH = 2000;
const MAX_ARRAY_LENGTH = 20;
const MAX_JARGON_ENTRIES = 15;

// Sanitize and validate string input
const sanitizeString = (value: unknown, maxLength: number = MAX_STRING_LENGTH): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  // Trim and limit length
  const sanitized = value.trim().slice(0, maxLength);
  // Remove potential script tags and dangerous patterns
  return sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                  .replace(/javascript:/gi, "")
                  .replace(/on\w+\s*=/gi, "");
};

// Sanitize and validate number input
const sanitizeNumber = (value: unknown, min: number, max: number): number | null => {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  return Math.min(max, Math.max(min, num));
};

// Sanitize array of strings
const sanitizeStringArray = (value: unknown, maxLength: number = MAX_ARRAY_LENGTH): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, maxLength)
    .map(item => sanitizeString(item, 100))
    .filter((item): item is string => item !== null && item.length > 0);
};

// Sanitize jargon explanations object
const sanitizeJargonExplanations = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, string> = {};
  const entries = Object.entries(value as Record<string, unknown>).slice(0, MAX_JARGON_ENTRIES);
  for (const [key, val] of entries) {
    const sanitizedKey = sanitizeString(key, 50);
    const sanitizedVal = sanitizeString(val, 300);
    if (sanitizedKey && sanitizedVal) {
      result[sanitizedKey] = sanitizedVal;
    }
  }
  return result;
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables not configured");
    }

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client with service role for storage operations
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64, userTribe }: ScanRequest = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing scan for user ${user.id}, tribe: ${userTribe}`);

    // Step 1: Upload image to storage
    const imageBuffer = Uint8Array.from(atob(imageBase64.split(",")[1] || imageBase64), c => c.charCodeAt(0));
    const fileName = `${user.id}/${Date.now()}.jpg`;
    
    const { error: uploadError } = await supabaseClient.storage
      .from("coffee-scans")
      .upload(fileName, imageBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Generate signed URL (valid for 1 year) instead of public URL
    const { data: signedUrlData, error: signedUrlError } = await supabaseClient.storage
      .from("coffee-scans")
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Signed URL error:", signedUrlError);
      throw new Error("Failed to generate image URL");
    }

    const imageUrl = signedUrlData.signedUrl;
    console.log("Image uploaded with signed URL");

    // Step 2: Get tribe keywords for personalization
    const tribeKeywords = userTribe ? TRIBE_KEYWORDS[userTribe] || [] : [];
    const tribeContext = tribeKeywords.length > 0 
      ? `\n\nThe user's Coffee Tribe is "${userTribe}" with preference keywords: ${tribeKeywords.join(", ")}. Consider these when calculating the tribe match score.`
      : "";

    // Step 3: Call Gemini AI for image analysis
    const prompt = `You are a Coffee Sommelier AI. Analyze this coffee bag image and extract all visible information.

Return a JSON object with the following structure (use null for fields you cannot determine):

{
  "extractedData": {
    "coffeeName": "string or null - the name of the coffee",
    "brand": "string or null - the roaster/brand name",
    "origin": "string or null - country/region of origin",
    "roastLevel": "string or null - light/medium/medium-dark/dark",
    "processingMethod": "string or null - washed/natural/honey/anaerobic/etc",
    "variety": "string or null - bourbon/typica/geisha/etc",
    "altitude": "string or null - elevation if mentioned"
  },
  "flavorProfile": {
    "acidityScore": "number 1-5 (1=low, 5=high) based on origin and roast",
    "bodyScore": "number 1-5 (1=light, 5=full) based on roast and process",
    "sweetnessScore": "number 1-5 (1=low, 5=high) based on process and notes",
    "flavorNotes": ["array of flavor descriptors visible or inferred"]
  },
  "enrichment": {
    "brandStory": "string - brief description about the roaster if you know them, or null",
    "awards": ["array of awards/certifications if visible"],
    "cuppingScore": "number or null - if visible on bag"
  },
  "jargonExplanations": {
    "term1": "explanation for coffee jargon terms found on the bag",
    "term2": "another explanation"
  },
  "confidence": "number 0.0-1.0 representing how confident you are in the extraction"
}${tribeContext}

Respond ONLY with the JSON object, no additional text.`;

    console.log("Calling Gemini AI...");
    
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    const aiContent = aiData.choices?.[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content in AI response");
    }

    // Parse AI response - handle potential markdown code blocks
    let parsedResult;
    try {
      const jsonMatch = aiContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                       aiContent.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
      parsedResult = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("Failed to parse AI response");
    }

    // Step 4: Sanitize and validate ALL AI-generated content
    const sanitizedData = {
      coffeeName: sanitizeString(parsedResult.extractedData?.coffeeName),
      brand: sanitizeString(parsedResult.extractedData?.brand),
      origin: sanitizeString(parsedResult.extractedData?.origin),
      roastLevel: sanitizeString(parsedResult.extractedData?.roastLevel, 50),
      processingMethod: sanitizeString(parsedResult.extractedData?.processingMethod, 100),
      variety: sanitizeString(parsedResult.extractedData?.variety, 100),
      altitude: sanitizeString(parsedResult.extractedData?.altitude, 50),
      acidityScore: sanitizeNumber(parsedResult.flavorProfile?.acidityScore, 1, 5),
      bodyScore: sanitizeNumber(parsedResult.flavorProfile?.bodyScore, 1, 5),
      sweetnessScore: sanitizeNumber(parsedResult.flavorProfile?.sweetnessScore, 1, 5),
      flavorNotes: sanitizeStringArray(parsedResult.flavorProfile?.flavorNotes),
      brandStory: sanitizeString(parsedResult.enrichment?.brandStory, MAX_BRAND_STORY_LENGTH),
      awards: sanitizeStringArray(parsedResult.enrichment?.awards, 10),
      cuppingScore: sanitizeNumber(parsedResult.enrichment?.cuppingScore, 0, 100),
      confidence: sanitizeNumber(parsedResult.confidence, 0, 1) || 0.5,
      jargonExplanations: sanitizeJargonExplanations(parsedResult.jargonExplanations),
    };

    // Step 5: Calculate tribe match score
    let tribeMatchScore = 50; // Default neutral score
    const matchReasons: string[] = [];

    if (userTribe && tribeKeywords.length > 0) {
      const allText = JSON.stringify(sanitizedData).toLowerCase();
      let matches = 0;
      
      for (const keyword of tribeKeywords) {
        if (allText.includes(keyword.toLowerCase())) {
          matches++;
          matchReasons.push(`Contains "${keyword}"`);
        }
      }
      
      // Calculate score based on keyword matches
      tribeMatchScore = Math.min(100, 50 + (matches * 15));
      
      // Add contextual reasons
      if (matches === 0) {
        matchReasons.push("This coffee has different characteristics than your usual preferences");
        tribeMatchScore = 30 + Math.floor(Math.random() * 20); // 30-50
      } else if (matches >= 3) {
        matchReasons.push("This coffee aligns well with your taste profile!");
      }
    }

    // Sanitize match reasons
    const sanitizedMatchReasons = sanitizeStringArray(matchReasons, 10);

    // Step 6: Save to database with sanitized data
    const { data: scanRecord, error: insertError } = await supabaseClient
      .from("scanned_coffees")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        coffee_name: sanitizedData.coffeeName,
        brand: sanitizedData.brand,
        origin: sanitizedData.origin,
        roast_level: sanitizedData.roastLevel,
        processing_method: sanitizedData.processingMethod,
        variety: sanitizedData.variety,
        altitude: sanitizedData.altitude,
        acidity_score: sanitizedData.acidityScore,
        body_score: sanitizedData.bodyScore,
        sweetness_score: sanitizedData.sweetnessScore,
        flavor_notes: sanitizedData.flavorNotes,
        brand_story: sanitizedData.brandStory,
        awards: sanitizedData.awards,
        cupping_score: sanitizedData.cuppingScore,
        ai_confidence: sanitizedData.confidence,
        tribe_match_score: tribeMatchScore,
        match_reasons: sanitizedMatchReasons,
        jargon_explanations: sanitizedData.jargonExplanations,
        raw_ai_response: parsedResult, // Keep raw for debugging but never display directly
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Failed to save scan: ${insertError.message}`);
    }

    console.log("Scan saved:", scanRecord.id);

    // Return the complete scan result
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: scanRecord.id,
          imageUrl: scanRecord.image_url,
          coffeeName: scanRecord.coffee_name,
          brand: scanRecord.brand,
          origin: scanRecord.origin,
          roastLevel: scanRecord.roast_level,
          processingMethod: scanRecord.processing_method,
          variety: scanRecord.variety,
          altitude: scanRecord.altitude,
          acidityScore: scanRecord.acidity_score,
          bodyScore: scanRecord.body_score,
          sweetnessScore: scanRecord.sweetness_score,
          flavorNotes: scanRecord.flavor_notes,
          brandStory: scanRecord.brand_story,
          awards: scanRecord.awards,
          cuppingScore: scanRecord.cupping_score,
          aiConfidence: scanRecord.ai_confidence,
          tribeMatchScore: scanRecord.tribe_match_score,
          matchReasons: scanRecord.match_reasons,
          jargonExplanations: scanRecord.jargon_explanations,
          scannedAt: scanRecord.scanned_at,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Scan error:", error);
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
