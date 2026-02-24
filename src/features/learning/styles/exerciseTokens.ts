/** Design tokens for exercise components – all HSL-based to match the Caldi theme. */

export const EXERCISE_COLORS = {
  correct: "142 71% 45%",       // green
  correctLight: "142 76% 90%",
  incorrect: "0 84% 60%",       // red
  incorrectLight: "0 100% 93%",
  selected: "174 40% 50%",      // teal (secondary)
  selectedLight: "174 40% 92%",
  optionBorder: "220 9% 90%",
  optionBg: "0 0% 100%",
  disabledText: "0 0% 69%",
} as const;

export const EXERCISE_TIMING = {
  select: 150,
  feedback: 300,
  transition: 200,
  celebration: 500,
} as const;
