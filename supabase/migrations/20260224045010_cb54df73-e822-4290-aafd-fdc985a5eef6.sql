
-- =====================================================
-- Phase 5: Seed Brewing Science → Section 1: Extraction Fundamentals
-- 1 section, 4 units, 12 lessons, 72 exercises
-- =====================================================

-- Section 1
INSERT INTO learning_sections (id, track_id, level, name, name_es, description, description_es, learning_goal, learning_goal_es, sort_order, is_active)
VALUES (
  'a1b2c3d4-0001-4000-8000-000000000001',
  '3d46062b-fe55-4764-97f2-bbf130771b08',
  'beginner',
  'Extraction Fundamentals',
  'Fundamentos de Extracción',
  'Understand what happens when water meets coffee',
  'Comprende qué sucede cuando el agua se encuentra con el café',
  'Understand the science of extraction and identify under/over-extracted coffee',
  'Comprender la ciencia de la extracción e identificar café sub/sobre-extraído',
  1,
  true
);

-- =====================================================
-- UNIT 1.1: The Alchemy of the Bean
-- =====================================================
INSERT INTO learning_units (id, section_id, name, name_es, description, description_es, icon, sort_order, estimated_minutes, lesson_count)
VALUES (
  'b1b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'The Alchemy of the Bean',
  'La Alquimia del Grano',
  'Discover what happens inside the bean when water meets coffee',
  'Descubre qué sucede dentro del grano cuando el agua se encuentra con el café',
  '⚗️', 1, 12, 3
);

-- U1.1 Lesson 1: Solubility Basics
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000001-0001-4000-8000-000000000001',
  'b1b2c3d4-0001-4000-8000-000000000001',
  'Solubility Basics',
  'Conceptos de Solubilidad',
  'Every cup of coffee is a chemistry experiment. Let''s understand what dissolves and why.',
  'Cada taza de café es un experimento de química. Entendamos qué se disuelve y por qué.',
  1, 10, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000001-0001-4000-8000-000000000001', 'true_false', 1,
 '{"statement":"Coffee beans are 100% soluble in water.","statement_es":"Los granos de café son 100% solubles en agua.","correct_answer":false,"explanation":"Only about 28-30% of a coffee bean''s mass can dissolve in water. The rest is insoluble cellulose fiber.","explanation_es":"Solo entre el 28% y el 30% de la masa de un grano de café puede disolverse en agua. El resto es fibra de celulosa insoluble."}'::jsonb,
 20, ARRAY['extraction','solubility'], 'caldi', 'encouraging'),

('c1000001-0001-4000-8000-000000000001', 'multiple_choice', 2,
 '{"question":"Which compounds are extracted first during brewing?","question_es":"¿Qué compuestos se extraen primero durante la preparación?","options":[{"id":"a","text":"Bitterness compounds","text_es":"Compuestos amargos"},{"id":"b","text":"Acids and aromatics","text_es":"Ácidos y aromáticos"},{"id":"c","text":"Heavy oils","text_es":"Aceites pesados"},{"id":"d","text":"Caffeine only","text_es":"Solo cafeína"}],"correct_answer":"b","explanation":"Acids and fruit aromatics are the most soluble and leave the bean first, followed by sugars, then bitter compounds.","explanation_es":"Los ácidos y aromáticos frutales son los más solubles y salen del grano primero, seguidos por los azúcares y luego los compuestos amargos."}'::jsonb,
 30, ARRAY['extraction','solubility','acids'], 'goat', 'curious'),

('c1000001-0001-4000-8000-000000000001', 'fill_in_blank', 3,
 '{"question":"According to SCA standards, the ideal extraction yield is between 18% and {blank}%.","question_es":"Según los estándares de la SCA, el rendimiento ideal de extracción está entre el 18% y el {blank}%.","blanks":[{"id":1,"correct_answers":["22"]}],"explanation":"The SCA defines 18-22% as the ideal extraction range for balanced flavor.","explanation_es":"La SCA define el 18-22% como el rango ideal de extracción para un sabor equilibrado."}'::jsonb,
 40, ARRAY['extraction','sca','standards'], 'caldi', 'neutral'),

('c1000001-0001-4000-8000-000000000001', 'matching_pairs', 4,
 '{"instruction":"Match each compound type to when it extracts:","instruction_es":"Relaciona cada tipo de compuesto con cuándo se extrae:","pairs":[{"id":"1","left":"Acids & Aromatics","left_es":"Ácidos y Aromáticos","right":"First (most soluble)","right_es":"Primero (más soluble)"},{"id":"2","left":"Sugars & Sweetness","left_es":"Azúcares y Dulzura","right":"Middle","right_es":"Medio"},{"id":"3","left":"Bitter compounds","left_es":"Compuestos amargos","right":"Last (least soluble)","right_es":"Último (menos soluble)"}],"explanation":"Extraction follows a predictable order: acids first, then sweetness, then bitterness.","explanation_es":"La extracción sigue un orden predecible: primero ácidos, luego dulzura, luego amargor."}'::jsonb,
 45, ARRAY['extraction','solubility','order'], 'goat', 'excited'),

('c1000001-0001-4000-8000-000000000001', 'calculation', 5,
 '{"question":"If your coffee dose is 20g and you extracted 4g of solubles, what is your Extraction %?","question_es":"Si tu dosis de café es 20g y extrajiste 4g de solubles, ¿cuál es tu % de Extracción?","correct_answer":20,"tolerance":1,"unit":"%","explanation":"(4 / 20) × 100 = 20%. This falls within the ideal SCA range of 18-22%.","explanation_es":"(4 / 20) × 100 = 20%. Esto cae dentro del rango ideal de la SCA de 18-22%."}'::jsonb,
 55, ARRAY['extraction','calculation','sca'], 'caldi', 'celebrating'),

('c1000001-0001-4000-8000-000000000001', 'prediction', 6,
 '{"scenario":"You change your grind size from coarse to very fine.","scenario_es":"Cambias el tamaño de molienda de grueso a muy fino.","question":"What happens to extraction speed?","question_es":"¿Qué pasa con la velocidad de extracción?","options":[{"id":"up","text":"Increases","text_es":"Aumenta"},{"id":"down","text":"Decreases","text_es":"Disminuye"},{"id":"same","text":"Stays the same","text_es":"Se mantiene igual"}],"correct_answer":"up","explanation":"Finer particles have more surface area, allowing water to extract flavor compounds much faster.","explanation_es":"Las partículas más finas tienen más superficie, permitiendo que el agua extraiga compuestos de sabor mucho más rápido."}'::jsonb,
 60, ARRAY['extraction','grind','prediction'], 'caldi', 'curious');

-- U1.1 Lesson 2: TDS & Strength
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000001-0001-4000-8000-000000000002',
  'b1b2c3d4-0001-4000-8000-000000000001',
  'TDS & Strength',
  'TDS y Fuerza',
  'Total Dissolved Solids tell us how strong our coffee is. Let''s measure it!',
  '¡Los Sólidos Totales Disueltos nos dicen qué tan fuerte es nuestro café. Vamos a medirlo!',
  2, 15, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000001-0001-4000-8000-000000000002', 'true_false', 1,
 '{"statement":"TDS (Total Dissolved Solids) measures how much coffee was extracted from the grounds.","statement_es":"TDS (Sólidos Totales Disueltos) mide cuánto café se extrajo de la molienda.","correct_answer":false,"explanation":"TDS measures the concentration of dissolved coffee in your beverage (strength), not the extraction yield from the grounds.","explanation_es":"TDS mide la concentración de café disuelto en tu bebida (fuerza), no el rendimiento de extracción de la molienda."}'::jsonb,
 35, ARRAY['tds','strength'], 'caldi', 'thinking'),

('c1000001-0001-4000-8000-000000000002', 'multiple_choice', 2,
 '{"question":"What is the SCA recommended TDS range for drip coffee?","question_es":"¿Cuál es el rango de TDS recomendado por la SCA para café de filtro?","options":[{"id":"a","text":"0.5% - 0.8%","text_es":"0.5% - 0.8%"},{"id":"b","text":"1.15% - 1.35%","text_es":"1.15% - 1.35%"},{"id":"c","text":"2.0% - 3.0%","text_es":"2.0% - 3.0%"},{"id":"d","text":"5.0% - 8.0%","text_es":"5.0% - 8.0%"}],"correct_answer":"b","explanation":"The SCA recommends 1.15-1.35% TDS for drip/filter coffee. Espresso typically falls between 8-12% TDS.","explanation_es":"La SCA recomienda 1.15-1.35% TDS para café de filtro. El espresso típicamente está entre 8-12% TDS."}'::jsonb,
 45, ARRAY['tds','sca','strength'], 'goat', 'curious'),

('c1000001-0001-4000-8000-000000000002', 'fill_in_blank', 3,
 '{"question":"A refractometer measures the {blank} of dissolved solids in your coffee.","question_es":"Un refractómetro mide la {blank} de sólidos disueltos en tu café.","blanks":[{"id":1,"correct_answers":["concentration","percentage"]}],"explanation":"A refractometer measures the concentration (percentage) of dissolved solids by analyzing how light bends through the liquid.","explanation_es":"Un refractómetro mide la concentración (porcentaje) de sólidos disueltos analizando cómo la luz se refracta a través del líquido."}'::jsonb,
 40, ARRAY['tds','refractometer'], 'caldi', 'neutral'),

('c1000001-0001-4000-8000-000000000002', 'calculation', 4,
 '{"question":"You brewed 300ml of coffee using 18g of grounds. Your TDS reading is 1.3%. How many grams of coffee dissolved in the water?","question_es":"Preparaste 300ml de café usando 18g de molienda. Tu lectura de TDS es 1.3%. ¿Cuántos gramos de café se disolvieron en el agua?","correct_answer":3.9,"tolerance":0.2,"unit":"g","explanation":"300ml × 1.3% = 300 × 0.013 = 3.9g of dissolved coffee solids.","explanation_es":"300ml × 1.3% = 300 × 0.013 = 3.9g de sólidos de café disueltos."}'::jsonb,
 60, ARRAY['tds','calculation'], 'caldi', 'celebrating'),

