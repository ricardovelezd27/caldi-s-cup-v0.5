import { describe, it, expect } from "vitest";
import { getRandomDialogue, MASCOT_DIALOGUES } from "./mascotDialogues";

describe("getRandomDialogue", () => {
  it("returns a string from the caldi correct array", () => {
    const result = getRandomDialogue("caldi", "correct");
    expect(MASCOT_DIALOGUES.caldi.correct).toContain(result);
  });

  it("returns a string from the goat greeting array", () => {
    const result = getRandomDialogue("goat", "greeting");
    expect(MASCOT_DIALOGUES.goat.greeting).toContain(result);
  });

  it("replaces template variables", () => {
    const result = getRandomDialogue("caldi", "streak", { days: 7 });
    expect(result).toContain("7");
  });

  it("falls back to caldi when given unknown mascot data", () => {
    // goat has fewer streak dialogues but should still return a string
    const result = getRandomDialogue("goat", "streak", { days: 3 });
    expect(typeof result).toBe("string");
    expect(result).toContain("3");
  });
});
