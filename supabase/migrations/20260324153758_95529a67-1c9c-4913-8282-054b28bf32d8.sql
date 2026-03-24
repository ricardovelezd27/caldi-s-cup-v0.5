ALTER TABLE public.dashboard_widgets ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Backfill existing widgets with sequential order per user
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) - 1 AS rn
  FROM public.dashboard_widgets
)
UPDATE public.dashboard_widgets SET sort_order = ranked.rn FROM ranked WHERE dashboard_widgets.id = ranked.id;