('c1000001-0001-4000-8000-000000000002', 'prediction', 5,
 '{"scenario":"You keep the same dose and grind but use less water (200ml instead of 300ml).","scenario_es":"Mantienes la misma dosis y molienda pero usas menos agua (200ml en vez de 300ml).","question":"What happens to TDS?","question_es":"¿Qué pasa con el TDS?","options":[{"id":"up","text":"TDS increases","text_es":"TDS aumenta"},{"id":"down","text":"TDS decreases","text_es":"TDS disminuye"},{"id":"same","text":"TDS stays the same","text_es":"TDS se mantiene igual"}],"correct_answer":"up","explanation":"Less water means the same amount of dissolved solids is more concentrated, so TDS goes up (stronger coffee).","explanation_es":"Menos agua significa que la misma cantidad de sólidos disueltos está más concentrada, así que el TDS sube (café más fuerte)."}'::jsonb,
 55, ARRAY['tds','ratio','prediction'], 'goat', 'excited'),

('c1000001-0001-4000-8000-000000000002', 'sequencing', 6,
 '{"instruction":"Order these beverages from lowest to highest TDS:","instruction_es":"Ordena estas bebidas de menor a mayor TDS:","items":[{"id":"1","text":"Cold Brew","text_es":"Cold Brew"},{"id":"2","text":"Pour-over","text_es":"Pour-over"},{"id":"3","text":"Moka Pot","text_es":"Moka Pot"},{"id":"4","text":"Espresso","text_es":"Espresso"}],"correct_order":["1","2","3","4"],"explanation":"Cold brew ~0.8%, Pour-over ~1.2%, Moka pot ~4%, Espresso ~9% TDS.","explanation_es":"Cold brew ~0.8%, Pour-over ~1.2%, Moka pot ~4%, Espresso ~9% TDS."}'::jsonb,
 50, ARRAY['tds','methods','sequencing'], 'caldi', 'thinking');

-- U1.1 Lesson 3: The Brewing Control Chart
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000001-0001-4000-8000-000000000003',
  'b1b2c3d4-0001-4000-8000-000000000001',
  'The Brewing Control Chart',
  'La Tabla de Control de Preparación',
  'The Brewing Control Chart maps the relationship between strength and extraction. Master it!',
  '¡La Tabla de Control de Preparación mapea la relación entre fuerza y extracción. Domínala!',
  3, 15, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000001-0001-4000-8000-000000000003', 'true_false', 1,
 '{"statement":"On the Brewing Control Chart, the ideal zone sits in the center where both extraction and strength are balanced.","statement_es":"En la Tabla de Control de Preparación, la zona ideal se encuentra en el centro donde tanto la extracción como la fuerza están equilibradas.","correct_answer":true,"explanation":"The ideal zone on the chart represents the sweet spot where extraction (18-22%) and TDS (1.15-1.35%) intersect.","explanation_es":"La zona ideal en la tabla representa el punto ideal donde la extracción (18-22%) y el TDS (1.15-1.35%) se cruzan."}'::jsonb,
 40, ARRAY['bcc','chart','extraction'], 'caldi', 'encouraging'),

('c1000001-0001-4000-8000-000000000003', 'multiple_choice', 2,
 '{"question":"If your coffee is weak and under-extracted, what should you adjust?","question_es":"Si tu café está débil y sub-extraído, ¿qué deberías ajustar?","options":[{"id":"a","text":"Use more water","text_es":"Usar más agua"},{"id":"b","text":"Use a finer grind and less water","text_es":"Usar molienda más fina y menos agua"},{"id":"c","text":"Use a coarser grind","text_es":"Usar molienda más gruesa"},{"id":"d","text":"Brew for less time","text_es":"Preparar menos tiempo"}],"correct_answer":"b","explanation":"Finer grind increases extraction (fixes under-extraction), and less water increases strength (fixes weakness).","explanation_es":"Una molienda más fina aumenta la extracción (corrige sub-extracción), y menos agua aumenta la fuerza (corrige debilidad)."}'::jsonb,
 55, ARRAY['bcc','troubleshooting','grind'], 'goat', 'thinking'),

('c1000001-0001-4000-8000-000000000003', 'matching_pairs', 3,
 '{"instruction":"Match each Brewing Control Chart zone to its taste description:","instruction_es":"Relaciona cada zona de la Tabla de Control con su descripción de sabor:","pairs":[{"id":"1","left":"Weak & Under-extracted","left_es":"Débil y Sub-extraído","right":"Sour, thin, watery","right_es":"Agrio, delgado, aguado"},{"id":"2","left":"Strong & Over-extracted","left_es":"Fuerte y Sobre-extraído","right":"Bitter, harsh, astringent","right_es":"Amargo, áspero, astringente"},{"id":"3","left":"Ideal zone","left_es":"Zona ideal","right":"Sweet, balanced, complex","right_es":"Dulce, equilibrado, complejo"},{"id":"4","left":"Strong & Under-extracted","left_es":"Fuerte y Sub-extraído","right":"Sour but intense","right_es":"Agrio pero intenso"}],"explanation":"The BCC helps diagnose brewing problems by mapping strength against extraction.","explanation_es":"La TCC ayuda a diagnosticar problemas de preparación mapeando fuerza contra extracción."}'::jsonb,
 50, ARRAY['bcc','flavor','diagnosis'], 'caldi', 'curious'),

('c1000001-0001-4000-8000-000000000003', 'troubleshooting', 4,
 '{"scenario":"Your pour-over tastes sour and watery. Your refractometer shows TDS of 0.9% and estimated extraction of 16%.","scenario_es":"Tu pour-over sabe agrio y aguado. Tu refractómetro muestra TDS de 0.9% y extracción estimada de 16%.","question":"What is the best fix?","question_es":"¿Cuál es la mejor solución?","options":[{"id":"a","text":"Grind finer and use a higher dose","text_es":"Moler más fino y usar más dosis","is_correct":true},{"id":"b","text":"Grind coarser and add more water","text_es":"Moler más grueso y agregar más agua","is_correct":false},{"id":"c","text":"Just brew longer with same settings","text_es":"Solo preparar más tiempo con los mismos ajustes","is_correct":false},{"id":"d","text":"Lower the water temperature","text_es":"Bajar la temperatura del agua","is_correct":false}],"explanation":"Finer grind increases extraction (from 16% toward 18-22%), and higher dose increases TDS/strength. Both move you toward the ideal zone.","explanation_es":"Una molienda más fina aumenta la extracción (de 16% hacia 18-22%), y más dosis aumenta TDS/fuerza. Ambos te mueven hacia la zona ideal."}'::jsonb,
 65, ARRAY['bcc','troubleshooting','grind'], 'caldi', 'thinking'),

('c1000001-0001-4000-8000-000000000003', 'calculation', 5,
 '{"question":"You used 15g of coffee and 250ml of water. Your TDS is 1.2%. What is the extraction yield?","question_es":"Usaste 15g de café y 250ml de agua. Tu TDS es 1.2%. ¿Cuál es el rendimiento de extracción?","correct_answer":20,"tolerance":1,"unit":"%","explanation":"Dissolved solids = 250 × 0.012 = 3g. Extraction = (3/15) × 100 = 20%.","explanation_es":"Sólidos disueltos = 250 × 0.012 = 3g. Extracción = (3/15) × 100 = 20%."}'::jsonb,
 65, ARRAY['bcc','calculation','extraction'], 'caldi', 'celebrating'),

('c1000001-0001-4000-8000-000000000003', 'prediction', 6,
 '{"scenario":"Your coffee is in the ideal zone (TDS 1.25%, Extraction 20%). You decide to use twice as much water with the same dose.","scenario_es":"Tu café está en la zona ideal (TDS 1.25%, Extracción 20%). Decides usar el doble de agua con la misma dosis.","question":"Where does it move on the chart?","question_es":"¿Hacia dónde se mueve en la tabla?","options":[{"id":"a","text":"Weak & Over-extracted","text_es":"Débil y Sobre-extraído"},{"id":"b","text":"Strong & Under-extracted","text_es":"Fuerte y Sub-extraído"},{"id":"c","text":"Stays ideal","text_es":"Se mantiene ideal"}],"correct_answer":"a","explanation":"More water dilutes the brew (lower TDS/weaker) and increases contact time (higher extraction), moving to weak & over-extracted.","explanation_es":"Más agua diluye la preparación (menor TDS/más débil) y aumenta el tiempo de contacto (mayor extracción), moviéndose a débil y sobre-extraído."}'::jsonb,
 70, ARRAY['bcc','prediction','ratio'], 'goat', 'curious');

-- =====================================================
-- UNIT 1.2: The Extraction Timeline
-- =====================================================
INSERT INTO learning_units (id, section_id, name, name_es, description, description_es, icon, sort_order, estimated_minutes, lesson_count)
VALUES (
  'b1b2c3d4-0001-4000-8000-000000000002',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'The Extraction Timeline',
  'La Línea de Tiempo de Extracción',
  'Understand how flavor changes over time during extraction',
  'Comprende cómo cambia el sabor a lo largo del tiempo durante la extracción',
  '⏱️', 2, 12, 3
);

