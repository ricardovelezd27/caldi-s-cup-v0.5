
-- ============================================================
-- Phase 1: Caldi Learning Module - Database Foundation
-- ============================================================

-- 1. ENUMS
DO $$ BEGIN
  CREATE TYPE learning_track_id AS ENUM ('history_culture', 'bean_knowledge', 'brewing_science', 'sustainability');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE learning_level AS ENUM ('beginner', 'foundation', 'intermediate', 'advanced', 'expert');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE exercise_type AS ENUM ('multiple_choice', 'fill_in_blank', 'true_false', 'matching_pairs', 'sequencing', 'image_identification', 'categorization', 'troubleshooting', 'recipe_building', 'calculation', 'prediction', 'comparison');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. CONTENT TABLES

CREATE TABLE public.learning_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id learning_track_id NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description TEXT NOT NULL,
  description_es TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '☕',
  color_hex TEXT NOT NULL DEFAULT '#8B4513',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_bonus BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.learning_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.learning_tracks(id) ON DELETE CASCADE,
  level learning_level NOT NULL,
  name TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  description_es TEXT NOT NULL DEFAULT '',
  learning_goal TEXT NOT NULL DEFAULT '',
  learning_goal_es TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  requires_section_id UUID REFERENCES public.learning_sections(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.learning_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.learning_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  description_es TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📖',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  tribe_affinity coffee_tribe,
  estimated_minutes INTEGER NOT NULL DEFAULT 15,
  lesson_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.learning_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES public.learning_units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_es TEXT NOT NULL,
  intro_text TEXT NOT NULL DEFAULT '',
  intro_text_es TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  estimated_minutes INTEGER NOT NULL DEFAULT 4,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  exercise_count INTEGER NOT NULL DEFAULT 0,
  featured_coffee_id UUID REFERENCES public.coffees(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.learning_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.learning_lessons(id) ON DELETE CASCADE,
  exercise_type exercise_type NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  question_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url TEXT,
  audio_url TEXT,
  difficulty_score INTEGER NOT NULL DEFAULT 50,
  concept_tags TEXT[] NOT NULL DEFAULT '{}',
  mascot TEXT NOT NULL DEFAULT 'caldi',
  mascot_mood TEXT NOT NULL DEFAULT 'neutral',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. USER PROGRESS TABLES

CREATE TABLE public.learning_user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.learning_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  score_percent INTEGER NOT NULL DEFAULT 0,
  exercises_correct INTEGER NOT NULL DEFAULT 0,
  exercises_total INTEGER NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  best_score_percent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE public.learning_user_exercise_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL REFERENCES public.learning_exercises(id) ON DELETE CASCADE,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_correct BOOLEAN NOT NULL DEFAULT false,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  user_answer JSONB,
  was_review BOOLEAN NOT NULL DEFAULT false,
  lesson_attempt_id UUID REFERENCES public.learning_user_progress(id) ON DELETE SET NULL
);

-- 4. GAMIFICATION TABLES

CREATE TABLE public.learning_user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  streak_freezes_available INTEGER NOT NULL DEFAULT 0,
  streak_freeze_used_today BOOLEAN NOT NULL DEFAULT false,
  total_days_active INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  total_lessons_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.learning_leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_es TEXT NOT NULL,
  tier INTEGER NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT '🌱',
  color_hex TEXT NOT NULL DEFAULT '#8B4513',
  promote_top_n INTEGER NOT NULL DEFAULT 10,
  demote_bottom_n INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.learning_user_league (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  league_id UUID NOT NULL REFERENCES public.learning_leagues(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  previous_league_id UUID REFERENCES public.learning_leagues(id) ON DELETE SET NULL,
  promoted_at TIMESTAMPTZ,
  demoted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.learning_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  description_es TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🏆',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'completion',
  condition_type TEXT NOT NULL DEFAULT 'lessons_completed',
  condition_value INTEGER NOT NULL DEFAULT 1,
  condition_track learning_track_id,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.learning_user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.learning_achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE public.learning_user_daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  goal_xp INTEGER NOT NULL DEFAULT 10,
  earned_xp INTEGER NOT NULL DEFAULT 0,
  is_achieved BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, date)
);

-- 5. ENABLE RLS ON ALL TABLES

ALTER TABLE public.learning_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_user_exercise_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_user_league ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_user_daily_goals ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Content tables: authenticated SELECT where is_active, admin full access
CREATE POLICY "Authenticated can view active tracks" ON public.learning_tracks FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admin full access tracks" ON public.learning_tracks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view active sections" ON public.learning_sections FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admin full access sections" ON public.learning_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view active units" ON public.learning_units FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admin full access units" ON public.learning_units FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view active lessons" ON public.learning_lessons FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admin full access lessons" ON public.learning_lessons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view active exercises" ON public.learning_exercises FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admin full access exercises" ON public.learning_exercises FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User progress: own data only, no delete
CREATE POLICY "Users can view own progress" ON public.learning_user_progress FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON public.learning_user_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON public.learning_user_progress FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can view own exercise history" ON public.learning_user_exercise_history FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own exercise history" ON public.learning_user_exercise_history FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Streaks: own data only
CREATE POLICY "Users can view own streaks" ON public.learning_user_streaks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own streaks" ON public.learning_user_streaks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own streaks" ON public.learning_user_streaks FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Leagues: public SELECT for leaderboard, admin full access
CREATE POLICY "Anyone can view leagues" ON public.learning_leagues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin full access leagues" ON public.learning_leagues FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User league: own data + public leaderboard read
CREATE POLICY "Users can view own league" ON public.learning_user_league FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Public leaderboard view" ON public.learning_user_league FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own league" ON public.learning_user_league FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own league" ON public.learning_user_league FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Achievements: public SELECT, admin full access
CREATE POLICY "Anyone can view achievements" ON public.learning_achievements FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admin full access achievements" ON public.learning_achievements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User achievements: own data
CREATE POLICY "Users can view own achievements" ON public.learning_user_achievements FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own achievements" ON public.learning_user_achievements FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Daily goals: own data
CREATE POLICY "Users can view own daily goals" ON public.learning_user_daily_goals FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own daily goals" ON public.learning_user_daily_goals FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own daily goals" ON public.learning_user_daily_goals FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 7. INDEXES

CREATE INDEX idx_learning_sections_track_id ON public.learning_sections(track_id);
CREATE INDEX idx_learning_units_section_id ON public.learning_units(section_id);
CREATE INDEX idx_learning_lessons_unit_id ON public.learning_lessons(unit_id);
CREATE INDEX idx_learning_exercises_lesson_id ON public.learning_exercises(lesson_id);
CREATE INDEX idx_learning_user_progress_user_id ON public.learning_user_progress(user_id);
CREATE INDEX idx_learning_user_progress_lesson_id ON public.learning_user_progress(lesson_id);
CREATE INDEX idx_learning_user_exercise_history_user_exercise ON public.learning_user_exercise_history(user_id, exercise_id);
CREATE INDEX idx_learning_user_exercise_history_user_time ON public.learning_user_exercise_history(user_id, attempted_at DESC);
CREATE INDEX idx_learning_user_achievements_user_id ON public.learning_user_achievements(user_id);
CREATE INDEX idx_learning_user_league_user_id ON public.learning_user_league(user_id);
CREATE INDEX idx_learning_user_league_leaderboard ON public.learning_user_league(week_start_date, weekly_xp DESC);

-- 8. TRIGGERS (updated_at)

CREATE TRIGGER update_learning_tracks_updated_at BEFORE UPDATE ON public.learning_tracks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_sections_updated_at BEFORE UPDATE ON public.learning_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_units_updated_at BEFORE UPDATE ON public.learning_units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_lessons_updated_at BEFORE UPDATE ON public.learning_lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_exercises_updated_at BEFORE UPDATE ON public.learning_exercises FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_user_progress_updated_at BEFORE UPDATE ON public.learning_user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_user_streaks_updated_at BEFORE UPDATE ON public.learning_user_streaks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_user_league_updated_at BEFORE UPDATE ON public.learning_user_league FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. SEED DATA

-- 4 Tracks
INSERT INTO public.learning_tracks (track_id, name, name_es, description, description_es, icon, color_hex, sort_order, is_bonus) VALUES
  ('history_culture', 'History & Culture', 'Historia y Cultura', 'Explore the rich history and cultural traditions of coffee around the world.', 'Explora la rica historia y tradiciones culturales del café en todo el mundo.', '☕', '#8B4513', 1, false),
  ('bean_knowledge', 'Bean Knowledge', 'Conocimiento del Grano', 'Learn about origins, varieties, processing methods, and what makes each bean unique.', 'Aprende sobre orígenes, variedades, métodos de procesamiento y qué hace único a cada grano.', '🫘', '#228B22', 2, false),
  ('brewing_science', 'Brewing Science', 'Ciencia de la Preparación', 'Master the science behind extraction, water chemistry, and brewing techniques.', 'Domina la ciencia detrás de la extracción, química del agua y técnicas de preparación.', '🧪', '#4169E1', 3, false),
  ('sustainability', 'Sustainability & Ethics', 'Sostenibilidad y Ética', 'Understand fair trade, environmental impact, and ethical sourcing practices.', 'Comprende el comercio justo, impacto ambiental y prácticas de abastecimiento ético.', '🌍', '#2E8B57', 4, true);

-- 7 Leagues
INSERT INTO public.learning_leagues (name, name_es, tier, icon, color_hex, promote_top_n, demote_bottom_n) VALUES
  ('Robusta Rookie', 'Novato Robusta', 1, '🌱', '#8B4513', 10, 0),
  ('Arabica Apprentice', 'Aprendiz Arábica', 2, '☕', '#A0522D', 10, 5),
  ('Barista Bronze', 'Barista Bronce', 3, '🥉', '#CD7F32', 10, 5),
  ('Cupper''s Copper', 'Catador Cobre', 4, '🏅', '#B87333', 10, 5),
  ('Roaster''s Ruby', 'Rubí del Tostador', 5, '💎', '#E0115F', 10, 5),
  ('Origin Obsidian', 'Obsidiana de Origen', 6, '🖤', '#0F0F0F', 5, 5),
  ('Q-Grader Diamond', 'Diamante Q-Grader', 7, '💠', '#B9F2FF', 0, 5);

-- 8 Achievements
INSERT INTO public.learning_achievements (code, name, name_es, description, description_es, icon, xp_reward, category, condition_type, condition_value, sort_order) VALUES
  ('streak_7', 'Week Warrior', 'Guerrero Semanal', 'Maintain a 7-day learning streak.', 'Mantén una racha de aprendizaje de 7 días.', '🔥', 50, 'streak', 'streak_days', 7, 1),
  ('streak_30', 'Monthly Maven', 'Experto Mensual', 'Maintain a 30-day learning streak.', 'Mantén una racha de aprendizaje de 30 días.', '🔥', 200, 'streak', 'streak_days', 30, 2),
  ('streak_100', 'Century Sipper', 'Centenario del Café', 'Maintain a 100-day learning streak.', 'Mantén una racha de aprendizaje de 100 días.', '🔥', 500, 'streak', 'streak_days', 100, 3),
  ('streak_365', 'Year of Coffee', 'Año del Café', 'Maintain a 365-day learning streak.', 'Mantén una racha de aprendizaje de 365 días.', '🏆', 1000, 'streak', 'streak_days', 365, 4),
  ('first_lesson', 'First Sip', 'Primer Sorbo', 'Complete your very first lesson.', 'Completa tu primera lección.', '☕', 10, 'completion', 'lessons_completed', 1, 5),
  ('lessons_10', 'Getting Caffeinated', 'Cafeinándose', 'Complete 10 lessons.', 'Completa 10 lecciones.', '📚', 50, 'completion', 'lessons_completed', 10, 6),
  ('lessons_50', 'Coffee Scholar', 'Erudito del Café', 'Complete 50 lessons.', 'Completa 50 lecciones.', '🎓', 150, 'completion', 'lessons_completed', 50, 7),
  ('lessons_100', 'Coffee Master', 'Maestro del Café', 'Complete 100 lessons.', 'Completa 100 lecciones.', '👨‍🎓', 300, 'completion', 'lessons_completed', 100, 8);
