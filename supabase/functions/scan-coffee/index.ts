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
    // Allow *.lovableproject.com and *.lovable.app subdomains
    if (
      requestOrigin.endsWith(".lovableproject.com") || 
      requestOrigin.endsWith(".lovable.app")
    ) {
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

// Roast level text to numeric mapping
const ROAST_LEVEL_MAP: Record<string, string> = {
  "light": "1",
  "light roast": "1",
  "blonde": "1",
  "cinnamon": "1",
  "light-medium": "2",
  "light medium": "2",
  "medium-light": "2",
  "medium light": "2",
  "medium": "3",
  "medium roast": "3",
  "city": "3",
  "medium-dark": "4",
  "medium dark": "4",
  "full city": "4",
  "dark": "5",
  "dark roast": "5",
  "french": "5",
  "italian": "5",
  "espresso": "4",
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

// Sanitize roast level to 1-5 enum
const sanitizeRoastLevel = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  
  // If already a number 1-5, return as string
  if (typeof value === "number") {
    const num = Math.round(value);
    if (num >= 1 && num <= 5) return String(num);
    return null;
  }
  
  if (typeof value !== "string") return null;
  
  const cleaned = value.trim().toLowerCase();
  
  // Check if it's already a valid numeric string
  if (/^[1-5]$/.test(cleaned)) return cleaned;
  
  // Map text descriptions to numeric values
  return ROAST_LEVEL_MAP[cleaned] || null;
};

// Sanitize altitude to integer meters
const sanitizeAltitude = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  
  // If already a number, validate range
  if (typeof value === "number") {
    const num = Math.round(value);
    if (num >= 0 && num <= 6000) return num; // Max altitude ~6000m
    return null;
  }
  
  if (typeof value !== "string") return null;
  
  const cleaned = value.trim().toLowerCase();
  
  // Extract number from strings like "1500m", "1200-1400 MASL", "1,500 meters"
  // Take the first number or average of a range
  const rangeMatch = cleaned.match(/(\d[\d,]*)\s*[-–]\s*(\d[\d,]*)/);
  if (rangeMatch) {
    const low = parseInt(rangeMatch[1].replace(/,/g, ""), 10);
    const high = parseInt(rangeMatch[2].replace(/,/g, ""), 10);
    const avg = Math.round((low + high) / 2);
    if (avg >= 0 && avg <= 6000) return avg;
    return null;
  }
  
  // Extract single number
  const numMatch = cleaned.match(/(\d[\d,]*)/);
  if (numMatch) {
    const num = parseInt(numMatch[1].replace(/,/g, ""), 10);
    if (num >= 0 && num <= 6000) return num;
  }
  
  return null;
};

// Simple string similarity (Levenshtein distance based)
const stringSimilarity = (a: string, b: string): number => {
  if (!a || !b) return 0;
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();
  if (aLower === bLower) return 100;
  
  // Simple word-based matching
  const aWords = aLower.split(/\s+/);
  const bWords = bLower.split(/\s+/);
  
  let matches = 0;
  for (const word of aWords) {
    if (bWords.some(bWord => bWord.includes(word) || word.includes(bWord))) {
      matches++;
    }
  }
  
  return Math.round((matches / Math.max(aWords.length, bWords.length)) * 100);
};

// Calculate match score between scanned coffee and existing catalog coffee
interface ExistingCoffee {
  id: string;
  name: string;
  brand: string | null;
  origin_country: string | null;
  origin_region: string | null;
  roast_level: string | null;
  processing_method: string | null;
}