-- U1.2 Lesson 1: The Three Phases
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000002-0001-4000-8000-000000000001',
  'b1b2c3d4-0001-4000-8000-000000000002',
  'The Three Phases',
  'Las Tres Fases',
  'Extraction happens in three distinct phases. Each brings different flavors to your cup.',
  'La extracción ocurre en tres fases distintas. Cada una aporta diferentes sabores a tu taza.',
  1, 10, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000002-0001-4000-8000-000000000001', 'sequencing', 1,
 '{"instruction":"Order the extraction phases from first to last:","instruction_es":"Ordena las fases de extracción de primera a última:","items":[{"id":"1","text":"Acids & Aromatics (bright, fruity)","text_es":"Ácidos y Aromáticos (brillante, frutal)"},{"id":"2","text":"Sugars & Caramels (sweet, smooth)","text_es":"Azúcares y Caramelos (dulce, suave)"},{"id":"3","text":"Bitters & Tannins (dry, astringent)","text_es":"Amargos y Taninos (seco, astringente)"}],"correct_order":["1","2","3"],"explanation":"Compounds dissolve in order of solubility: acids first, then sugars, then bitter compounds last.","explanation_es":"Los compuestos se disuelven en orden de solubilidad: primero ácidos, luego azúcares, y por último compuestos amargos."}'::jsonb,
 25, ARRAY['phases','extraction','order'], 'caldi', 'encouraging'),

('c1000002-0001-4000-8000-000000000001', 'true_false', 2,
 '{"statement":"Caffeine is one of the first compounds to extract from coffee grounds.","statement_es":"La cafeína es uno de los primeros compuestos en extraerse del café molido.","correct_answer":true,"explanation":"Caffeine is highly water-soluble and extracts very early in the brewing process, within the first 30 seconds.","explanation_es":"La cafeína es altamente soluble en agua y se extrae muy temprano en el proceso de preparación, dentro de los primeros 30 segundos."}'::jsonb,
 30, ARRAY['caffeine','solubility','phases'], 'goat', 'curious'),

('c1000002-0001-4000-8000-000000000001', 'multiple_choice', 3,
 '{"question":"If you stop extraction very early (after 30 seconds of contact), your coffee will taste mostly:","question_es":"Si detienes la extracción muy temprano (después de 30 segundos de contacto), tu café sabrá principalmente:","options":[{"id":"a","text":"Bitter and dry","text_es":"Amargo y seco"},{"id":"b","text":"Sweet and balanced","text_es":"Dulce y equilibrado"},{"id":"c","text":"Sour and bright","text_es":"Agrio y brillante"},{"id":"d","text":"Flat and dull","text_es":"Plano y apagado"}],"correct_answer":"c","explanation":"Very early extraction captures mostly acids and aromatics, producing a sour and bright (but thin) cup.","explanation_es":"La extracción muy temprana captura principalmente ácidos y aromáticos, produciendo una taza agria y brillante (pero delgada)."}'::jsonb,
 35, ARRAY['phases','under-extraction','acids'], 'caldi', 'thinking'),

('c1000002-0001-4000-8000-000000000001', 'matching_pairs', 4,
 '{"instruction":"Match each extraction phase to its dominant flavor:","instruction_es":"Relaciona cada fase de extracción con su sabor dominante:","pairs":[{"id":"1","left":"Phase 1 (0-30s)","left_es":"Fase 1 (0-30s)","right":"Bright acidity, citrus","right_es":"Acidez brillante, cítricos"},{"id":"2","left":"Phase 2 (30s-2min)","left_es":"Fase 2 (30s-2min)","right":"Sweetness, chocolate, caramel","right_es":"Dulzura, chocolate, caramelo"},{"id":"3","left":"Phase 3 (2min+)","left_es":"Fase 3 (2min+)","right":"Bitterness, woodiness","right_es":"Amargor, sabor a madera"}],"explanation":"The ideal brew captures enough of phases 1 and 2 while minimizing phase 3.","explanation_es":"La preparación ideal captura suficiente de las fases 1 y 2 mientras minimiza la fase 3."}'::jsonb,
 40, ARRAY['phases','flavor','timeline'], 'goat', 'happy'),

('c1000002-0001-4000-8000-000000000001', 'prediction', 5,
 '{"scenario":"You are brewing a pour-over and your total brew time is 5 minutes (much longer than the recommended 3 minutes).","scenario_es":"Estás preparando un pour-over y tu tiempo total de preparación es 5 minutos (mucho más que los 3 minutos recomendados).","question":"What phase dominates your cup?","question_es":"¿Qué fase domina tu taza?","options":[{"id":"a","text":"Phase 1 - Bright acids","text_es":"Fase 1 - Ácidos brillantes"},{"id":"b","text":"Phase 2 - Sweet balance","text_es":"Fase 2 - Dulzura equilibrada"},{"id":"c","text":"Phase 3 - Bitter tannins","text_es":"Fase 3 - Taninos amargos"}],"correct_answer":"c","explanation":"Extended brew time allows over-extraction, pulling too many bitter tannins and woody compounds from phase 3.","explanation_es":"El tiempo de preparación extendido permite sobre-extracción, extrayendo demasiados taninos amargos y compuestos leñosos de la fase 3."}'::jsonb,
 45, ARRAY['phases','over-extraction','prediction'], 'caldi', 'curious'),

('c1000002-0001-4000-8000-000000000001', 'troubleshooting', 6,
 '{"scenario":"Your French press coffee tastes overly bitter and dry. You brewed for 6 minutes with a medium grind.","scenario_es":"Tu café de prensa francesa sabe demasiado amargo y seco. Preparaste por 6 minutos con molienda media.","question":"What should you change?","question_es":"¿Qué deberías cambiar?","options":[{"id":"a","text":"Brew for only 4 minutes","text_es":"Preparar solo 4 minutos","is_correct":true},{"id":"b","text":"Grind finer","text_es":"Moler más fino","is_correct":false},{"id":"c","text":"Use hotter water","text_es":"Usar agua más caliente","is_correct":false},{"id":"d","text":"Add more coffee","text_es":"Agregar más café","is_correct":false}],"explanation":"6 minutes is too long for French press. Reducing to 4 minutes avoids over-extraction of bitter compounds from phase 3.","explanation_es":"6 minutos es demasiado para prensa francesa. Reducir a 4 minutos evita la sobre-extracción de compuestos amargos de la fase 3."}'::jsonb,
 50, ARRAY['phases','french-press','troubleshooting'], 'caldi', 'thinking');

-- U1.2 Lesson 2: Time as a Variable
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000002-0001-4000-8000-000000000002',
  'b1b2c3d4-0001-4000-8000-000000000002',
  'Time as a Variable',
  'El Tiempo como Variable',
  'Brew time is one of the most important variables you can control. Let''s explore its impact.',
  'El tiempo de preparación es una de las variables más importantes que puedes controlar. Exploremos su impacto.',
  2, 15, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000002-0001-4000-8000-000000000002', 'multiple_choice', 1,
 '{"question":"What is the recommended total brew time for a standard pour-over?","question_es":"¿Cuál es el tiempo total de preparación recomendado para un pour-over estándar?","options":[{"id":"a","text":"1-2 minutes","text_es":"1-2 minutos"},{"id":"b","text":"2.5-3.5 minutes","text_es":"2.5-3.5 minutos"},{"id":"c","text":"5-7 minutes","text_es":"5-7 minutos"},{"id":"d","text":"8-10 minutes","text_es":"8-10 minutos"}],"correct_answer":"b","explanation":"Most pour-over methods target 2.5-3.5 minutes total brew time for optimal extraction.","explanation_es":"La mayoría de los métodos de pour-over apuntan a 2.5-3.5 minutos de tiempo total de preparación para una extracción óptima."}'::jsonb,
 30, ARRAY['time','pour-over','methods'], 'caldi', 'encouraging'),

('c1000002-0001-4000-8000-000000000002', 'true_false', 2,
 '{"statement":"Espresso has a shorter brew time than pour-over because it uses higher pressure, not because it extracts less.","statement_es":"El espresso tiene un tiempo de preparación más corto que el pour-over porque usa más presión, no porque extraiga menos.","correct_answer":true,"explanation":"Espresso uses 9 bars of pressure to force water through fine grounds in 25-30 seconds, achieving similar extraction in much less time.","explanation_es":"El espresso usa 9 bares de presión para forzar agua a través de molienda fina en 25-30 segundos, logrando una extracción similar en mucho menos tiempo."}'::jsonb,
 40, ARRAY['time','espresso','pressure'], 'goat', 'curious'),

('c1000002-0001-4000-8000-000000000002', 'matching_pairs', 3,
 '{"instruction":"Match each brew method to its typical brew time:","instruction_es":"Relaciona cada método de preparación con su tiempo típico:","pairs":[{"id":"1","left":"Espresso","left_es":"Espresso","right":"25-30 seconds","right_es":"25-30 segundos"},{"id":"2","left":"Pour-over (V60)","left_es":"Pour-over (V60)","right":"2.5-3.5 minutes","right_es":"2.5-3.5 minutos"},{"id":"3","left":"French Press","left_es":"Prensa Francesa","right":"4 minutes","right_es":"4 minutos"},{"id":"4","left":"Cold Brew","left_es":"Cold Brew","right":"12-24 hours","right_es":"12-24 horas"}],"explanation":"Each method is designed with a specific contact time for its grind size and temperature.","explanation_es":"Cada método está diseñado con un tiempo de contacto específico para su tamaño de molienda y temperatura."}'::jsonb,
 35, ARRAY['time','methods','matching'], 'caldi', 'neutral'),

('c1000002-0001-4000-8000-000000000002', 'calculation', 4,
 '{"question":"Your espresso shot pulled in 35 seconds instead of the target 28 seconds. That is how many seconds over the target?","question_es":"Tu shot de espresso salió en 35 segundos en lugar del objetivo de 28 segundos. ¿Cuántos segundos sobre el objetivo?","correct_answer":7,"tolerance":0,"unit":"seconds","explanation":"35 - 28 = 7 seconds over. This likely means your grind is too fine, causing over-extraction.","explanation_es":"35 - 28 = 7 segundos de más. Esto probablemente significa que tu molienda es demasiado fina, causando sobre-extracción."}'::jsonb,
 35, ARRAY['time','espresso','calculation'], 'caldi', 'thinking'),

