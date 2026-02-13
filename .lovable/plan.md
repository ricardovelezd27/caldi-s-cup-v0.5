

# Fix Scanner Flow: Scan First, Sign Up Later

## Overview
Currently, the Scanner page redirects unauthenticated users to `/auth` before they can do anything. This blocks users from experiencing the app's core value. The fix allows anyone to scan a coffee and see full AI results -- authentication is only required when they try to save (favorites/inventory).

## Changes

### 1. ScannerPage.tsx -- Remove Auth Gate
- Remove the `useEffect` that redirects to `/auth` when no user (lines 29-34)
- Remove the `if (!user) return null` guard (lines 55-57)
- Keep the auth loading skeleton but only show it when `authLoading && user` (already logged in, waiting for profile)
- Hide the "Manual Add" tab for unauthenticated users (requires DB writes)
- Show the "Take the Quiz" alert only when `user && !profile?.coffee_tribe` (not for anonymous visitors)

### 2. Edge Function (scan-coffee/index.ts) -- Support Anonymous Scans
The edge function currently requires a valid user token and persists everything to the database. For anonymous users:
- Detect anonymous mode: if no valid auth token, set `isAnonymous = true`
- Skip image upload to storage (no user folder)
- Skip database persistence (no `coffees` insert, no `coffee_scans` insert, no roaster creation)
- Still perform the full AI analysis (Gemini call) and Firecrawl enrichment
- Return the AI results with a temporary UUID (`crypto.randomUUID()`) instead of a DB-generated ID
- Authenticated users continue to get full persistence as before

### 3. useCoffeeScanner.ts -- Remove User Check
- Remove the `if (!user)` early return that blocks scanning (lines 38-41)
- When no user session exists, use the Supabase anon key as the Authorization Bearer token instead of the session access token
- Both paths call the same edge function endpoint

### 4. CoffeeActions.tsx -- Redirect to Sign Up
- When `user` is null and they click Favorites or Inventory: navigate to `/auth` with `state: { from: '/scanner' }` instead of just showing a toast
- Use a friendlier message: "Sign up to save this coffee to your collection"

## Technical Details

### Edge Function Branching Logic
```text
Request arrives
  |
  +-- Extract auth header
  +-- Try getClaims(token)
  |     |
  |     +-- Success: isAnonymous = false, userId = claims.sub
  |     +-- Fail / no header / anon key: isAnonymous = true
  |
  +-- Validate imageBase64 input
  |
  +-- if (!isAnonymous): Upload image to storage
  +-- Call Gemini AI (always)
  +-- Sanitize AI output (always)
  +-- Calculate tribe match (always, uses userTribe from request body)
  |
  +-- if (!isAnonymous):
  |     +-- Check catalog for existing coffee match
  |     +-- Enrich with Firecrawl if new
  |     +-- Create/find roaster
  |     +-- Insert into coffees table
  |     +-- Insert into coffee_scans table
  |     +-- Return full persisted result
  |
  +-- if (isAnonymous):
        +-- Still check catalog for matches (read-only, uses service role)
        +-- Enrich with Firecrawl if new (enrichment only, no DB write)
        +-- Return AI results with temporary ID
        +-- Set isNewCoffee = null (unknown, not persisted)
```

### Files Modified
1. `src/features/scanner/ScannerPage.tsx` -- remove auth redirect and user guard
2. `src/features/scanner/hooks/useCoffeeScanner.ts` -- remove user check, use anon key fallback
3. `supabase/functions/scan-coffee/index.ts` -- add anonymous scan path
4. `src/features/coffee/components/CoffeeActions.tsx` -- navigate to auth instead of toast

