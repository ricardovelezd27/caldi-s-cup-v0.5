import { describe, it, expect } from "vitest";
import { EXERCISE_COLORS, EXERCISE_TIMING } from "./exerciseTokens";

describe("exerciseTokens", () => {
  it("EXERCISE_COLORS has expected keys", () => {
    expect(EXERCISE_COLORS).toHaveProperty("correct");
    expect(EXERCISE_COLORS).toHaveProperty("incorrect");
    expect(EXERCISE_COLORS).toHaveProperty("selected");
    expect(EXERCISE_COLORS).toHaveProperty("optionBorder");
    expect(EXERCISE_COLORS).toHaveProperty("disabledText");
  });

  it("EXERCISE_TIMING has expected keys with positive values", () => {
    expect(EXERCISE_TIMING.select).toBeGreaterThan(0);
    expect(EXERCISE_TIMING.feedback).toBeGreaterThan(0);
    expect(EXERCISE_TIMING.transition).toBeGreaterThan(0);
    expect(EXERCISE_TIMING.celebration).toBeGreaterThan(0);
  });
});