('c1000002-0001-4000-8000-000000000002', 'prediction', 5,
 '{"scenario":"You switch from a medium grind to a coarser grind while keeping all other variables the same for your pour-over.","scenario_es":"Cambias de una molienda media a una más gruesa mientras mantienes todas las demás variables iguales para tu pour-over.","question":"What happens to your brew time?","question_es":"¿Qué pasa con tu tiempo de preparación?","options":[{"id":"up","text":"Brew time increases","text_es":"El tiempo aumenta"},{"id":"down","text":"Brew time decreases","text_es":"El tiempo disminuye"},{"id":"same","text":"Brew time stays the same","text_es":"El tiempo se mantiene igual"}],"correct_answer":"down","explanation":"Coarser grounds allow water to flow through faster, reducing total brew time.","explanation_es":"Una molienda más gruesa permite que el agua fluya más rápido, reduciendo el tiempo total de preparación."}'::jsonb,
 45, ARRAY['time','grind','prediction'], 'goat', 'excited'),

('c1000002-0001-4000-8000-000000000002', 'categorization', 6,
 '{"instruction":"Categorize these brew times as Too Short, Ideal, or Too Long for a V60 pour-over:","instruction_es":"Categoriza estos tiempos como Muy Corto, Ideal, o Muy Largo para un V60 pour-over:","categories":[{"id":"short","name":"Too Short","name_es":"Muy Corto"},{"id":"ideal","name":"Ideal","name_es":"Ideal"},{"id":"long","name":"Too Long","name_es":"Muy Largo"}],"items":[{"id":"1","text":"1:30","text_es":"1:30","category":"short"},{"id":"2","text":"2:45","text_es":"2:45","category":"ideal"},{"id":"3","text":"3:15","text_es":"3:15","category":"ideal"},{"id":"4","text":"5:00","text_es":"5:00","category":"long"}],"explanation":"V60 ideal range is 2:30-3:30. Under 2 minutes is too fast (under-extracted), over 4 minutes is too slow (over-extracted).","explanation_es":"El rango ideal del V60 es 2:30-3:30. Menos de 2 minutos es muy rápido (sub-extraído), más de 4 minutos es muy lento (sobre-extraído)."}'::jsonb,
 50, ARRAY['time','v60','categorization'], 'caldi', 'curious');

-- U1.2 Lesson 3: Contact Time vs. Temperature
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000002-0001-4000-8000-000000000003',
  'b1b2c3d4-0001-4000-8000-000000000002',
  'Contact Time vs. Temperature',
  'Tiempo de Contacto vs. Temperatura',
  'Time and temperature work together. Let''s see how they interact.',
  'El tiempo y la temperatura trabajan juntos. Veamos cómo interactúan.',
  3, 15, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000002-0001-4000-8000-000000000003', 'true_false', 1,
 '{"statement":"Cold brew uses a much longer steep time to compensate for the low temperature.","statement_es":"El cold brew usa un tiempo de infusión mucho más largo para compensar la baja temperatura.","correct_answer":true,"explanation":"Cold water extracts much more slowly, so cold brew needs 12-24 hours to achieve adequate extraction.","explanation_es":"El agua fría extrae mucho más lentamente, así que el cold brew necesita 12-24 horas para lograr una extracción adecuada."}'::jsonb,
 25, ARRAY['temperature','cold-brew','time'], 'caldi', 'encouraging'),

('c1000002-0001-4000-8000-000000000003', 'multiple_choice', 2,
 '{"question":"What is the SCA recommended water temperature for hot brewing?","question_es":"¿Cuál es la temperatura del agua recomendada por la SCA para preparación en caliente?","options":[{"id":"a","text":"70-80°C (158-176°F)","text_es":"70-80°C (158-176°F)"},{"id":"b","text":"90-96°C (195-205°F)","text_es":"90-96°C (195-205°F)"},{"id":"c","text":"100°C (212°F)","text_es":"100°C (212°F)"},{"id":"d","text":"80-85°C (176-185°F)","text_es":"80-85°C (176-185°F)"}],"correct_answer":"b","explanation":"The SCA recommends 90-96°C (195-205°F) for optimal extraction in hot brewing methods.","explanation_es":"La SCA recomienda 90-96°C (195-205°F) para una extracción óptima en métodos de preparación en caliente."}'::jsonb,
 30, ARRAY['temperature','sca','standards'], 'goat', 'curious'),

('c1000002-0001-4000-8000-000000000003', 'prediction', 3,
 '{"scenario":"You brew with water at 80°C instead of the recommended 93°C, keeping brew time the same.","scenario_es":"Preparas con agua a 80°C en vez de los 93°C recomendados, manteniendo el mismo tiempo.","question":"What happens to extraction?","question_es":"¿Qué pasa con la extracción?","options":[{"id":"up","text":"Extraction increases","text_es":"La extracción aumenta"},{"id":"down","text":"Extraction decreases","text_es":"La extracción disminuye"},{"id":"same","text":"No change","text_es":"Sin cambio"}],"correct_answer":"down","explanation":"Lower temperature means slower molecular movement, reducing the rate of extraction. Your coffee will likely be under-extracted.","explanation_es":"Menor temperatura significa movimiento molecular más lento, reduciendo la tasa de extracción. Tu café probablemente estará sub-extraído."}'::jsonb,
 40, ARRAY['temperature','extraction','prediction'], 'caldi', 'thinking'),

('c1000002-0001-4000-8000-000000000003', 'fill_in_blank', 4,
 '{"question":"Cold brew typically steeps for {blank} to {blank} hours at room temperature or refrigerated.","question_es":"El cold brew típicamente se infusiona por {blank} a {blank} horas a temperatura ambiente o refrigerado.","blanks":[{"id":1,"correct_answers":["12"]},{"id":2,"correct_answers":["24"]}],"explanation":"Cold brew requires 12-24 hours because cold water extracts compounds very slowly.","explanation_es":"El cold brew requiere 12-24 horas porque el agua fría extrae compuestos muy lentamente."}'::jsonb,
 35, ARRAY['cold-brew','time','temperature'], 'goat', 'happy'),

('c1000002-0001-4000-8000-000000000003', 'troubleshooting', 5,
 '{"scenario":"Your iced pour-over tastes weak and sour. You brewed with 85°C water over ice to cool it quickly.","scenario_es":"Tu pour-over helado sabe débil y agrio. Preparaste con agua a 85°C sobre hielo para enfriarlo rápidamente.","question":"What is the most likely cause?","question_es":"¿Cuál es la causa más probable?","options":[{"id":"a","text":"Water temperature was too low for proper extraction","text_es":"La temperatura del agua fue demasiado baja para una extracción adecuada","is_correct":true},{"id":"b","text":"The ice added too much water","text_es":"El hielo agregó demasiada agua","is_correct":false},{"id":"c","text":"You used too much coffee","text_es":"Usaste demasiado café","is_correct":false}],"explanation":"At 85°C, extraction is slower and may not reach the ideal 18-22% range. Use 93-96°C water and account for ice dilution with a stronger ratio.","explanation_es":"A 85°C, la extracción es más lenta y puede no alcanzar el rango ideal de 18-22%. Usa agua a 93-96°C y compensa la dilución del hielo con una proporción más fuerte."}'::jsonb,
 55, ARRAY['temperature','iced-coffee','troubleshooting'], 'caldi', 'thinking'),

('c1000002-0001-4000-8000-000000000003', 'comparison', 6,
 '{"question":"Which method requires MORE total contact time?","question_es":"¿Qué método requiere MÁS tiempo total de contacto?","item_a":{"name":"Cold Brew (room temp water)","name_es":"Cold Brew (agua a temperatura ambiente)"},"item_b":{"name":"French Press (93°C water)","name_es":"Prensa Francesa (agua a 93°C)"},"attribute":"Total contact time","attribute_es":"Tiempo total de contacto","correct_answer":"a","explanation":"Cold brew needs 12-24 hours vs French press at 4 minutes. Low temperature dramatically slows extraction.","explanation_es":"Cold brew necesita 12-24 horas vs prensa francesa en 4 minutos. La baja temperatura reduce dramáticamente la velocidad de extracción."}'::jsonb,
 40, ARRAY['temperature','time','comparison'], 'goat', 'curious');

-- =====================================================
-- UNIT 1.3: Under vs Over Extraction
-- =====================================================
INSERT INTO learning_units (id, section_id, name, name_es, description, description_es, icon, sort_order, estimated_minutes, lesson_count)
VALUES (
  'b1b2c3d4-0001-4000-8000-000000000003',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Under vs Over Extraction',
  'Sub vs Sobre Extracción',
  'Learn to taste and diagnose extraction problems in your cup',
  'Aprende a saborear y diagnosticar problemas de extracción en tu taza',
  '⚖️', 3, 12, 3
);

-- U1.3 Lesson 1: Tasting Under-Extraction
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000003-0001-4000-8000-000000000001',
  'b1b2c3d4-0001-4000-8000-000000000003',
  'Tasting Under-Extraction',
  'Saboreando la Sub-Extracción',
  'Under-extraction means not enough good stuff dissolved. Let''s learn to identify it.',
  'La sub-extracción significa que no se disolvieron suficientes cosas buenas. Aprendamos a identificarla.',
  1, 10, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000003-0001-4000-8000-000000000001', 'multiple_choice', 1,
 '{"question":"Which flavor characteristic is the strongest indicator of under-extraction?","question_es":"¿Qué característica de sabor es el indicador más fuerte de sub-extracción?","options":[{"id":"a","text":"Intense bitterness","text_es":"Amargor intenso"},{"id":"b","text":"Sharp sourness","text_es":"Acidez aguda"},{"id":"c","text":"Balanced sweetness","text_es":"Dulzura equilibrada"},{"id":"d","text":"Smoky flavor","text_es":"Sabor ahumado"}],"correct_answer":"b","explanation":"Sharp, unpleasant sourness is the hallmark of under-extraction. The acids extracted first haven''t been balanced by sugars yet.","explanation_es":"La acidez aguda y desagradable es la marca de la sub-extracción. Los ácidos extraídos primero no han sido equilibrados por los azúcares aún."}'::jsonb,
 25, ARRAY['under-extraction','tasting','acids'], 'caldi', 'encouraging'),

