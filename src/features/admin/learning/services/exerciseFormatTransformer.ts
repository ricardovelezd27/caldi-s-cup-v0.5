/**
 * Transforms flat AI-generated exercise JSON into the `question_data` JSONB
 * shape each exercise component expects.
 *
 * Pure function — no side effects, easy to unit test.
 */

function normalizeMascot(mascot: string): string {
  const lower = mascot.toLowerCase();
  if (lower.includes("goat")) return "goat";
  return "caldi";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformFlatExerciseToQuestionData(type: string, ex: Record<string, any>): Record<string, unknown> {
  switch (type) {
    case "true_false":
      return {
        statement: ex.question ?? "",
        statement_es: ex.question_es ?? "",
        correct_answer: ex.correct_answer,
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    case "multiple_choice":
      return {
        question: ex.question ?? "",
        question_es: ex.question_es ?? "",
        options: (ex.options ?? []).map((o: { id: string; text: string; text_es?: string }) => ({
          id: o.id,
          text: o.text,
          text_es: o.text_es,
        })),
        correct_answer: ex.correct_answer_id ?? ex.correct_answer ?? "",
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    case "matching_pairs":
      return {
        instruction: ex.question ?? "",
        instruction_es: ex.question_es ?? "",
        pairs: (ex.pairs ?? []).map((p: { left: string; left_es?: string; right: string; right_es?: string }, i: number) => ({
          id: `pair_${i}`,
          left: p.left,
          left_es: p.left_es,
          right: p.right,
          right_es: p.right_es,
        })),
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    case "sequencing":
      return {
        instruction: ex.question ?? "",
        instruction_es: ex.question_es ?? "",
        items: (ex.steps ?? []).map((s: { id: string; text: string; text_es?: string }) => ({
          id: s.id,
          text: s.text,
          text_es: s.text_es,
        })),
        correct_order: ex.correct_order ?? (ex.steps ?? []).map((s: { id: string }) => s.id),
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    case "categorization":
      return {
        instruction: ex.question ?? "",
        instruction_es: ex.question_es ?? "",
        categories: (ex.categories ?? []).map((c: { id: string; name: string; name_es?: string }) => ({
          id: c.id,
          name: c.name,
          name_es: c.name_es,
        })),
        items: (ex.items ?? []).map((it: { text: string; text_es?: string; category_id: string }, i: number) => ({
          id: `item_${i}`,
          text: it.text,
          text_es: it.text_es,
          category_id: it.category_id,
        })),
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    case "prediction":
      return {
        scenario: ex.question ?? "",
        scenario_es: ex.question_es ?? "",
        question: ex.question ?? "",
        question_es: ex.question_es ?? "",
        options: (ex.options ?? []).map((o: { symbol?: string; text: string; text_es?: string }, i: number) => ({
          id: o.symbol ?? `opt_${i}`,
          text: o.text,
          text_es: o.text_es,
        })),
        correct_answer: ex.correct_answer ?? "",
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    case "comparison":
      return {
        question: ex.question ?? "",
        question_es: ex.question_es ?? "",
        item_a: ex.items?.[0]
          ? { name: ex.items[0].name, name_es: ex.items[0].name_es }
          : { name: "", name_es: "" },
        item_b: ex.items?.[1]
          ? { name: ex.items[1].name, name_es: ex.items[1].name_es }
          : { name: "", name_es: "" },
        correct_answer: ex.correct_item_id === ex.items?.[0]?.id ? "a" : "b",
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    case "troubleshooting":
      return {
        scenario: ex.question ?? "",
        scenario_es: ex.question_es ?? "",
        question: ex.question ?? "",
        question_es: ex.question_es ?? "",
        options: (ex.options ?? []).map((o: { id: string; text: string; text_es?: string }) => ({
          id: o.id,
          text: o.text,
          text_es: o.text_es,
          is_correct: o.id === (ex.correct_answer_id ?? ex.correct_answer),
        })),
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    case "recipe_building":
      return {
        instruction: ex.question ?? "",
        instruction_es: ex.question_es ?? "",
        method: "custom",
        variables: (ex.variables ?? []).map((v: { name: string; name_es?: string; options?: string[]; options_es?: string[] }, i: number) => ({
          id: `var_${i}`,
          name: v.name,
          name_es: v.name_es,
          type: "select" as const,
          options: (v.options ?? []).map((opt: string, oi: number) => ({
            value: opt,
            label: opt,
            label_es: v.options_es?.[oi] ?? opt,
          })),
        })),
        valid_combinations: (ex.valid_combinations ?? []).map((combo: { selection: string[]; selection_es?: string[] }) => {
          const result: Record<string, string> = {};
          (combo.selection ?? []).forEach((val: string, i: number) => {
            result[`var_${i}`] = val;
          });
          return result;
        }),
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    case "image_identification":
      return {
        instruction: ex.question ?? "",
        instruction_es: ex.question_es ?? "",
        options: (ex.images ?? []).map((img: { id: string; url?: string; description?: string; description_es?: string }) => ({
          id: img.id,
          text: img.description ?? "",
          text_es: img.description_es ?? "",
        })),
        correct_answer: ex.correct_image_id ?? "",
        explanation: ex.explanation ?? "",
        explanation_es: ex.explanation_es ?? "",
        mascot_feedback: ex.mascot_feedback,
        mascot_feedback_es: ex.mascot_feedback_es,
      };

    default:
      // Fallback: store as-is
      return { ...ex };
  }
}

export { normalizeMascot };
