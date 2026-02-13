

# Save Feedback to Database Instead of Mailto

## Overview
Replace the mailto-based submission in `FeedbackDialog` with a direct database insert, keeping the user in the app the entire time.

## Database Changes

### New table: `feedback`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | Yes | NULL |
| name | text | Yes | NULL |
| email | text | Yes | NULL |
| rating | integer | Yes | NULL |
| message | text | No | -- |
| usage_summary | text | Yes | NULL |
| created_at | timestamptz | No | now() |

- `user_id` is nullable to allow anonymous feedback (no auth required for this feature).
- `usage_summary` stores the formatted text block if the user consented.

### RLS Policies

- **INSERT**: Allow anyone (anonymous or authenticated) to insert. Anonymous users won't have a `user_id`.
  - Policy: `true` (permissive for INSERT, since feedback is public-facing)
- **SELECT**: Only admins can read feedback entries.
  - Policy: `has_role(auth.uid(), 'admin')`
- **No UPDATE/DELETE** policies for regular users.

### Migration SQL

```text
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text,
  email text,
  rating integer,
  message text NOT NULL,
  usage_summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all feedback"
  ON public.feedback FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
```

## Code Change: `FeedbackDialog.tsx`

Replace the `handleSubmit` function:
- Remove the mailto URL composition and `window.open` call
- Instead, insert a row into the `feedback` table using the Supabase client
- Include `user_id` (if logged in), `name`, `email`, `rating`, `message`, and optionally `usage_summary` (the formatted text)
- Add a loading/submitting state to disable the button during the insert
- Show a toast on error, or transition to the thank-you screen on success

No other files need to change -- the dialog UI, triggers, footer/header integrations, and FeedbackPage all remain the same.

## Summary of Changes

| Artifact | Change |
|----------|--------|
| New migration | Create `feedback` table with RLS |
| `FeedbackDialog.tsx` | Replace mailto with Supabase insert |