('c1000003-0001-4000-8000-000000000001', 'true_false', 2,
 '{"statement":"Under-extracted coffee often has a thin, watery body with little sweetness.","statement_es":"El café sub-extraído a menudo tiene un cuerpo delgado y aguado con poca dulzura.","correct_answer":true,"explanation":"Under-extraction doesn''t dissolve enough sugars and oils, resulting in a thin, watery mouthfeel.","explanation_es":"La sub-extracción no disuelve suficientes azúcares y aceites, resultando en una sensación en boca delgada y aguada."}'::jsonb,
 20, ARRAY['under-extraction','body','tasting'], 'goat', 'curious'),

('c1000003-0001-4000-8000-000000000001', 'categorization', 3,
 '{"instruction":"Categorize these tasting notes as Under-Extracted or NOT Under-Extracted:","instruction_es":"Categoriza estas notas de cata como Sub-Extraído o NO Sub-Extraído:","categories":[{"id":"under","name":"Under-Extracted","name_es":"Sub-Extraído"},{"id":"not","name":"NOT Under-Extracted","name_es":"NO Sub-Extraído"}],"items":[{"id":"1","text":"Sour, lemon-like acidity","text_es":"Acidez agria, como limón","category":"under"},{"id":"2","text":"Thin, watery body","text_es":"Cuerpo delgado, aguado","category":"under"},{"id":"3","text":"Sweet caramel notes","text_es":"Notas dulces de caramelo","category":"not"},{"id":"4","text":"Salty aftertaste","text_es":"Retrogusto salado","category":"under"},{"id":"5","text":"Rich chocolate finish","text_es":"Final rico de chocolate","category":"not"}],"explanation":"Sour acidity, thin body, and salty taste are classic under-extraction signs. Sweetness and rich flavors indicate proper extraction.","explanation_es":"Acidez agria, cuerpo delgado y sabor salado son signos clásicos de sub-extracción. Dulzura y sabores ricos indican extracción adecuada."}'::jsonb,
 40, ARRAY['under-extraction','tasting','categorization'], 'caldi', 'thinking'),

('c1000003-0001-4000-8000-000000000001', 'fill_in_blank', 4,
 '{"question":"Under-extracted coffee typically has an extraction yield below {blank}%.","question_es":"El café sub-extraído típicamente tiene un rendimiento de extracción por debajo del {blank}%.","blanks":[{"id":1,"correct_answers":["18"]}],"explanation":"Below 18% extraction, not enough sugars and desirable compounds have dissolved to balance the acids.","explanation_es":"Por debajo del 18% de extracción, no se han disuelto suficientes azúcares y compuestos deseables para equilibrar los ácidos."}'::jsonb,
 35, ARRAY['under-extraction','sca','yield'], 'goat', 'neutral'),

('c1000003-0001-4000-8000-000000000001', 'troubleshooting', 5,
 '{"scenario":"Your AeroPress coffee tastes sharp, sour, and has a thin body. You used a coarse grind with a 1-minute steep time.","scenario_es":"Tu café de AeroPress sabe agudo, agrio y tiene un cuerpo delgado. Usaste molienda gruesa con 1 minuto de infusión.","question":"What is the best adjustment?","question_es":"¿Cuál es el mejor ajuste?","options":[{"id":"a","text":"Grind finer and steep for 2 minutes","text_es":"Moler más fino e infusionar por 2 minutos","is_correct":true},{"id":"b","text":"Use less coffee","text_es":"Usar menos café","is_correct":false},{"id":"c","text":"Use colder water","text_es":"Usar agua más fría","is_correct":false},{"id":"d","text":"Grind coarser","text_es":"Moler más grueso","is_correct":false}],"explanation":"Finer grind increases surface area and longer steep time allows more extraction, both helping to reach the sweet spot.","explanation_es":"Una molienda más fina aumenta la superficie y un tiempo de infusión más largo permite más extracción, ambos ayudando a alcanzar el punto ideal."}'::jsonb,
 50, ARRAY['under-extraction','aeropress','troubleshooting'], 'caldi', 'thinking'),

('c1000003-0001-4000-8000-000000000001', 'prediction', 6,
 '{"scenario":"Your coffee is under-extracted (sour and thin). You decide to increase the water temperature by 5°C.","scenario_es":"Tu café está sub-extraído (agrio y delgado). Decides aumentar la temperatura del agua 5°C.","question":"Will this help fix the under-extraction?","question_es":"¿Esto ayudará a corregir la sub-extracción?","options":[{"id":"yes","text":"Yes, it will help","text_es":"Sí, ayudará"},{"id":"no","text":"No, it won''t help","text_es":"No, no ayudará"},{"id":"worse","text":"It will make it worse","text_es":"Lo empeorará"}],"correct_answer":"yes","explanation":"Higher temperature increases extraction rate, helping dissolve more sugars and flavors to balance the acids.","explanation_es":"Mayor temperatura aumenta la tasa de extracción, ayudando a disolver más azúcares y sabores para equilibrar los ácidos."}'::jsonb,
 45, ARRAY['under-extraction','temperature','prediction'], 'caldi', 'curious');

-- U1.3 Lesson 2: Tasting Over-Extraction
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000003-0001-4000-8000-000000000002',
  'b1b2c3d4-0001-4000-8000-000000000003',
  'Tasting Over-Extraction',
  'Saboreando la Sobre-Extracción',
  'Over-extraction pulls too much from the bean. Let''s learn what that tastes like.',
  'La sobre-extracción extrae demasiado del grano. Aprendamos a qué sabe eso.',
  2, 15, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000003-0001-4000-8000-000000000002', 'multiple_choice', 1,
 '{"question":"What is the primary taste indicator of over-extraction?","question_es":"¿Cuál es el indicador de sabor principal de la sobre-extracción?","options":[{"id":"a","text":"Pleasant acidity","text_es":"Acidez agradable"},{"id":"b","text":"Harsh bitterness and astringency","text_es":"Amargor áspero y astringencia"},{"id":"c","text":"Fruity sweetness","text_es":"Dulzura frutal"},{"id":"d","text":"Nutty flavor","text_es":"Sabor a nuez"}],"correct_answer":"b","explanation":"Over-extraction dissolves too many tannins and bitter compounds, creating a harsh, dry, astringent taste.","explanation_es":"La sobre-extracción disuelve demasiados taninos y compuestos amargos, creando un sabor áspero, seco y astringente."}'::jsonb,
 25, ARRAY['over-extraction','bitterness','tasting'], 'caldi', 'encouraging'),

('c1000003-0001-4000-8000-000000000002', 'true_false', 2,
 '{"statement":"Over-extracted coffee often leaves a dry, puckering sensation in your mouth similar to over-steeped tea.","statement_es":"El café sobre-extraído a menudo deja una sensación seca y astringente en la boca, similar al té infusionado demasiado tiempo.","correct_answer":true,"explanation":"Tannins from over-extraction create astringency—the same dry, puckering feeling you get from over-steeped black tea.","explanation_es":"Los taninos de la sobre-extracción crean astringencia—la misma sensación seca que obtienes del té negro infusionado demasiado tiempo."}'::jsonb,
 20, ARRAY['over-extraction','tannins','astringency'], 'goat', 'thinking'),

('c1000003-0001-4000-8000-000000000002', 'matching_pairs', 3,
 '{"instruction":"Match each cause to the over-extraction problem it creates:","instruction_es":"Relaciona cada causa con el problema de sobre-extracción que crea:","pairs":[{"id":"1","left":"Grind too fine","left_es":"Molienda demasiado fina","right":"Too much surface area exposed","right_es":"Demasiada superficie expuesta"},{"id":"2","left":"Water too hot","left_es":"Agua demasiado caliente","right":"Accelerated extraction rate","right_es":"Tasa de extracción acelerada"},{"id":"3","left":"Brew time too long","left_es":"Tiempo de preparación muy largo","right":"Extended contact dissolves bitter compounds","right_es":"Contacto extendido disuelve compuestos amargos"}],"explanation":"All three factors independently increase extraction. Combining them makes over-extraction even worse.","explanation_es":"Los tres factores aumentan independientemente la extracción. Combinarlos empeora aún más la sobre-extracción."}'::jsonb,
 40, ARRAY['over-extraction','variables','causes'], 'caldi', 'neutral'),

('c1000003-0001-4000-8000-000000000002', 'categorization', 4,
 '{"instruction":"Categorize these flavors as Over-Extracted or NOT Over-Extracted:","instruction_es":"Categoriza estos sabores como Sobre-Extraído o NO Sobre-Extraído:","categories":[{"id":"over","name":"Over-Extracted","name_es":"Sobre-Extraído"},{"id":"not","name":"NOT Over-Extracted","name_es":"NO Sobre-Extraído"}],"items":[{"id":"1","text":"Harsh bitterness","text_es":"Amargor áspero","category":"over"},{"id":"2","text":"Dry, astringent finish","text_es":"Final seco, astringente","category":"over"},{"id":"3","text":"Bright citrus acidity","text_es":"Acidez cítrica brillante","category":"not"},{"id":"4","text":"Hollow, empty flavor","text_es":"Sabor hueco, vacío","category":"over"},{"id":"5","text":"Caramel sweetness","text_es":"Dulzura de caramelo","category":"not"}],"explanation":"Bitterness, astringency, and hollow emptiness are signs of over-extraction. Bright acidity and sweetness indicate good extraction.","explanation_es":"Amargor, astringencia y vacío son signos de sobre-extracción. Acidez brillante y dulzura indican buena extracción."}'::jsonb,
 40, ARRAY['over-extraction','tasting','categorization'], 'goat', 'curious'),

