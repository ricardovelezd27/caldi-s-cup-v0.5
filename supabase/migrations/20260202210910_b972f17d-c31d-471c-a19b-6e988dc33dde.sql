-- =====================================================
-- Phase A4: Dashboard Widgets Table
-- =====================================================

-- Create widget_type enum for type safety
CREATE TYPE public.widget_type AS ENUM (
  'welcome_hero',
  'coffee_tribe',
  'recent_scans',
  'favorites',
  'inventory',
  'weekly_goal',
  'brewing_level',
  'quick_scan',
  'recent_brews',
  'recommendations'
);

-- Create dashboard_widgets table
CREATE TABLE public.dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  widget_type widget_type NOT NULL,
  position JSONB DEFAULT '{"row": 0, "col": 0, "width": 1, "height": 1}'::jsonb,
  config JSONB DEFAULT '{}'::jsonb,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dashboard_widgets
CREATE POLICY "Users can view own widgets"
  ON public.dashboard_widgets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own widgets"
  ON public.dashboard_widgets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own widgets"
  ON public.dashboard_widgets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own widgets"
  ON public.dashboard_widgets FOR DELETE
  USING (user_id = auth.uid());

-- Index for faster user widget queries
CREATE INDEX idx_dashboard_widgets_user_id ON public.dashboard_widgets(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_dashboard_widgets_updated_at
  BEFORE UPDATE ON public.dashboard_widgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- Phase A5: Recipes Table
-- =====================================================

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coffee_id UUID REFERENCES public.coffees(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  brew_method TEXT NOT NULL,
  water_temp_celsius INTEGER CHECK (water_temp_celsius BETWEEN 0 AND 100),
  grind_size TEXT,
  ratio TEXT,
  brew_time_seconds INTEGER,
  steps TEXT[] DEFAULT '{}'::text[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes
CREATE POLICY "Users can view own recipes"
  ON public.recipes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view public recipes"
  ON public.recipes FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own recipes"
  ON public.recipes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own recipes"
  ON public.recipes FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own recipes"
  ON public.recipes FOR DELETE
  USING (user_id = auth.uid());

-- Admins have full access to recipes
CREATE POLICY "Admins have full access to recipes"
  ON public.recipes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Indexes for recipes
CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX idx_recipes_coffee_id ON public.recipes(coffee_id);
CREATE INDEX idx_recipes_is_public ON public.recipes(is_public) WHERE is_public = true;
CREATE INDEX idx_recipes_brew_method ON public.recipes(brew_method);

-- Trigger for updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- Function to create default widgets for new users
-- =====================================================

CREATE OR REPLACE FUNCTION public.create_default_widgets()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default widgets for new user
  INSERT INTO public.dashboard_widgets (user_id, widget_type, position, is_visible) VALUES
    (NEW.id, 'welcome_hero', '{"row": 0, "col": 0, "width": 2, "height": 1}'::jsonb, true),
    (NEW.id, 'coffee_tribe', '{"row": 1, "col": 0, "width": 1, "height": 1}'::jsonb, true),
    (NEW.id, 'quick_scan', '{"row": 1, "col": 1, "width": 1, "height": 1}'::jsonb, true),
    (NEW.id, 'weekly_goal', '{"row": 2, "col": 0, "width": 1, "height": 1}'::jsonb, true),
    (NEW.id, 'recent_brews', '{"row": 2, "col": 1, "width": 1, "height": 1}'::jsonb, true);
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create widgets on profile creation
CREATE TRIGGER on_profile_created_create_widgets
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_widgets();