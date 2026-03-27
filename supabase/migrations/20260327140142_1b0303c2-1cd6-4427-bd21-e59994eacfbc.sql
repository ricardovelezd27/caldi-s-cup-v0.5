UPDATE learning_exercises
SET question_data = jsonb_set(
  question_data,
  '{pairs}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN (elem->>'id') IS NULL OR (elem->>'id') = ''
        THEN jsonb_set(elem, '{id}', to_jsonb('pair_' || (idx - 1)::text))
        ELSE elem
      END
      ORDER BY idx
    )
    FROM jsonb_array_elements(question_data->'pairs') WITH ORDINALITY AS t(elem, idx)
  )
)
WHERE exercise_type = 'matching_pairs'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(question_data->'pairs') p
    WHERE (p->>'id') IS NULL OR (p->>'id') = ''
  );