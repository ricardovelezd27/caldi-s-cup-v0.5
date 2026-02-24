
-- 1. Add hearts columns to learning_user_streaks
ALTER TABLE public.learning_user_streaks
  ADD COLUMN hearts INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN max_hearts INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN hearts_last_refilled_at TIMESTAMPTZ DEFAULT now();

-- 2. Create the update_streak_and_xp RPC function
CREATE OR REPLACE FUNCTION public.update_streak_and_xp(
  p_user_id UUID,
  p_date DATE,
  p_xp_earned INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_last_activity DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_result JSONB;
  v_yesterday DATE := p_date - INTERVAL '1 day';
BEGIN
  -- Get current streak data
  SELECT last_activity_date, current_streak, longest_streak
  INTO v_last_activity, v_current_streak, v_longest_streak
  FROM learning_user_streaks
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    -- Create new streak record
    INSERT INTO learning_user_streaks (
      user_id, current_streak, longest_streak,
      last_activity_date, streak_start_date,
      total_days_active, total_xp, total_lessons_completed
    ) VALUES (
      p_user_id, 1, 1, p_date, p_date, 1, p_xp_earned, 1
    );
    v_result := jsonb_build_object(
      'action', 'created',
      'current_streak', 1,
      'longest_streak', 1,
      'total_xp', p_xp_earned,
      'total_lessons_completed', 1
    );
    RETURN v_result;
  END IF;

  -- Already practiced today
  IF v_last_activity = p_date THEN
    UPDATE learning_user_streaks SET
      total_xp = total_xp + p_xp_earned,
      total_lessons_completed = total_lessons_completed + 1
    WHERE user_id = p_user_id
    RETURNING jsonb_build_object(
      'action', 'same_day',
      'current_streak', current_streak,
      'longest_streak', longest_streak,
      'total_xp', total_xp,
      'total_lessons_completed', total_lessons_completed
    ) INTO v_result;
    RETURN v_result;
  END IF;

  -- Practiced yesterday - continue streak
  IF v_last_activity = v_yesterday THEN
    UPDATE learning_user_streaks SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_activity_date = p_date,
      total_days_active = total_days_active + 1,
      total_xp = total_xp + p_xp_earned,
      total_lessons_completed = total_lessons_completed + 1,
      streak_freeze_used_today = false
    WHERE user_id = p_user_id
    RETURNING jsonb_build_object(
      'action', 'incremented',
      'current_streak', current_streak,
      'longest_streak', longest_streak,
      'total_xp', total_xp,
      'total_lessons_completed', total_lessons_completed
    ) INTO v_result;
    RETURN v_result;
  END IF;

  -- Streak broken - reset
  UPDATE learning_user_streaks SET
    current_streak = 1,
    longest_streak = GREATEST(longest_streak, 1),
    last_activity_date = p_date,
    streak_start_date = p_date,
    total_days_active = total_days_active + 1,
    total_xp = total_xp + p_xp_earned,
    total_lessons_completed = total_lessons_completed + 1,
    streak_freeze_used_today = false
  WHERE user_id = p_user_id
  RETURNING jsonb_build_object(
    'action', 'reset',
    'current_streak', current_streak,
    'longest_streak', longest_streak,
    'total_xp', total_xp,
    'total_lessons_completed', total_lessons_completed
  ) INTO v_result;
  RETURN v_result;
END;
$$;

-- 3. Seed achievement definitions
INSERT INTO public.learning_achievements (code, name, name_es, description, description_es, icon, category, condition_type, condition_value, condition_track, xp_reward, sort_order) VALUES
  ('streak_7', 'Week Warrior', 'Guerrero Semanal', '7-day streak', 'Racha de 7 días', '🔥', 'streak', 'streak_days', 7, NULL, 50, 1),
  ('streak_30', 'Monthly Maven', 'Maestro Mensual', '30-day streak', 'Racha de 30 días', '🔥', 'streak', 'streak_days', 30, NULL, 200, 2),
  ('streak_100', 'Century Sipper', 'Centenario', '100-day streak', 'Racha de 100 días', '🔥', 'streak', 'streak_days', 100, NULL, 500, 3),
  ('streak_365', 'Year of Coffee', 'Año Cafetero', '365-day streak', 'Racha de 365 días', '🏆', 'streak', 'streak_days', 365, NULL, 1000, 4),
  ('first_lesson', 'First Sip', 'Primer Sorbo', 'Complete your first lesson', 'Completa tu primera lección', '☕', 'completion', 'lessons_completed', 1, NULL, 10, 10),
  ('lessons_10', 'Getting Caffeinated', 'Cafeinándose', 'Complete 10 lessons', 'Completa 10 lecciones', '📚', 'completion', 'lessons_completed', 10, NULL, 50, 11),
  ('lessons_50', 'Coffee Scholar', 'Erudito del Café', 'Complete 50 lessons', 'Completa 50 lecciones', '🎓', 'completion', 'lessons_completed', 50, NULL, 150, 12),
  ('lessons_100', 'Coffee Master', 'Maestro del Café', 'Complete 100 lessons', 'Completa 100 lecciones', '👨‍🎓', 'completion', 'lessons_completed', 100, NULL, 300, 13),
  ('track_brewing', 'Brew Master', 'Maestro de Preparación', 'Complete the Brewing Science track', 'Completa la ruta de Ciencia de Preparación', '🧪', 'mastery', 'track_complete', 1, 'brewing_science', 500, 20),
  ('track_bean', 'Bean Expert', 'Experto en Granos', 'Complete the Bean Knowledge track', 'Completa la ruta de Conocimiento del Grano', '🫘', 'mastery', 'track_complete', 1, 'bean_knowledge', 500, 21),
  ('track_history', 'Coffee Historian', 'Historiador del Café', 'Complete the History & Culture track', 'Completa la ruta de Historia y Cultura', '📜', 'mastery', 'track_complete', 1, 'history_culture', 500, 22),
  ('track_sustainability', 'Eco Champion', 'Campeón Eco', 'Complete the Sustainability track', 'Completa la ruta de Sustentabilidad', '🌱', 'mastery', 'track_complete', 1, 'sustainability', 500, 23)
ON CONFLICT (code) DO NOTHING;
