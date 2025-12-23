# Caldi's Cup AI Assessment System

This document describes how the AI assessment system works in Caldi's Cup, including score calculation, data sources, limitations, and future enhancement opportunities.

---

## Table of Contents

1. [Overview](#overview)
2. [AI Model & Gateway](#ai-model--gateway)
3. [Score Calculation](#score-calculation)
4. [Data Sources](#data-sources)
5. [What the AI Does NOT Use](#what-the-ai-does-not-use)
6. [Tribe Matching Algorithm](#tribe-matching-algorithm)
7. [Data Validation & Security](#data-validation--security)
8. [Current Limitations](#current-limitations)
9. [Future Enhancement Opportunities](#future-enhancement-opportunities)
10. [Database Schema](#database-schema)

---

## Overview

The Caldi's Cup scanner uses AI vision to analyze coffee bag images and extract structured information about the coffee, including origin, roast level, processing method, and flavor profile scores.

**Current Implementation Status:**
- ✅ Image analysis via Gemini 2.5 Flash
- ✅ Structured data extraction (roast 1-5, altitude in meters, origin split)
- ✅ Flavor profile scoring (acidity, body, sweetness)
- ✅ Tribe match scoring
- ✅ Jargon explanations
- ⚠️ No web search capability
- ⚠️ No database lookup for existing coffees
- ⚠️ No learning from user feedback

---

## AI Model & Gateway

### Model
- **Model:** `google/gemini-2.5-flash`
- **Gateway:** Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`)
- **Capability:** Vision + Text (multimodal)

### Request Flow
```
User uploads image
       ↓
Image compressed (client-side, max 800KB)
       ↓
Base64 sent to Edge Function
       ↓
Image stored in Supabase Storage
       ↓
Gemini 2.5 Flash analyzes image
       ↓
AI returns structured JSON
       ↓
Response sanitized & validated
       ↓
Tribe match score calculated
       ↓
Saved to database
```

---

## Score Calculation

### Acidity Score (1-5)
The AI **infers** acidity based on:
- **Origin:** Ethiopian/Kenyan coffees typically score higher (3-5)
- **Roast Level:** Lighter roasts preserve acidity (higher scores)
- **Processing:** Washed coffees often have brighter acidity
- **Visible Tasting Notes:** Keywords like "citrus", "bright", "tangy"

**Example:**
- Ethiopian Yirgacheffe, Light Roast, Washed → Acidity: 4-5
- Brazilian, Dark Roast, Natural → Acidity: 1-2

### Body Score (1-5)
The AI **infers** body based on:
- **Roast Level:** Darker roasts = fuller body (higher scores)
- **Processing:** Natural/Honey processes add body
- **Origin:** Indonesian coffees known for full body
- **Visible Tasting Notes:** Keywords like "syrupy", "heavy", "full"

**Example:**
- Sumatra, Dark Roast, Wet-Hulled → Body: 4-5
- Colombian, Light Roast, Washed → Body: 2-3

### Sweetness Score (1-5)
The AI **infers** sweetness based on:
- **Processing:** Honey and Natural processes increase sweetness
- **Visible Tasting Notes:** Keywords like "honey", "caramel", "fruity"
- **Roast Level:** Medium roasts often maximize sweetness
- **Origin:** Certain regions known for sweeter profiles

**Example:**
- Costa Rica, Honey Process, Medium Roast → Sweetness: 4-5
- Kenya, Washed, Light Roast → Sweetness: 2-3

### Important Note
> **These scores are AI-inferred, not measured.** They represent educated guesses based on the AI's training knowledge of coffee characteristics. There is no cupping, no lab analysis, and no reference database calibration.

---

## Data Sources

### What the AI USES

| Source | Description |
|--------|-------------|
| **Image Visual Data** | Text, logos, colors, graphics visible on the coffee bag |
| **Gemini's Training Knowledge** | Pre-trained knowledge about coffee origins, roasters, processing methods, and flavor profiles |

### What the AI KNOWS (from training)

The AI has knowledge about:
- Major coffee roasters and their reputation
- Coffee-producing regions and their typical flavor profiles
- Processing methods and their effects on taste
- Common coffee terminology and jargon
- Award systems (Cup of Excellence, Q-scores, etc.)

---

## What the AI Does NOT Use

| Not Used | Explanation |
|----------|-------------|
| ❌ **Web Search** | The AI cannot search the internet for current information about the coffee or roaster |
| ❌ **Caldi's Database** | The AI does not query our database for previously scanned coffees or user data |
| ❌ **User Preferences** | Beyond tribe keywords, the AI doesn't learn individual user taste preferences |
| ❌ **Cupping Data** | No actual cupping scores or lab analysis data is used |
| ❌ **User Feedback** | Ratings, corrections, or feedback from users do not influence future scans |
| ❌ **Real-time Information** | No access to current prices, availability, or recent awards |

---

## Tribe Matching Algorithm

### How It Works

1. **User's Tribe** determines a set of preference keywords:

```typescript
const TRIBE_KEYWORDS = {
  fox: ["Geisha", "Rare", "Competition", "Anaerobic", "90+", "Award", "Exclusive", "Limited", "Auction"],
  owl: ["Washed", "Light Roast", "Elevation", "MASL", "Typica", "Bourbon", "Clean", "Precision", "Single Origin"],
  hummingbird: ["Natural", "Fruit", "Fermented", "Co-ferment", "Funky", "Blend", "Strawberry", "Experimental", "Wild"],
  bee: ["House Blend", "Dark Roast", "Medium Roast", "Chocolate", "Nutty", "Caramel", "Bold", "Classic", "Smooth"],
};
```

2. **Keyword Matching:** All extracted coffee data is searched for these keywords (case-insensitive)

3. **Score Calculation:**
```
Base Score: 50 points
Per Match: +15 points (max 100)
No Matches: 30-50 points (random variation)
```

4. **Match Reasons:** Each matched keyword generates a reason like `Contains "Geisha"`

### Example
A Fox tribe user scans a Geisha coffee with Competition Grade label:
- Matches: "Geisha", "Competition" = 2 keywords
- Score: 50 + (2 × 15) = 80
- Reasons: `["Contains 'Geisha'", "Contains 'Competition'"]`

---

## Data Validation & Security

### Input Sanitization

All AI-generated content is sanitized before storage:

| Field | Validation |
|-------|------------|
| `roastLevelNumeric` | Must be "1", "2", "3", "4", or "5" |
| `altitudeMeters` | Integer 0-6000, extracted from text like "1500 MASL" |
| `originCountry` | Max 100 chars, script tags removed |
| `originRegion` | Max 100 chars, script tags removed |
| `originFarm` | Max 200 chars, script tags removed |
| `flavorNotes` | Max 20 items, each max 100 chars |
| `jargonExplanations` | Max 15 entries, keys max 50 chars, values max 300 chars |

### Security Measures

- **XSS Prevention:** Script tags and JavaScript patterns stripped
- **Length Limits:** All strings have maximum lengths
- **Number Bounds:** Scores validated to 1-5, confidence to 0-1
- **CORS Restrictions:** Only allowed origins can call the edge function
- **Authentication Required:** JWT token must be valid

---

## Current Limitations

### Technical Limitations

1. **Static Knowledge Cutoff**
   - Gemini's training data has a cutoff date
   - New roasters, recent awards, or trends may not be recognized

2. **No Cross-Reference**
   - Cannot verify claims on the bag against external databases
   - Cannot compare to previously scanned coffees

3. **Image Quality Dependency**
   - Low-quality images, unusual fonts, or non-English text may reduce accuracy
   - 3D bags with curved text are challenging

4. **No Taste Calibration**
   - Scores are inferred, not measured
   - Different users may perceive flavors differently than the AI predicts

### Business Limitations

1. **No Learning Loop**
   - User ratings don't improve future scans
   - Corrections aren't incorporated

2. **No Regional Preferences**
   - Same coffee analyzed the same way regardless of user location

3. **No Inventory Awareness**
   - Cannot suggest alternatives or purchases

---

## Future Enhancement Opportunities

### Phase 1: Reference Database

Create a `reference_coffees` table with verified coffee data:

```sql
CREATE TABLE reference_coffees (
  id UUID PRIMARY KEY,
  coffee_name TEXT NOT NULL,
  brand TEXT,
  origin_country TEXT,
  origin_region TEXT,
  roast_level_numeric roast_level_enum,
  acidity_score INTEGER,
  body_score INTEGER,
  sweetness_score INTEGER,
  flavor_notes TEXT[],
  cupping_score NUMERIC,
  verified BOOLEAN DEFAULT true,
  source TEXT, -- "user_verified", "roaster_submitted", "cupping_lab"
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Benefit:** AI can receive context about similar coffees before generating scores.

### Phase 2: User Feedback Loop

Add user corrections to improve accuracy:

```sql
CREATE TABLE scan_feedback (
  id UUID PRIMARY KEY,
  scan_id UUID REFERENCES scanned_coffees(id),
  user_id UUID NOT NULL,
  field_corrected TEXT, -- "acidity_score", "origin_country", etc.
  original_value TEXT,
  corrected_value TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Benefit:** Build training data for future model improvements.

### Phase 3: Web Search Integration

Add Perplexity or similar API for real-time enrichment:

- Verify brand claims
- Find recent awards
- Get current pricing
- Check availability

**Benefit:** Up-to-date information beyond training cutoff.

### Phase 4: Calibrated Scoring

Partner with Q-graders or coffee labs:

- Submit coffees for professional cupping
- Compare AI scores to professional scores
- Create calibration factors

**Benefit:** More accurate, trusted scores.

---

## Database Schema

### Current scanned_coffees Table

```sql
CREATE TABLE public.scanned_coffees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  
  -- Coffee identification
  coffee_name TEXT,
  brand TEXT,
  
  -- Structured origin (NEW)
  origin_country TEXT,
  origin_region TEXT,
  origin_farm TEXT,
  
  -- Structured roast & altitude (NEW)
  roast_level_numeric roast_level_enum, -- '1' to '5'
  altitude_meters INTEGER,
  
  -- Legacy fields (DEPRECATED)
  origin TEXT,
  roast_level TEXT,
  altitude TEXT,
  
  -- Processing
  processing_method TEXT,
  variety TEXT,
  
  -- AI-inferred scores
  acidity_score INTEGER, -- 1-5
  body_score INTEGER,    -- 1-5
  sweetness_score INTEGER, -- 1-5
  
  -- Enrichment
  flavor_notes TEXT[],
  brand_story TEXT,
  awards TEXT[],
  cupping_score NUMERIC,
  
  -- AI metadata
  ai_confidence NUMERIC, -- 0.0-1.0
  tribe_match_score INTEGER, -- 0-100
  match_reasons TEXT[],
  jargon_explanations JSONB,
  raw_ai_response JSONB, -- For debugging, never displayed
  
  -- Timestamps
  scanned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Roast Level Enum

```sql
CREATE TYPE roast_level_enum AS ENUM ('1', '2', '3', '4', '5');

-- Mapping:
-- 1 = Light (blonde, cinnamon)
-- 2 = Light-Medium
-- 3 = Medium (city)
-- 4 = Medium-Dark (full city)
-- 5 = Dark (french, italian)
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2024-12-23 | Initial documentation | Lovable AI |
| 2024-12-23 | Added structured roast/origin schema | Lovable AI |
