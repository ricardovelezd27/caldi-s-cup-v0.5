
# Plan: Open Coffee Specs and Jargon Buster Accordions by Default

## Problem
Currently, the `ScanResultsAccordions` component uses `type="single"` which only allows one accordion item to be open at a time. The `defaultValue="specs"` only opens Coffee Specs by default.

## Solution
Change the accordion to `type="multiple"` which allows multiple items to be open simultaneously, and set `defaultValue` to an array containing both "specs" and "jargon".

## File to Modify

**`src/features/scanner/components/ScanResultsAccordions.tsx`**

### Change Required

**Line 23** - Update the Accordion component props:

From:
```typescript
<Accordion type="single" collapsible className="w-full" defaultValue="specs">
```

To:
```typescript
<Accordion type="multiple" className="w-full" defaultValue={["specs", "jargon"]}>
```

## Technical Notes
- `type="multiple"` allows multiple accordion items to be expanded at the same time
- `defaultValue` accepts an array of strings when `type="multiple"`
- The `collapsible` prop is not needed with `type="multiple"` (it's implicit)
- Both "specs" and "jargon" values match the existing `AccordionItem` value props (line 26 and line 95)
