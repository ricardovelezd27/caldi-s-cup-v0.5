UPDATE learning_exercises
SET question_data = jsonb_set(
  question_data,
  '{items}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN (elem->>'id') IS NULL OR (elem->>'id') = ''
        THEN elem || jsonb_build_object('id', 'item_' || (idx - 1)::text)
        ELSE elem
      END
      ORDER BY idx
    )
    FROM jsonb_array_elements(question_data->'items') WITH ORDINALITY AS t(elem, idx)
  )
)
WHERE exercise_type = 'categorization'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(question_data->'items') p
    WHERE (p->>'id') IS NULL OR (p->>'id') = ''
  );

UPDATE learning_exercises
SET question_data = jsonb_set(
  question_data,
  '{items}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN (elem->>'category') IS NOT NULL AND ((elem->>'category_id') IS NULL OR (elem->>'category_id') = '')
        THEN (elem - 'category') || jsonb_build_object('category_id', elem->>'category')
        ELSE elem
      END
      ORDER BY idx
    )
    FROM jsonb_array_elements(question_data->'items') WITH ORDINALITY AS t(elem, idx)
  )
)
WHERE exercise_type = 'categorization'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(question_data->'items') p
    WHERE (p->>'category') IS NOT NULL AND ((p->>'category_id') IS NULL OR (p->>'category_id') = '')
  );