const calculateMatchScore = (
  scannedData: { coffeeName: string | null; brand: string | null; originCountry: string | null; originRegion: string | null },
  existing: ExistingCoffee
): number => {
  let score = 0;
  
  // Exact name + brand match = 100 (highest priority)
  if (scannedData.coffeeName && scannedData.brand) {
    const nameMatch = scannedData.coffeeName.toLowerCase() === existing.name.toLowerCase();
    const brandMatch = scannedData.brand.toLowerCase() === (existing.brand?.toLowerCase() || "");
    if (nameMatch && brandMatch) return 100;
  }
  
  // Name similarity (up to 50 points)
  if (scannedData.coffeeName && existing.name) {
    score += stringSimilarity(scannedData.coffeeName, existing.name) * 0.5;
  }
  
  // Brand match (20 points)
  if (scannedData.brand && existing.brand) {
    if (scannedData.brand.toLowerCase() === existing.brand.toLowerCase()) {
      score += 20;
    } else if (stringSimilarity(scannedData.brand, existing.brand) > 70) {
      score += 10;
    }
  }
  
  // Origin country match (15 points)
  if (scannedData.originCountry && existing.origin_country) {
    if (scannedData.originCountry.toLowerCase() === existing.origin_country.toLowerCase()) {
      score += 15;
    }
  }
  
  // Origin region match (15 points)
  if (scannedData.originRegion && existing.origin_region) {
    if (scannedData.originRegion.toLowerCase() === existing.origin_region.toLowerCase()) {
      score += 15;
    }
  }
  
  return Math.round(score);
};

