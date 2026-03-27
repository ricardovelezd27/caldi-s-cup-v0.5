

## Plan: Fix Track JSON Import to Handle Wrapped Format

### Problem
The importer's `TrackImportSchema` expects a flat object with `section_title`, `section_title_es`, and `units` at the top level. But the actual JSON has a wrapper structure:

```json
{
  "id": "...",
  "track_id": "history_culture",
  "name": "History & Culture",
  "sections": [
    {
      "section_title": "History & Culture",
      "section_title_es": "Historia y Cultura",
      "units": [...]
    }
  ]
}
```

The validator parses the outer object and fails because `section_title` doesn't exist at that level.

### Fix

**File: `src/features/admin/learning/services/trackImportValidator.ts`**

Update `validateTrackImportJson` to detect and unwrap common wrapper formats before validation:

1. If parsed object has a `sections` array, iterate each section and validate individually (for now, take the first section or process all)
2. If parsed object has a `track` or `data` wrapper key, unwrap it
3. If it's already a flat section object (has `section_title` + `units`), use as-is

Additionally, update the return type to support multiple sections from a single import, or flatten by processing the first section found.

**Specific change in `validateTrackImportJson`:**
```typescript
let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch {
  return { valid: false, errors: ["Invalid JSON syntax"], warnings: [] };
}

// Unwrap common wrapper formats
let sectionPayload: unknown = parsed;
if (typeof parsed === "object" && parsed !== null) {
  const obj = parsed as Record<string, unknown>;
  // Wrapped in { sections: [...] } (track-level export)
  if (Array.isArray(obj.sections) && obj.sections.length > 0) {
    sectionPayload = obj.sections[0]; // Import first section
  }
  // Wrapped in { track: { ... } } or { data: { ... } }
  else if (obj.track && typeof obj.track === "object") {
    sectionPayload = obj.track;
  } else if (obj.data && typeof obj.data === "object") {
    sectionPayload = obj.data;
  }
}
```

Then validate `sectionPayload` against `TrackImportSchema` instead of `parsed`.

### Files to Change

| File | Change |
|---|---|
| `trackImportValidator.ts` | Add unwrapping logic before schema validation to handle wrapped JSON formats |

No other files need changes. The downstream import logic in `ImportTrackJsonModal.tsx` already works correctly once validation passes.

