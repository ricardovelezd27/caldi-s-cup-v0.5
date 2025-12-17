-- Create brewing_level enum
CREATE TYPE public.brewing_level AS ENUM ('beginner', 'intermediate', 'expert');

-- Add weekly goal and brewing level to profiles
ALTER TABLE public.profiles
ADD COLUMN weekly_goal_target INTEGER DEFAULT 10,
ADD COLUMN brewing_level public.brewing_level DEFAULT 'beginner';

-- Create brew_logs table
CREATE TABLE public.brew_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  coffee_name TEXT NOT NULL,
  brew_method TEXT NOT NULL,
  brewed_at TIMESTAMPTZ DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on brew_logs
ALTER TABLE public.brew_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for brew_logs
CREATE POLICY "Users can view own brews" ON public.brew_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own brews" ON public.brew_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own brews" ON public.brew_logs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own brews" ON public.brew_logs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes for brew_logs
CREATE INDEX idx_brew_logs_user_id ON public.brew_logs(user_id);
CREATE INDEX idx_brew_logs_brewed_at ON public.brew_logs(brewed_at DESC);

-- Create user_favorites table
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  coffee_name TEXT NOT NULL,
  roaster_name TEXT,
  brew_method TEXT,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  image_url TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, coffee_name)
);

-- Enable RLS on user_favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own favorites" ON public.user_favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own favorites" ON public.user_favorites
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own favorites" ON public.user_favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Index for user_favorites
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);