import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

serve(async (req) => {
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

    // Create Supabase client with user's token
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

    const { data: urlData } = supabaseClient.storage
      .from("coffee-scans")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;
    console.log("Image uploaded:", imageUrl);

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

    // Step 4: Calculate tribe match score
    let tribeMatchScore = 50; // Default neutral score
    const matchReasons: string[] = [];

    if (userTribe && tribeKeywords.length > 0) {
      const allText = JSON.stringify(parsedResult).toLowerCase();
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

    // Step 5: Save to database
    const { data: scanRecord, error: insertError } = await supabaseClient
      .from("scanned_coffees")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        coffee_name: parsedResult.extractedData?.coffeeName,
        brand: parsedResult.extractedData?.brand,
        origin: parsedResult.extractedData?.origin,
        roast_level: parsedResult.extractedData?.roastLevel,
        processing_method: parsedResult.extractedData?.processingMethod,
        variety: parsedResult.extractedData?.variety,
        altitude: parsedResult.extractedData?.altitude,
        acidity_score: parsedResult.flavorProfile?.acidityScore,
        body_score: parsedResult.flavorProfile?.bodyScore,
        sweetness_score: parsedResult.flavorProfile?.sweetnessScore,
        flavor_notes: parsedResult.flavorProfile?.flavorNotes || [],
        brand_story: parsedResult.enrichment?.brandStory,
        awards: parsedResult.enrichment?.awards || [],
        cupping_score: parsedResult.enrichment?.cuppingScore,
        ai_confidence: parsedResult.confidence || 0.5,
        tribe_match_score: tribeMatchScore,
        match_reasons: matchReasons,
        jargon_explanations: parsedResult.jargonExplanations || {},
        raw_ai_response: parsedResult,
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
