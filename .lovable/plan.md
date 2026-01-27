
# Plan: Align Scanner Results Page with Product Page Layout

## Overview
Refactor the Scanner Results page to follow the same 12-column grid layout pattern as the Product Page, ensuring visual consistency across the application.

## Current State Analysis

### Product Page Layout (Target Pattern)
- Uses a **12-column grid** (`grid-cols-12`)
- **Left column** (5 cols): Image → Attribute Sliders → Flavor Chart → Roaster Info
- **Right column** (7 cols): Product Info → Actions → Accordions
- **Responsive behavior**: Mobile stacks with specific ordering via `order-*` classes
- Wrapped in `PageLayout` + `Container` for consistent header/footer

### Scanner Results Page (Current)
- Uses a simple **3-column equal grid** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- No `PageLayout` wrapper - has its own inline header
- Action buttons at top, followed by 3 equal cards
- Cards: ExtractedDataCard | EnrichedDataCard | PreferenceMatchCard

## Proposed Changes

### 1. Layout Structure Alignment

Restructure `ScanResults.tsx` to match Product Page's grid pattern:

```text
Desktop (lg and up):
┌─────────────────────────────────────────────────────────┐
│ [Action Buttons: Saved | Share | Scan Another]          │
├─────────────────────┬───────────────────────────────────┤
│  (5 cols)           │  (7 cols)                         │
│  ┌───────────────┐  │  ┌─────────────────────────────┐  │
│  │ Coffee Image  │  │  │ Coffee Name & Brand         │  │
│  │ + Name/Brand  │  │  │ (larger heading style)      │  │
│  │ + Origin Info │  │  │ Roast Badge, AI Confidence  │  │
│  └───────────────┘  │  └─────────────────────────────┘  │
│                     │                                   │
│  ┌───────────────┐  │  ┌─────────────────────────────┐  │
│  │ Coffee        │  │  │ Your Match Card             │  │
│  │ Attributes    │  │  │ (Gauge + Match Reasons)     │  │
│  │ (Body/Acid/   │  │  └─────────────────────────────┘  │
│  │ Sweetness)    │  │                                   │
│  └───────────────┘  │  ┌─────────────────────────────┐  │
│                     │  │ Accordions:                 │  │
│  ┌───────────────┐  │  │ - Tasting Notes             │  │
│  │ Flavor Notes  │  │  │ - Jargon Buster             │  │
│  │ (chips/tags)  │  │  │ - Brand Story               │  │
│  └───────────────┘  │  └─────────────────────────────┘  │
└─────────────────────┴───────────────────────────────────┘

Mobile:
[Action Buttons]
[Image + Name + Origin]
[Coffee Attributes]
[Your Match Card]
[Flavor Notes]
[Accordions]
```

### 2. Component Restructuring

**New/Modified Components:**

| Component | Purpose |
|-----------|---------|
| `ScanResultsImage.tsx` | Reuse ProductImage pattern with scanned coffee image |
| `ScanResultsInfo.tsx` | Coffee name, brand, origin, roast level badge (mirroring ProductInfo) |
| `ScanResultsAttributes.tsx` | Acidity/Body/Sweetness sliders (reuse AttributeSlider component) |
| `ScanResultsMatch.tsx` | Refactored PreferenceMatchCard without Card wrapper |
| `ScanResultsAccordions.tsx` | New accordion component for Tasting Notes, Jargon Buster, Brand Story |

### 3. File Changes

#### A. `src/features/scanner/components/ScanResults.tsx`
**Complete rewrite** to match Product Page grid structure:
- Use `grid-cols-1 lg:grid-cols-12` layout
- Left column (`lg:col-span-5`): Image, Attributes, Flavor Notes  
- Right column (`lg:col-span-7`): Info, Match Score, Accordions
- Apply responsive `order-*` classes for mobile stacking
- Move action buttons into a dedicated action bar

#### B. `src/features/scanner/components/ScanResultsInfo.tsx` (New)
- Extract coffee name, brand, roast level badge into standalone component
- Mirror `ProductInfo.tsx` styling (Bangers font, secondary link for roaster)

#### C. `src/features/scanner/components/ScanResultsAttributes.tsx` (New)
- Wrap the AttributeSlider components in a card matching Product Page style
- Use existing `AttributeSlider` from marketplace

#### D. `src/features/scanner/components/ScanResultsAccordions.tsx` (New)
- Create accordion for: Tasting Notes, Jargon Buster, About the Roaster
- Mirror `ProductAccordions.tsx` structure and styling

#### E. Update `ExtractedDataCard.tsx`
- Simplify to only show the image portion
- Move name/brand/origin info to `ScanResultsInfo.tsx`

#### F. Deprecate standalone cards
- `EnrichedDataCard.tsx` - content distributed across new components
- `PreferenceMatchCard.tsx` - becomes `ScanResultsMatch.tsx` for consistency

#### G. Update `src/features/scanner/components/index.ts`
- Export new components
- Keep legacy exports for backward compatibility

### 4. Styling Consistency

All components will use the brand design system:
- **Borders**: `border-4 border-border rounded-lg`
- **Shadows**: `shadow-[4px_4px_0px_0px_hsl(var(--border))]`
- **Typography**: `font-bangers` for headings, `font-inter` for body
- **Padding**: `p-4` or `p-5` consistent with Product Page cards

### 5. Mobile Responsive Ordering

Following Product Page pattern:
```typescript
// Mobile order (stacked)
<div className="order-1">Image + Basic Info</div>
<div className="order-2 lg:hidden">Coffee Name/Brand (mobile)</div>
<div className="order-3">Attributes Card</div>
<div className="order-4">Match Score Card</div>
<div className="order-5">Flavor Notes</div>
<div className="order-6 lg:hidden">Accordions (mobile)</div>
```

---

## Technical Considerations

### Reusing Existing Components
- `AttributeSlider` from marketplace can be reused directly
- `Accordion` component from shadcn/ui for collapsible sections
- `Badge` for flavor notes and roast level display

### Data Mapping
Map `ScannedCoffee` fields to UI sections:
- `imageUrl` → Image component
- `coffeeName`, `brand`, `roastLevelNumeric` → Info component
- `originCountry`, `originRegion`, `originFarm` → Info component (origin line)
- `acidityScore`, `bodyScore`, `sweetnessScore` → Attributes component
- `flavorNotes` → Flavor Notes section
- `tribeMatchScore`, `matchReasons` → Match component
- `jargonExplanations` → Accordion (Jargon Buster)
- `brandStory` → Accordion (About the Roaster)

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/features/scanner/components/ScanResults.tsx` | Major refactor |
| `src/features/scanner/components/ScanResultsInfo.tsx` | Create new |
| `src/features/scanner/components/ScanResultsAttributes.tsx` | Create new |
| `src/features/scanner/components/ScanResultsMatch.tsx` | Create new |
| `src/features/scanner/components/ScanResultsAccordions.tsx` | Create new |
| `src/features/scanner/components/ScanResultsImage.tsx` | Create new |
| `src/features/scanner/components/index.ts` | Update exports |

### Legacy Component Handling
- Keep `ExtractedDataCard`, `EnrichedDataCard`, `PreferenceMatchCard` for backward compatibility
- Mark as deprecated in comments
- New layout uses the new smaller, focused components

---

## Summary

This refactor will:
1. Align Scanner Results with Product Page's proven layout pattern
2. Improve visual consistency across the app
3. Enable better responsive behavior with explicit mobile ordering
4. Promote component reuse (AttributeSlider, Accordion patterns)
5. Follow existing brand design system (4px borders, shadows, typography)