// Firecrawl web enrichment
async function enrichWithFirecrawl(
  coffeeName: string | null,
  brand: string | null
): Promise<{ brandStory: string | null; awards: string[]; website: string | null }> {
  const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
  
  if (!FIRECRAWL_API_KEY || !brand) {
    return { brandStory: null, awards: [], website: null };
  }

  try {
    console.log(`Enriching with Firecrawl: ${brand}`);
    
    // Search for roaster website
    const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${brand} coffee roaster official website`,
        limit: 3,
        scrapeOptions: {
          formats: ["markdown"],
        },
      }),
    });

    if (!searchResponse.ok) {
      console.error("Firecrawl search failed:", await searchResponse.text());
      return { brandStory: null, awards: [], website: null };
    }

    const searchData = await searchResponse.json();
    const firstResult = searchData.data?.[0];

    if (!firstResult) {
      return { brandStory: null, awards: [], website: null };
    }

    // Extract useful info from the scraped content
    const markdown = firstResult.markdown || "";
    const website = firstResult.url || null;

    // Use AI to extract brand story from the scraped content
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY || !markdown) {
      return { brandStory: null, awards: [], website };
    }

    const extractPrompt = `Extract a brief brand story (2-3 sentences max) and any coffee awards/certifications from this roaster's website content. Return JSON:
{
  "brandStory": "Brief compelling description of the roaster",
  "awards": ["Award 1", "Award 2"]
}

Content:
${markdown.slice(0, 3000)}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: extractPrompt }],
      }),
    });

    if (!aiResponse.ok) {
      return { brandStory: null, awards: [], website };
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    try {
      const jsonMatch = aiContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                       aiContent.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
      const extracted = JSON.parse(jsonString.trim());
      
      return {
        brandStory: sanitizeString(extracted.brandStory, MAX_BRAND_STORY_LENGTH),
        awards: sanitizeStringArray(extracted.awards, 10),
        website,
      };
    } catch {
      return { brandStory: null, awards: [], website };
    }
  } catch (error) {
    console.error("Firecrawl enrichment error:", error);
    return { brandStory: null, awards: [], website: null };
  }
}

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

    // Step 3: Call Gemini AI for image analysis with structured output
    const prompt = `You are a Coffee Sommelier AI. Analyze this coffee bag image and extract all visible information.

Return a JSON object with the following structure (use null for fields you cannot determine):

{
  "extractedData": {
    "coffeeName": "string or null - the name of the coffee",
    "brand": "string or null - the roaster/brand name",
    "originCountry": "string or null - country of origin only (e.g., 'Ethiopia', 'Colombia', 'Brazil')",
    "originRegion": "string or null - specific region/province within the country (e.g., 'Yirgacheffe', 'Huila', 'Cerrado')",
    "originFarm": "string or null - farm/estate/cooperative name if visible (e.g., 'Finca El Paraiso', 'Yirgacheffe Cooperative')",
    "roastLevel": "number 1-5 only (1=light/blonde, 2=light-medium, 3=medium/city, 4=medium-dark/full city, 5=dark/french/italian)",
    "processingMethod": "string or null - washed/natural/honey/anaerobic/etc",
    "variety": "string or null - bourbon/typica/geisha/etc",
    "altitudeMeters": "integer or null - altitude in meters above sea level (extract the number only, e.g., 1500 from '1500 MASL' or average of range '1200-1400m' = 1300)"
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

IMPORTANT RULES:
- roastLevel MUST be a number 1-5, not text
- altitudeMeters MUST be an integer in meters, not a string
- originCountry should be ONLY the country name
- originRegion should be the sub-region/province
- originFarm should be the specific farm/estate if mentioned

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
    const extractedData = parsedResult.extractedData || {};
    
    // Sanitize structured origin fields
    const originCountry = sanitizeString(extractedData.originCountry, 100);
    const originRegion = sanitizeString(extractedData.originRegion, 100);
    const originFarm = sanitizeString(extractedData.originFarm, 200);
    
    // Sanitize roast level (new numeric format)
    const roastLevelNumeric = sanitizeRoastLevel(extractedData.roastLevel);
    
    // Sanitize altitude (new integer format)
    const altitudeMeters = sanitizeAltitude(extractedData.altitudeMeters || extractedData.altitude);
    
    // Build legacy roast level string for backward compatibility
    const roastLevelNames: Record<string, string> = {
      "1": "Light",
      "2": "Light-Medium",
      "3": "Medium",
      "4": "Medium-Dark",
      "5": "Dark",
    };
    const legacyRoastLevel = roastLevelNumeric ? roastLevelNames[roastLevelNumeric] : null;
    
    const sanitizedData = {
      coffeeName: sanitizeString(extractedData.coffeeName),
      brand: sanitizeString(extractedData.brand),
      // New structured fields
      originCountry,
      originRegion,
      originFarm,
      roastLevelNumeric,
      altitudeMeters,
      legacyRoastLevel,
      // Other fields
      processingMethod: sanitizeString(extractedData.processingMethod, 100),
      variety: sanitizeString(extractedData.variety, 100),
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

    console.log("Sanitized data:", {
      roastLevelNumeric: sanitizedData.roastLevelNumeric,
      altitudeMeters: sanitizedData.altitudeMeters,
      originCountry: sanitizedData.originCountry,
      originRegion: sanitizedData.originRegion,
      originFarm: sanitizedData.originFarm,
    });

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

    // Step 6: Check for existing coffee in master catalog
    let coffeeId: string | null = null;
    let isNewCoffee = false;

    console.log("Checking for existing coffee in catalog...");

    // Query for potential matches
    const { data: existingCoffees, error: searchError } = await supabaseClient
      .from("coffees")
      .select("id, name, brand, origin_country, origin_region, roast_level, processing_method")
      .or(`name.ilike.%${sanitizedData.coffeeName || ''}%,brand.ilike.%${sanitizedData.brand || ''}%`)
      .limit(20);

    if (searchError) {
      console.error("Search error:", searchError);
      // Continue without matching - will create new entry
    }

    // Find best match
    let bestMatch: { id: string; score: number } | null = null;

    if (existingCoffees && existingCoffees.length > 0) {
      for (const existing of existingCoffees) {
        const score = calculateMatchScore(sanitizedData, existing);
        console.log(`Match score for ${existing.name}: ${score}`);
        
        if (score >= 80 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { id: existing.id, score };
        }
      }
    }

    // Step 7: Enrich with Firecrawl if creating new coffee
    let enrichedBrandStory = sanitizedData.brandStory;
    let enrichedAwards = sanitizedData.awards;

    if (!bestMatch) {
      // Try to enrich with web data for new coffees
      const firecrawlData = await enrichWithFirecrawl(sanitizedData.coffeeName, sanitizedData.brand);
      if (firecrawlData.brandStory && !enrichedBrandStory) {
        enrichedBrandStory = firecrawlData.brandStory;
      }
      if (firecrawlData.awards.length > 0) {
        enrichedAwards = [...new Set([...enrichedAwards, ...firecrawlData.awards])];
      }
    }

    if (bestMatch) {
      // Use existing coffee
      coffeeId = bestMatch.id;
      isNewCoffee = false;
      console.log(`Matched existing coffee: ${coffeeId} (score: ${bestMatch.score})`);
    } else {
      // Create new coffee in master catalog
      console.log("No match found, creating new coffee in catalog...");
      
      const { data: newCoffee, error: insertCoffeeError } = await supabaseClient
        .from("coffees")
        .insert({
          name: sanitizedData.coffeeName || "Unknown Coffee",
          brand: sanitizedData.brand,
          image_url: imageUrl,
          origin_country: sanitizedData.originCountry,
          origin_region: sanitizedData.originRegion,
          origin_farm: sanitizedData.originFarm,
          roast_level: sanitizedData.roastLevelNumeric,
          processing_method: sanitizedData.processingMethod,
          variety: sanitizedData.variety,
          altitude_meters: sanitizedData.altitudeMeters,
          acidity_score: sanitizedData.acidityScore,
          body_score: sanitizedData.bodyScore,
          sweetness_score: sanitizedData.sweetnessScore,
          flavor_notes: sanitizedData.flavorNotes,
          description: enrichedBrandStory,
          cupping_score: sanitizedData.cuppingScore,
          awards: enrichedAwards,
          brand_story: enrichedBrandStory,
          jargon_explanations: sanitizedData.jargonExplanations,
          ai_confidence: sanitizedData.confidence,
          scanned_image_url: imageUrl,
          source: "scan",
          is_verified: false,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (insertCoffeeError) {
        console.error("Failed to insert coffee:", insertCoffeeError);
        throw new Error(`Failed to save coffee: ${insertCoffeeError.message}`);
      }
      
      coffeeId = newCoffee.id;
      isNewCoffee = true;
      console.log(`Created new coffee: ${coffeeId}`);
    }

    // Step 8: Save scan log to coffee_scans table
    const { data: scanRecord, error: insertError } = await supabaseClient
      .from("coffee_scans")
      .insert({
        user_id: user.id,
        coffee_id: coffeeId,
        image_url: imageUrl,
        tribe_match_score: tribeMatchScore,
        match_reasons: sanitizedMatchReasons,
        ai_confidence: sanitizedData.confidence,
        raw_ai_response: parsedResult,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Failed to save scan: ${insertError.message}`);
    }

    console.log("Scan saved:", scanRecord.id, "linked to coffee:", coffeeId);

    // Fetch the coffee data for the response
    const { data: coffeeData } = await supabaseClient
      .from("coffees")
      .select("*")
      .eq("id", coffeeId)
      .single();

    // Return the complete scan result
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: scanRecord.id,
          coffeeId: coffeeId,
          isNewCoffee: isNewCoffee,
          imageUrl: imageUrl,
          coffeeName: coffeeData?.name ?? sanitizedData.coffeeName,
          brand: coffeeData?.brand ?? sanitizedData.brand,
          // Structured fields
          originCountry: coffeeData?.origin_country ?? sanitizedData.originCountry,
          originRegion: coffeeData?.origin_region ?? sanitizedData.originRegion,
          originFarm: coffeeData?.origin_farm ?? sanitizedData.originFarm,
          roastLevelNumeric: coffeeData?.roast_level ?? sanitizedData.roastLevelNumeric,
          altitudeMeters: coffeeData?.altitude_meters ?? sanitizedData.altitudeMeters,
          // Legacy fields for backward compatibility
          origin: [sanitizedData.originCountry, sanitizedData.originRegion, sanitizedData.originFarm].filter(Boolean).join(", "),
          roastLevel: sanitizedData.legacyRoastLevel,
          altitude: sanitizedData.altitudeMeters ? `${sanitizedData.altitudeMeters}m` : null,
          // Other fields
          processingMethod: coffeeData?.processing_method ?? sanitizedData.processingMethod,
          variety: coffeeData?.variety ?? sanitizedData.variety,
          acidityScore: coffeeData?.acidity_score ?? sanitizedData.acidityScore,
          bodyScore: coffeeData?.body_score ?? sanitizedData.bodyScore,
          sweetnessScore: coffeeData?.sweetness_score ?? sanitizedData.sweetnessScore,
          flavorNotes: coffeeData?.flavor_notes ?? sanitizedData.flavorNotes,
          brandStory: (coffeeData as any)?.brand_story ?? enrichedBrandStory,
          awards: coffeeData?.awards ?? enrichedAwards,
          cuppingScore: coffeeData?.cupping_score ?? sanitizedData.cuppingScore,
          aiConfidence: sanitizedData.confidence,
          tribeMatchScore: tribeMatchScore,
          matchReasons: sanitizedMatchReasons,
          jargonExplanations: sanitizedData.jargonExplanations,
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
