
# Fix Social Share Preview Image (WhatsApp, X, etc.)

## Problem

When sharing the site link on WhatsApp (and other social platforms), a small Lovable logo appears because the Open Graph meta tags in `index.html` point to `https://lovable.dev/opengraph-image-p98pqg.png`.

## Solution

Two changes in a single file:

### 1. Copy your favicon to use as the OG image

Copy the existing `favicon.png` to a dedicated OG image file (`public/og-image.png`) so it can be referenced with an absolute URL. If you have a larger logo (1200x630px recommended for best results on social), you can provide it and we will use that instead.

### 2. Update `index.html` meta tags

**File: `index.html`**

Replace the two Lovable URLs on lines 14 and 18 with your published domain + the OG image path:

- Line 14: `og:image` -> `https://preproductioncaldi.lovable.app/og-image.png`
- Line 18: `twitter:image` -> `https://preproductioncaldi.lovable.app/og-image.png`

---

## Important Note

Social platforms cache link previews aggressively. After publishing this change, WhatsApp may still show the old image for a while. You can force a refresh on some platforms (e.g., using Facebook's Sharing Debugger or clearing WhatsApp's cache), but it typically updates within a few hours.

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `public/og-image.png` | New (copy from favicon.png) | OG image for social sharing |
| `index.html` | Edit | Update `og:image` and `twitter:image` URLs to point to your own image |
