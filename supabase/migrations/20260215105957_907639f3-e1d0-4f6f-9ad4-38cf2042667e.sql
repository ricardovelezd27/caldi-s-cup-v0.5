
CREATE TABLE public.user_coffee_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coffee_id UUID NOT NULL REFERENCES public.coffees(id) ON DELETE CASCADE,
  user_body_score SMALLINT CHECK (user_body_score BETWEEN 1 AND 5),
  user_acidity_score SMALLINT CHECK (user_acidity_score BETWEEN 1 AND 5),
  user_sweetness_score SMALLINT CHECK (user_sweetness_score BETWEEN 1 AND 5),
  user_match_score SMALLINT CHECK (user_match_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, coffee_id)
);

ALTER TABLE public.user_coffee_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own ratings"
  ON public.user_coffee_ratings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ratings"
  ON public.user_coffee_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON public.user_coffee_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_coffee_ratings_updated_at
  BEFORE UPDATE ON public.user_coffee_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