('c1000003-0001-4000-8000-000000000002', 'troubleshooting', 5,
 '{"scenario":"Your espresso tastes extremely bitter and ashy. The shot pulled in 40 seconds (target: 25-30s) and you used a very fine grind.","scenario_es":"Tu espresso sabe extremadamente amargo y a ceniza. El shot salió en 40 segundos (objetivo: 25-30s) y usaste una molienda muy fina.","question":"What should you adjust first?","question_es":"¿Qué deberías ajustar primero?","options":[{"id":"a","text":"Grind coarser to speed up the shot","text_es":"Moler más grueso para acelerar el shot","is_correct":true},{"id":"b","text":"Increase the dose","text_es":"Aumentar la dosis","is_correct":false},{"id":"c","text":"Raise the temperature","text_es":"Subir la temperatura","is_correct":false},{"id":"d","text":"Tamp harder","text_es":"Prensar más fuerte","is_correct":false}],"explanation":"A 40-second shot is too slow, meaning the grind is too fine. Coarsening will speed up flow and reduce over-extraction.","explanation_es":"Un shot de 40 segundos es demasiado lento, lo que significa que la molienda es demasiado fina. Hacerla más gruesa acelerará el flujo y reducirá la sobre-extracción."}'::jsonb,
 55, ARRAY['over-extraction','espresso','troubleshooting'], 'caldi', 'thinking'),

('c1000003-0001-4000-8000-000000000002', 'fill_in_blank', 6,
 '{"question":"Over-extracted coffee typically has an extraction yield above {blank}%.","question_es":"El café sobre-extraído típicamente tiene un rendimiento de extracción por encima del {blank}%.","blanks":[{"id":1,"correct_answers":["22"]}],"explanation":"Above 22% extraction, too many bitter tannins and undesirable compounds dissolve, ruining the balance.","explanation_es":"Por encima del 22% de extracción, demasiados taninos amargos y compuestos indeseables se disuelven, arruinando el equilibrio."}'::jsonb,
 35, ARRAY['over-extraction','sca','yield'], 'caldi', 'neutral');

-- U1.3 Lesson 3: Diagnosing Your Cup
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000003-0001-4000-8000-000000000003',
  'b1b2c3d4-0001-4000-8000-000000000003',
  'Diagnosing Your Cup',
  'Diagnosticando Tu Taza',
  'Now let''s put it all together and learn to diagnose any cup of coffee!',
  '¡Ahora juntemos todo y aprendamos a diagnosticar cualquier taza de café!',
  3, 20, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000003-0001-4000-8000-000000000003', 'troubleshooting', 1,
 '{"scenario":"You brew a V60 and it tastes both sour AND bitter at the same time. This seems contradictory.","scenario_es":"Preparas un V60 y sabe tanto agrio COMO amargo al mismo tiempo. Esto parece contradictorio.","question":"What is the most likely cause?","question_es":"¿Cuál es la causa más probable?","options":[{"id":"a","text":"Channeling - uneven extraction","text_es":"Canalización - extracción desigual","is_correct":true},{"id":"b","text":"Bad quality beans","text_es":"Granos de mala calidad","is_correct":false},{"id":"c","text":"Water is too soft","text_es":"El agua es muy blanda","is_correct":false},{"id":"d","text":"The filter was wet","text_es":"El filtro estaba mojado","is_correct":false}],"explanation":"Simultaneous sour and bitter notes indicate channeling: water finds easy paths (over-extracting there) while bypassing other areas (under-extracting them).","explanation_es":"Notas simultáneas de agrio y amargo indican canalización: el agua encuentra caminos fáciles (sobre-extrayendo ahí) mientras evita otras áreas (sub-extrayéndolas)."}'::jsonb,
 65, ARRAY['diagnosis','channeling','advanced'], 'caldi', 'thinking'),

('c1000003-0001-4000-8000-000000000003', 'matching_pairs', 2,
 '{"instruction":"Match each symptom to its diagnosis:","instruction_es":"Relaciona cada síntoma con su diagnóstico:","pairs":[{"id":"1","left":"Sour, thin, salty","left_es":"Agrio, delgado, salado","right":"Under-extracted","right_es":"Sub-extraído"},{"id":"2","left":"Bitter, dry, astringent","left_es":"Amargo, seco, astringente","right":"Over-extracted","right_es":"Sobre-extraído"},{"id":"3","left":"Sweet, balanced, complex","left_es":"Dulce, equilibrado, complejo","right":"Well-extracted","right_es":"Bien extraído"},{"id":"4","left":"Sour AND bitter simultaneously","left_es":"Agrio Y amargo simultáneamente","right":"Uneven extraction (channeling)","right_es":"Extracción desigual (canalización)"}],"explanation":"Each extraction problem has a distinct flavor profile. Learning to taste these differences is the key to great coffee.","explanation_es":"Cada problema de extracción tiene un perfil de sabor distinto. Aprender a saborear estas diferencias es la clave del gran café."}'::jsonb,
 55, ARRAY['diagnosis','matching','tasting'], 'goat', 'excited'),

('c1000003-0001-4000-8000-000000000003', 'multiple_choice', 3,
 '{"question":"Your coffee tastes good but has a salty, hollow finish. This indicates:","question_es":"Tu café sabe bien pero tiene un final salado y hueco. Esto indica:","options":[{"id":"a","text":"Slight under-extraction","text_es":"Sub-extracción leve"},{"id":"b","text":"Severe over-extraction","text_es":"Sobre-extracción severa"},{"id":"c","text":"Perfect extraction","text_es":"Extracción perfecta"},{"id":"d","text":"Stale beans","text_es":"Granos viejos"}],"correct_answer":"a","explanation":"Saltiness and a hollow finish are subtle signs of under-extraction. The coffee needs slightly more extraction to fill out the flavor.","explanation_es":"Salinidad y un final hueco son signos sutiles de sub-extracción. El café necesita un poco más de extracción para completar el sabor."}'::jsonb,
 60, ARRAY['diagnosis','subtle','under-extraction'], 'caldi', 'curious'),

('c1000003-0001-4000-8000-000000000003', 'troubleshooting', 4,
 '{"scenario":"Your espresso has a long, lingering bitter aftertaste that dries out your mouth for minutes after drinking.","scenario_es":"Tu espresso tiene un retrogusto amargo largo y persistente que seca tu boca por minutos después de beber.","question":"What is the primary variable to adjust?","question_es":"¿Cuál es la variable principal a ajustar?","options":[{"id":"a","text":"Grind coarser (reduce extraction)","text_es":"Moler más grueso (reducir extracción)","is_correct":true},{"id":"b","text":"Use more coffee","text_es":"Usar más café","is_correct":false},{"id":"c","text":"Increase brew temperature","text_es":"Aumentar temperatura","is_correct":false},{"id":"d","text":"Use finer grind","text_es":"Usar molienda más fina","is_correct":false}],"explanation":"Lingering bitter astringency is a clear sign of over-extraction. Coarser grind reduces surface area and extraction.","explanation_es":"La astringencia amarga persistente es un signo claro de sobre-extracción. Una molienda más gruesa reduce la superficie y la extracción."}'::jsonb,
 55, ARRAY['diagnosis','espresso','troubleshooting'], 'caldi', 'thinking'),

('c1000003-0001-4000-8000-000000000003', 'comparison', 5,
 '{"question":"Which coffee problem is easier to fix by adjusting a single variable?","question_es":"¿Qué problema de café es más fácil de corregir ajustando una sola variable?","item_a":{"name":"Under-extracted (too sour)","name_es":"Sub-extraído (muy agrio)"},"item_b":{"name":"Channeled (sour AND bitter)","name_es":"Canalizado (agrio Y amargo)"},"attribute":"Ease of fixing","attribute_es":"Facilidad de corrección","correct_answer":"a","explanation":"Under-extraction can be fixed by changing one variable (finer grind, hotter water, longer time). Channeling requires fixing technique (pour pattern, bed evenness).","explanation_es":"La sub-extracción se puede corregir cambiando una variable (molienda más fina, agua más caliente, más tiempo). La canalización requiere corregir la técnica (patrón de vertido, uniformidad del lecho)."}'::jsonb,
 65, ARRAY['diagnosis','comparison','channeling'], 'goat', 'thinking'),

('c1000003-0001-4000-8000-000000000003', 'sequencing', 6,
 '{"instruction":"Order these steps for diagnosing a cup of coffee:","instruction_es":"Ordena estos pasos para diagnosticar una taza de café:","items":[{"id":"1","text":"Smell the aroma","text_es":"Oler el aroma"},{"id":"2","text":"Take a first sip and note acidity","text_es":"Dar un primer sorbo y notar la acidez"},{"id":"3","text":"Assess body and sweetness","text_es":"Evaluar cuerpo y dulzura"},{"id":"4","text":"Note the aftertaste (finish)","text_es":"Notar el retrogusto (final)"},{"id":"5","text":"Determine extraction diagnosis","text_es":"Determinar diagnóstico de extracción"}],"correct_order":["1","2","3","4","5"],"explanation":"Professional cupping follows this order: aroma → initial taste (acidity) → mid-palate (body/sweetness) → finish → diagnosis.","explanation_es":"La cata profesional sigue este orden: aroma → sabor inicial (acidez) → paladar medio (cuerpo/dulzura) → final → diagnóstico."}'::jsonb,
 50, ARRAY['diagnosis','cupping','sequencing'], 'caldi', 'celebrating');

