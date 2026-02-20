# Caldi's Cup AI Assessment System

This document describes how the AI assessment system works in Caldi's Cup, including architecture, data flow, score calculation, and enhancement opportunities.

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Scanner Sequence Diagram](#scanner-sequence-diagram)
4. [AI Model & Gateway](#ai-model--gateway)
5. [Score Calculation](#score-calculation)
6. [Tribe Matching Algorithm](#tribe-matching-algorithm)
7. [Data Validation & Security](#data-validation--security)
8. [Current Limitations](#current-limitations)
9. [Future Enhancement Opportunities](#future-enhancement-opportunities)
10. [Database Schema](#database-schema)

---

## Overview

The Caldi's Cup scanner uses AI vision to analyze coffee bag images and extract structured information about the coffee, including origin, roast level, processing method, and flavor profile scores.

### Current Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Image analysis | ✅ Complete | Gemini 2.5 Flash |
| Structured data extraction | ✅ Complete | Roast 1-5, altitude, origin split |
| Flavor profile scoring | ✅ Complete | Acidity, body, sweetness (1-5) |
| Tribe match scoring | ✅ Complete | Keyword-based matching |
| Jargon explanations | ✅ Complete | AI-generated definitions |
| Auto roaster creation | ✅ Complete | Creates on new brand |
| Unified coffee catalog | ✅ Complete | Single source of truth |
| Web search capability | ⚠️ Not Available | Static training knowledge only |
| User feedback learning | ⚠️ Not Available | Future enhancement |
| User coffee ratings | ✅ Complete | Personal acidity/body/sweetness |
| Scan error reports | ✅ Complete | Users flag AI inaccuracies |
| Manual coffee add | ✅ Complete | Form-based entry (source: manual) |
| i18n support | ✅ Complete | Scanner UI in EN/ES |

---

## System Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AI SCANNER SYSTEM                                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │   ScanUploader   │  │   ScanProgress   │  │   ScanResults    │      │
│  │   - Image input  │  │   - Status bar   │  │   - CoffeeProfile│      │
│  │   - Compression  │  │   - Step display │  │   - Actions      │      │
│  │   - Validation   │  │                  │  │   - JargonBuster │      │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘      │
│           │                     │                     │                 │
│           └─────────────────────┼─────────────────────┘                 │
│                                 │                                       │
│  ┌──────────────────────────────▼──────────────────────────────────┐   │
│  │                     useCoffeeScanner Hook                        │   │
│  │   - State machine (idle → uploading → scanning → done → error)  │   │
│  │   - Image compression (max 800KB)                                │   │
│  │   - Error handling                                               │   │
│  └──────────────────────────────┬──────────────────────────────────┘   │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
                                  │ POST /functions/v1/scan-coffee
                                  │ { image: base64, userTribe: string }
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EDGE FUNCTION LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      scan-coffee/index.ts                         │  │
│  │                                                                   │  │
│  │  1. Authenticate request (JWT validation)                        │  │
│  │  2. Upload image to storage bucket                               │  │
│  │  3. Build multimodal prompt with tribe keywords                  │  │
│  │  4. Call Lovable AI Gateway → Gemini 2.5 Flash                   │  │
│  │  5. Parse structured JSON response                               │  │
│  │  6. Sanitize & validate all fields                               │  │
│  │  7. Calculate tribe match score                                  │  │
│  │  8. Find or create roaster profile                               │  │
│  │  9. Insert coffee into unified catalog                           │  │
│  │  10. Insert scan record                                          │  │
│  │  11. Return ScannedCoffee result                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Lovable AI     │   │    Supabase     │   │    Supabase     │
│  Gateway        │   │    Storage      │   │    Database     │
├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ Gemini 2.5 Flash│   │ coffee-scans    │   │ coffees         │
│ Multimodal      │   │ bucket          │   │ coffee_scans    │
│ Vision + Text   │   │ (images)        │   │ roasters        │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## Scanner Sequence Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SCANNER SEQUENCE DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────────┘

 ┌──────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 │ User │    │ Scanner │    │  Edge    │    │ Gemini   │    │ Database │
 │      │    │   Hook  │    │ Function │    │ AI       │    │          │
 └──┬───┘    └────┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
    │             │              │               │               │
    │ 1. Upload   │              │               │               │
    │    Image    │              │               │               │
    │ ───────────>│              │               │               │
    │             │              │               │               │
    │             │ 2. Compress  │               │               │
    │             │    to 800KB  │               │               │
    │             │    max       │               │               │
    │             │              │               │               │
    │             │ 3. POST with │               │               │
    │             │    JWT token │               │               │
    │             │ ────────────>│               │               │
    │             │              │               │               │
    │             │              │ 4. Validate   │               │
    │             │              │    auth       │               │
    │             │              │               │               │
    │             │              │ 5. Upload to  │               │
    │             │              │    storage    │               │
    │             │              │ ─────────────────────────────>│
    │             │              │               │               │
    │             │              │ 6. Build      │               │
    │             │              │    multimodal │               │
    │             │              │    prompt     │               │
    │             │              │               │               │
    │             │              │ 7. Call AI    │               │
    │             │              │    Gateway    │               │
    │             │              │ ─────────────>│               │
    │             │              │               │               │
    │             │              │               │ 8. Analyze    │
    │             │              │               │    image      │
    │             │              │               │               │
    │             │              │ 9. JSON       │               │
    │             │              │    response   │               │
    │             │              │<─────────────│               │
    │             │              │               │               │
    │             │              │ 10. Sanitize  │               │
    │             │              │     & validate│               │
    │             │              │               │               │
    │             │              │ 11. Calculate │               │
    │             │              │     tribe     │               │
    │             │              │     match     │               │
    │             │              │               │               │
    │             │              │ 12. Find/     │               │
    │             │              │     Create    │               │
    │             │              │     Roaster   │               │
    │             │              │ ─────────────────────────────>│
    │             │              │               │               │
    │             │              │ 13. INSERT    │               │
    │             │              │     coffee    │               │
    │             │              │ ─────────────────────────────>│
    │             │              │               │               │
    │             │              │ 14. INSERT    │               │
    │             │              │     scan log  │               │
    │             │              │ ─────────────────────────────>│
    │             │              │               │               │
    │             │ 15. Return   │               │               │
    │             │     result   │               │               │
    │             │<────────────│               │               │
    │             │              │               │               │
    │ 16. Display │              │               │               │
    │     profile │              │               │               │
    │<────────────│              │               │               │
    │             │              │               │               │
```

---

## AI Model & Gateway

### Model Details

| Property | Value |
|----------|-------|
| Model | `google/gemini-2.5-flash` |
| Gateway | Lovable AI Gateway |
| Capability | Vision + Text (multimodal) |
| API Key | Managed by Lovable (no user key required) |

### Request Structure

```typescript
{
  model: "google/gemini-2.5-flash",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: systemPrompt + userContext },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64}` } }
      ]
    }
  ],
  max_tokens: 2000,
  temperature: 0.3
}
```

### Prompt Engineering

The prompt includes:
1. **System instructions** for structured JSON output
2. **User's coffee tribe** keywords for personalization
3. **Image data** as base64

---

## Score Calculation

### Acidity Score (1-5)

The AI **infers** acidity based on:

| Factor | Higher Score | Lower Score |
|--------|-------------|-------------|
| Origin | Ethiopian, Kenyan | Brazilian |
| Roast Level | Light | Dark |
| Processing | Washed | Natural |
| Tasting Notes | "citrus", "bright" | "earthy", "smooth" |

### Body Score (1-5)

The AI **infers** body based on:

| Factor | Higher Score | Lower Score |
|--------|-------------|-------------|
| Roast Level | Dark | Light |
| Processing | Natural, Honey | Washed |
| Origin | Indonesian | Central American |
| Tasting Notes | "syrupy", "full" | "tea-like", "delicate" |

### Sweetness Score (1-5)

The AI **infers** sweetness based on:

| Factor | Higher Score | Lower Score |
|--------|-------------|-------------|
| Processing | Honey, Natural | Washed |
| Tasting Notes | "honey", "caramel" | "dry", "bitter" |
| Roast Level | Medium | Very Dark |

> **Note**: These scores are AI-inferred, not measured. They represent educated guesses based on training knowledge.

---

## Tribe Matching Algorithm

### Tribe Keywords

```typescript
const TRIBE_KEYWORDS = {
  fox: [
    "Geisha", "Rare", "Competition", "Anaerobic", 
    "90+", "Award", "Exclusive", "Limited", "Auction"
  ],
  owl: [
    "Washed", "Light Roast", "Elevation", "MASL", 
    "Typica", "Bourbon", "Clean", "Precision", "Single Origin"
  ],
  hummingbird: [
    "Natural", "Fruit", "Fermented", "Co-ferment", 
    "Funky", "Blend", "Strawberry", "Experimental", "Wild"
  ],
  bee: [
    "House Blend", "Dark Roast", "Medium Roast", 
    "Chocolate", "Nutty", "Caramel", "Bold", "Classic", "Smooth"
  ]
};
```

### Activity Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TRIBE MATCHING FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │     START       │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Get user's tribe       │
                    │  keywords from config   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Concatenate all        │
                    │  coffee data into       │
                    │  searchable string      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Initialize:            │
                    │  - matchCount = 0       │
                    │  - matchReasons = []    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  For each keyword       │
                    │  in tribe keywords      │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              │                                     │
              ▼                                     ▼
     ┌─────────────────┐                  ┌─────────────────┐
     │ Keyword found   │                  │ Keyword not     │
     │ (case-insensitive)                 │ found           │
     └────────┬────────┘                  └────────┬────────┘
              │                                    │
              ▼                                    │
     ┌─────────────────┐                          │
     │ matchCount++    │                          │
     │ Add reason:     │                          │
     │ "Contains       │                          │
     │  'keyword'"     │                          │
     └────────┬────────┘                          │
              │                                    │
              └────────────────┬───────────────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │  Calculate score:       │
                    │  if matchCount > 0:     │
                    │    50 + (matchCount*15) │
                    │    max 100              │
                    │  else:                  │
                    │    random(30, 50)       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Return:                │
                    │  - tribeMatchScore      │
                    │  - matchReasons[]       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                         ┌─────────────────┐
                         │      END        │
                         └─────────────────┘
```

---

## Data Validation & Security

### Input Sanitization

| Field | Validation Rule |
|-------|----------------|
| `roastLevelNumeric` | Must be "1", "2", "3", "4", or "5" |
| `altitudeMeters` | Integer 0-6000 |
| `originCountry` | Max 100 chars, no scripts |
| `originRegion` | Max 100 chars, no scripts |
| `originFarm` | Max 200 chars, no scripts |
| `flavorNotes` | Max 20 items, each max 100 chars |
| `jargonExplanations` | Max 15 entries, keys 50 chars, values 300 chars |

### Security Measures

| Measure | Implementation |
|---------|---------------|
| XSS Prevention | Script tags and JavaScript patterns stripped |
| Length Limits | All strings have maximum lengths |
| Number Bounds | Scores validated to 1-5, confidence to 0-1 |
| Authentication | JWT token required |
| RLS | Users can only see own scans |

---

## Current Limitations

### Technical Limitations

1. **Static Knowledge Cutoff**: Gemini's training data has a cutoff date
2. **No Cross-Reference**: Cannot verify claims against external databases
3. **Image Quality Dependency**: Low-quality images reduce accuracy
4. **No Taste Calibration**: Scores are inferred, not measured

### Business Limitations

1. **No Learning Loop**: User ratings don't improve future scans
2. **No Regional Preferences**: Same analysis regardless of location
3. **No Inventory Awareness**: Cannot suggest alternatives

---

## Future Enhancement Opportunities

### Phase 1: Reference Database

Create a `reference_coffees` table with verified coffee data to provide AI context.

### Phase 2: User Feedback Loop

Add `scan_feedback` table to track user corrections for training data.

### Phase 3: Web Search Integration

Add Perplexity or similar API for real-time enrichment (verify claims, find awards, get pricing).

### Phase 4: Calibrated Scoring

Partner with Q-graders or coffee labs for professional cupping comparison.

---

## Database Schema

### Unified Coffee Table

```sql
CREATE TABLE public.coffees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roaster_id UUID REFERENCES roasters(id),
  name TEXT NOT NULL,
  brand TEXT,
  
  -- Structured origin
  origin_country TEXT,
  origin_region TEXT,
  origin_farm TEXT,
  
  -- Structured attributes
  roast_level roast_level_enum, -- '1' to '5'
  altitude_meters INTEGER,
  processing_method TEXT,
  variety TEXT,
  
  -- AI-inferred scores
  acidity_score INTEGER,  -- 1-5
  body_score INTEGER,     -- 1-5
  sweetness_score INTEGER, -- 1-5
  
  -- Enrichment
  flavor_notes TEXT[],
  description TEXT,
  brand_story TEXT,
  awards TEXT[],
  cupping_score NUMERIC,
  
  -- AI metadata
  ai_confidence NUMERIC,
  jargon_explanations JSONB,
  
  -- Source tracking
  source coffee_source NOT NULL DEFAULT 'scan',
  is_verified BOOLEAN DEFAULT false,
  created_by UUID,
  
  -- Timestamps
  image_url TEXT,
  scanned_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Coffee Scans Log

```sql
CREATE TABLE public.coffee_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  coffee_id UUID NOT NULL REFERENCES coffees(id),
  image_url TEXT NOT NULL,
  
  -- Scan-specific data
  tribe_match_score INTEGER,
  match_reasons TEXT[],
  ai_confidence NUMERIC,
  raw_ai_response JSONB,
  
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

### Coffee Source Enum

```sql
CREATE TYPE coffee_source AS ENUM ('scan', 'admin', 'roaster', 'import', 'manual');

-- Mapping:
-- scan = User-scanned coffees (AI-generated data)
-- admin = Admin-verified coffees
-- roaster = Roaster-uploaded products
-- import = Bulk-imported catalog
-- manual = User manually added via form
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-20 | Added user ratings, scan error reports, manual add, i18n notes | Lovable AI |
| 2026-02-02 | Added UML diagrams and flow charts | Lovable AI |
| 2026-02-02 | Documented unified coffee catalog | Lovable AI |
| 2024-12-23 | Initial documentation | Lovable AI |
| 2024-12-23 | Added structured roast/origin schema | Lovable AI |

---

*Last Updated: 2026-02-20*