-- =====================================================
-- UNIT 1.4: The Balanced Cup
-- =====================================================
INSERT INTO learning_units (id, section_id, name, name_es, description, description_es, icon, sort_order, estimated_minutes, lesson_count)
VALUES (
  'b1b2c3d4-0001-4000-8000-000000000004',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'The Balanced Cup',
  'La Taza Equilibrada',
  'Putting it all together to brew the perfect cup',
  'Juntándolo todo para preparar la taza perfecta',
  '🏆', 4, 12, 3
);

-- U1.4 Lesson 1: The 5 Variables
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000004-0001-4000-8000-000000000001',
  'b1b2c3d4-0001-4000-8000-000000000004',
  'The 5 Variables of Brewing',
  'Las 5 Variables de la Preparación',
  'Master the five key variables that control your extraction: dose, grind, water, time, and temperature.',
  'Domina las cinco variables clave que controlan tu extracción: dosis, molienda, agua, tiempo y temperatura.',
  1, 15, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000004-0001-4000-8000-000000000001', 'sequencing', 1,
 '{"instruction":"Order these variables by how much they affect extraction (most impact first):","instruction_es":"Ordena estas variables por cuánto afectan la extracción (mayor impacto primero):","items":[{"id":"1","text":"Grind size","text_es":"Tamaño de molienda"},{"id":"2","text":"Water temperature","text_es":"Temperatura del agua"},{"id":"3","text":"Brew time","text_es":"Tiempo de preparación"},{"id":"4","text":"Water quality","text_es":"Calidad del agua"},{"id":"5","text":"Coffee dose","text_es":"Dosis de café"}],"correct_order":["1","2","3","5","4"],"explanation":"Grind size has the biggest impact on extraction, followed by temperature and time. Dose affects strength more than extraction. Water quality has a subtle but important effect.","explanation_es":"El tamaño de molienda tiene el mayor impacto en la extracción, seguido por la temperatura y el tiempo. La dosis afecta más la fuerza que la extracción. La calidad del agua tiene un efecto sutil pero importante."}'::jsonb,
 50, ARRAY['variables','grind','temperature','time'], 'caldi', 'encouraging'),

('c1000004-0001-4000-8000-000000000001', 'true_false', 2,
 '{"statement":"Changing the coffee dose primarily affects the strength (TDS) of your brew, not the extraction yield.","statement_es":"Cambiar la dosis de café afecta principalmente la fuerza (TDS) de tu preparación, no el rendimiento de extracción.","correct_answer":true,"explanation":"Adding more coffee with the same water makes a stronger cup (higher TDS) but doesn''t significantly change what percentage of each ground is dissolved.","explanation_es":"Agregar más café con la misma agua hace una taza más fuerte (mayor TDS) pero no cambia significativamente qué porcentaje de cada grano se disuelve."}'::jsonb,
 45, ARRAY['dose','tds','strength'], 'goat', 'curious'),

('c1000004-0001-4000-8000-000000000001', 'multiple_choice', 3,
 '{"question":"Which variable should you adjust FIRST when dialing in a new coffee?","question_es":"¿Qué variable deberías ajustar PRIMERO al calibrar un café nuevo?","options":[{"id":"a","text":"Water temperature","text_es":"Temperatura del agua"},{"id":"b","text":"Brew time","text_es":"Tiempo de preparación"},{"id":"c","text":"Grind size","text_es":"Tamaño de molienda"},{"id":"d","text":"Coffee dose","text_es":"Dosis de café"}],"correct_answer":"c","explanation":"Grind size is the most impactful and controllable variable. Start by adjusting grind, then fine-tune with temperature or time.","explanation_es":"El tamaño de molienda es la variable más impactante y controlable. Empieza ajustando la molienda, luego afina con temperatura o tiempo."}'::jsonb,
 40, ARRAY['variables','grind','dialing-in'], 'caldi', 'thinking'),

('c1000004-0001-4000-8000-000000000001', 'matching_pairs', 4,
 '{"instruction":"Match each variable to what it primarily controls:","instruction_es":"Relaciona cada variable con lo que controla principalmente:","pairs":[{"id":"1","left":"Grind size","left_es":"Tamaño de molienda","right":"Extraction rate & flow","right_es":"Tasa de extracción y flujo"},{"id":"2","left":"Coffee dose","left_es":"Dosis de café","right":"Strength (TDS)","right_es":"Fuerza (TDS)"},{"id":"3","left":"Water temperature","left_es":"Temperatura del agua","right":"Extraction speed","right_es":"Velocidad de extracción"},{"id":"4","left":"Brew time","left_es":"Tiempo de preparación","right":"Total extraction amount","right_es":"Cantidad total de extracción"}],"explanation":"Each variable has a primary effect. Understanding this helps you make targeted adjustments.","explanation_es":"Cada variable tiene un efecto principal. Entender esto te ayuda a hacer ajustes dirigidos."}'::jsonb,
 45, ARRAY['variables','matching','control'], 'goat', 'happy'),

('c1000004-0001-4000-8000-000000000001', 'calculation', 5,
 '{"question":"You want a 1:16 ratio. If you use 18g of coffee, how many grams of water do you need?","question_es":"Quieres una proporción 1:16. Si usas 18g de café, ¿cuántos gramos de agua necesitas?","correct_answer":288,"tolerance":2,"unit":"g","explanation":"18g × 16 = 288g of water. This is a common ratio for pour-over brewing.","explanation_es":"18g × 16 = 288g de agua. Esta es una proporción común para preparación de pour-over."}'::jsonb,
 35, ARRAY['ratio','calculation','pour-over'], 'caldi', 'celebrating'),

('c1000004-0001-4000-8000-000000000001', 'prediction', 6,
 '{"scenario":"You have a well-balanced cup. You decide to change ONLY the dose from 15g to 20g, keeping everything else the same.","scenario_es":"Tienes una taza bien equilibrada. Decides cambiar SOLO la dosis de 15g a 20g, manteniendo todo lo demás igual.","question":"What happens to your cup?","question_es":"¿Qué pasa con tu taza?","options":[{"id":"a","text":"Stronger but similar extraction","text_es":"Más fuerte pero extracción similar"},{"id":"b","text":"Weaker and under-extracted","text_es":"Más débil y sub-extraído"},{"id":"c","text":"No change at all","text_es":"Sin cambio alguno"}],"correct_answer":"a","explanation":"More coffee with the same water makes a stronger cup (higher TDS) while extraction yield stays roughly the same.","explanation_es":"Más café con la misma agua hace una taza más fuerte (mayor TDS) mientras el rendimiento de extracción se mantiene aproximadamente igual."}'::jsonb,
 50, ARRAY['dose','strength','prediction'], 'caldi', 'curious');

-- U1.4 Lesson 2: Building Your Recipe
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000004-0001-4000-8000-000000000002',
  'b1b2c3d4-0001-4000-8000-000000000004',
  'Building Your Recipe',
  'Construyendo Tu Receta',
  'Learn the systematic approach to building a great coffee recipe from scratch.',
  'Aprende el enfoque sistemático para construir una gran receta de café desde cero.',
  2, 15, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000004-0001-4000-8000-000000000002', 'sequencing', 1,
 '{"instruction":"Order the steps for dialing in a new pour-over recipe:","instruction_es":"Ordena los pasos para calibrar una nueva receta de pour-over:","items":[{"id":"1","text":"Choose dose and ratio (e.g. 15g at 1:16)","text_es":"Elegir dosis y proporción (ej. 15g a 1:16)"},{"id":"2","text":"Set water temperature (93°C)","text_es":"Establecer temperatura del agua (93°C)"},{"id":"3","text":"Start with a medium grind","text_es":"Comenzar con molienda media"},{"id":"4","text":"Brew and taste","text_es":"Preparar y probar"},{"id":"5","text":"Adjust grind based on taste","text_es":"Ajustar molienda según el sabor"}],"correct_order":["1","2","3","4","5"],"explanation":"Start with fixed dose/ratio/temp, use a medium grind, taste the result, then adjust grind size to fine-tune extraction.","explanation_es":"Empieza con dosis/proporción/temperatura fija, usa molienda media, prueba el resultado, luego ajusta el tamaño de molienda para afinar la extracción."}'::jsonb,
 45, ARRAY['recipe','dialing-in','sequencing'], 'caldi', 'encouraging'),

('c1000004-0001-4000-8000-000000000002', 'multiple_choice', 2,
 '{"question":"What is a good starting ratio for a pour-over recipe?","question_es":"¿Cuál es una buena proporción inicial para una receta de pour-over?","options":[{"id":"a","text":"1:8","text_es":"1:8"},{"id":"b","text":"1:16","text_es":"1:16"},{"id":"c","text":"1:25","text_es":"1:25"},{"id":"d","text":"1:2","text_es":"1:2"}],"correct_answer":"b","explanation":"1:16 (1 gram of coffee to 16 grams of water) is the most common starting point for pour-over. Adjust from there based on taste preference.","explanation_es":"1:16 (1 gramo de café por 16 gramos de agua) es el punto de inicio más común para pour-over. Ajusta desde ahí según tu preferencia de sabor."}'::jsonb,
 30, ARRAY['ratio','pour-over','recipe'], 'goat', 'curious'),

('c1000004-0001-4000-8000-000000000002', 'troubleshooting', 3,
 '{"scenario":"Your first attempt at a new coffee: 15g dose, 1:16 ratio, medium grind, 93°C water. Result: sour, thin, brews in 2 minutes flat.","scenario_es":"Tu primer intento con un café nuevo: 15g de dosis, proporción 1:16, molienda media, agua a 93°C. Resultado: agrio, delgado, se prepara en 2 minutos exactos.","question":"What is your next adjustment?","question_es":"¿Cuál es tu siguiente ajuste?","options":[{"id":"a","text":"Grind finer (slow down brew, increase extraction)","text_es":"Moler más fino (ralentizar preparación, aumentar extracción)","is_correct":true},{"id":"b","text":"Use less water","text_es":"Usar menos agua","is_correct":false},{"id":"c","text":"Lower temperature to 85°C","text_es":"Bajar temperatura a 85°C","is_correct":false},{"id":"d","text":"Use less coffee","text_es":"Usar menos café","is_correct":false}],"explanation":"Sour and thin with a fast brew = under-extracted. Grinding finer increases surface area and slows flow, both increasing extraction.","explanation_es":"Agrio y delgado con preparación rápida = sub-extraído. Moler más fino aumenta la superficie y ralentiza el flujo, ambos aumentando la extracción."}'::jsonb,
 50, ARRAY['recipe','troubleshooting','grind'], 'caldi', 'thinking'),

('c1000004-0001-4000-8000-000000000002', 'calculation', 4,
 '{"question":"For a 1:15 ratio with 20g of coffee, how many grams of water do you need?","question_es":"Para una proporción 1:15 con 20g de café, ¿cuántos gramos de agua necesitas?","correct_answer":300,"tolerance":0,"unit":"g","explanation":"20g × 15 = 300g of water. A 1:15 ratio produces a slightly stronger cup than 1:16.","explanation_es":"20g × 15 = 300g de agua. Una proporción 1:15 produce una taza ligeramente más fuerte que 1:16."}'::jsonb,
 30, ARRAY['ratio','calculation','recipe'], 'caldi', 'celebrating'),

('c1000004-0001-4000-8000-000000000002', 'prediction', 5,
 '{"scenario":"After adjusting your grind finer, your pour-over now tastes sweet and balanced. You decide to try a darker roast coffee with the exact same recipe.","scenario_es":"Después de ajustar tu molienda más fina, tu pour-over ahora sabe dulce y equilibrado. Decides probar un café de tueste más oscuro con exactamente la misma receta.","question":"Will the same recipe work?","question_es":"¿La misma receta funcionará?","options":[{"id":"a","text":"Probably too bitter (over-extracted)","text_es":"Probablemente muy amargo (sobre-extraído)"},{"id":"b","text":"Should taste the same","text_es":"Debería saber igual"},{"id":"c","text":"Probably too sour (under-extracted)","text_es":"Probablemente muy agrio (sub-extraído)"}],"correct_answer":"a","explanation":"Darker roasts are more porous and soluble, so they extract faster. You''ll likely need to grind coarser or brew shorter for a dark roast.","explanation_es":"Los tuestes más oscuros son más porosos y solubles, así que se extraen más rápido. Probablemente necesitarás moler más grueso o preparar menos tiempo para un tueste oscuro."}'::jsonb,
 60, ARRAY['recipe','roast-level','prediction'], 'goat', 'thinking'),

('c1000004-0001-4000-8000-000000000002', 'true_false', 6,
 '{"statement":"Once you find a good recipe for one coffee, it will work perfectly for every coffee bean.","statement_es":"Una vez que encuentras una buena receta para un café, funcionará perfectamente para todos los granos de café.","correct_answer":false,"explanation":"Every coffee is different! Origin, roast level, freshness, and processing all affect how it extracts. Each new coffee needs dialing in.","explanation_es":"¡Cada café es diferente! El origen, nivel de tueste, frescura y procesamiento afectan cómo se extrae. Cada café nuevo necesita calibración."}'::jsonb,
 35, ARRAY['recipe','dialing-in','variety'], 'caldi', 'encouraging');

-- U1.4 Lesson 3: The Golden Ratio
INSERT INTO learning_lessons (id, unit_id, name, name_es, intro_text, intro_text_es, sort_order, xp_reward, exercise_count)
VALUES (
  'c1000004-0001-4000-8000-000000000003',
  'b1b2c3d4-0001-4000-8000-000000000004',
  'The Golden Ratio',
  'La Proporción Dorada',
  'The relationship between coffee and water is the foundation of every recipe. Let''s master it!',
  '¡La relación entre café y agua es la base de toda receta. Vamos a dominarla!',
  3, 20, 6
);

INSERT INTO learning_exercises (lesson_id, exercise_type, sort_order, question_data, difficulty_score, concept_tags, mascot, mascot_mood) VALUES
('c1000004-0001-4000-8000-000000000003', 'multiple_choice', 1,
 '{"question":"The SCA Golden Cup standard recommends a coffee-to-water ratio of approximately:","question_es":"El estándar Golden Cup de la SCA recomienda una proporción de café a agua de aproximadamente:","options":[{"id":"a","text":"1:10","text_es":"1:10"},{"id":"b","text":"1:18 (55g/L)","text_es":"1:18 (55g/L)"},{"id":"c","text":"1:25","text_es":"1:25"},{"id":"d","text":"1:5","text_es":"1:5"}],"correct_answer":"b","explanation":"The SCA recommends 55g of coffee per liter of water (approximately 1:18) as the golden ratio for drip coffee.","explanation_es":"La SCA recomienda 55g de café por litro de agua (aproximadamente 1:18) como la proporción dorada para café de filtro."}'::jsonb,
 40, ARRAY['ratio','sca','golden-cup'], 'caldi', 'encouraging'),

('c1000004-0001-4000-8000-000000000003', 'calculation', 2,
 '{"question":"You want to brew 500ml of coffee using the SCA Golden Cup ratio (55g/L). How many grams of coffee do you need?","question_es":"Quieres preparar 500ml de café usando la proporción Golden Cup de la SCA (55g/L). ¿Cuántos gramos de café necesitas?","correct_answer":27.5,"tolerance":1,"unit":"g","explanation":"500ml = 0.5L. 0.5 × 55 = 27.5g of coffee.","explanation_es":"500ml = 0.5L. 0.5 × 55 = 27.5g de café."}'::jsonb,
 45, ARRAY['ratio','calculation','sca'], 'caldi', 'celebrating'),

('c1000004-0001-4000-8000-000000000003', 'matching_pairs', 3,
 '{"instruction":"Match each ratio to its typical use case:","instruction_es":"Relaciona cada proporción con su caso de uso típico:","pairs":[{"id":"1","left":"1:2","left_es":"1:2","right":"Espresso","right_es":"Espresso"},{"id":"2","left":"1:15-1:17","left_es":"1:15-1:17","right":"Pour-over / drip","right_es":"Pour-over / filtro"},{"id":"3","left":"1:8","left_es":"1:8","right":"Cold brew concentrate","right_es":"Concentrado de cold brew"},{"id":"4","left":"1:12","left_es":"1:12","right":"French Press (strong)","right_es":"Prensa Francesa (fuerte)"}],"explanation":"Different methods use different ratios based on their extraction mechanics and desired strength.","explanation_es":"Diferentes métodos usan diferentes proporciones basadas en sus mecánicas de extracción y fuerza deseada."}'::jsonb,
 50, ARRAY['ratio','methods','matching'], 'goat', 'happy'),

('c1000004-0001-4000-8000-000000000003', 'prediction', 4,
 '{"scenario":"You normally brew at 1:16 ratio. Today you switch to 1:14 ratio with the same grind and temperature.","scenario_es":"Normalmente preparas a proporción 1:16. Hoy cambias a proporción 1:14 con la misma molienda y temperatura.","question":"How will your cup change?","question_es":"¿Cómo cambiará tu taza?","options":[{"id":"a","text":"Stronger and slightly less extracted","text_es":"Más fuerte y ligeramente menos extraído"},{"id":"b","text":"Weaker and more extracted","text_es":"Más débil y más extraído"},{"id":"c","text":"No noticeable change","text_es":"Sin cambio notable"}],"correct_answer":"a","explanation":"1:14 uses less water per gram of coffee, making a stronger cup. With less water passing through, extraction is slightly lower.","explanation_es":"1:14 usa menos agua por gramo de café, haciendo una taza más fuerte. Con menos agua pasando, la extracción es ligeramente menor."}'::jsonb,
 55, ARRAY['ratio','strength','prediction'], 'caldi', 'curious'),

('c1000004-0001-4000-8000-000000000003', 'calculation', 5,
 '{"question":"You brewed with 22g of coffee and 352g of water. What ratio did you use? (Express as 1:X)","question_es":"Preparaste con 22g de café y 352g de agua. ¿Qué proporción usaste? (Expresa como 1:X)","correct_answer":16,"tolerance":0,"unit":"","explanation":"352 ÷ 22 = 16. Your ratio was 1:16, a classic pour-over ratio.","explanation_es":"352 ÷ 22 = 16. Tu proporción fue 1:16, una proporción clásica de pour-over."}'::jsonb,
 40, ARRAY['ratio','calculation','reverse'], 'goat', 'celebrating'),

('c1000004-0001-4000-8000-000000000003', 'comparison', 6,
 '{"question":"Which produces a STRONGER cup of coffee (higher TDS)?","question_es":"¿Cuál produce una taza de café MÁS FUERTE (mayor TDS)?","item_a":{"name":"15g coffee + 240g water (1:16)","name_es":"15g café + 240g agua (1:16)"},"item_b":{"name":"15g coffee + 180g water (1:12)","name_es":"15g café + 180g agua (1:12)"},"attribute":"Strength (TDS)","attribute_es":"Fuerza (TDS)","correct_answer":"b","explanation":"1:12 uses less water for the same dose, creating a more concentrated (stronger) cup. The solubles are dissolved in less liquid.","explanation_es":"1:12 usa menos agua para la misma dosis, creando una taza más concentrada (fuerte). Los solubles están disueltos en menos líquido."}'::jsonb,
 45, ARRAY['ratio','comparison','strength'], 'caldi', 'thinking');
