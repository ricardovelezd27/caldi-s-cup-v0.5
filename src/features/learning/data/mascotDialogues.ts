export const MASCOT_DIALOGUES = {
  caldi: {
    greeting: [
      "Ready to brew some knowledge? ☕",
      "Let's get caffeinated with learning!",
      "Another day, another cup of wisdom!",
      "Time to level up your coffee game!",
    ],
    correct: [
      "Perfect extraction! 💯",
      "You nailed it!",
      "That's the good stuff!",
      "Smooth as a perfect pour-over!",
      "Barista-level knowledge right there!",
    ],
    incorrect: [
      "Not quite, but every barista learns from mistakes!",
      "Let's try that again — even pros taste before they perfect!",
      "Close! Remember, practice makes perfect espresso.",
      "That's okay! Coffee wisdom takes time to brew.",
    ],
    encouragement: [
      "You've got this!",
      "Take your time, good coffee can't be rushed.",
      "Think about it like pulling a shot — patience pays off!",
      "Trust your palate!",
    ],
    streak: [
      "🔥 {days} day streak! Keep the beans flowing!",
      "Unstoppable! {days} days of coffee wisdom!",
      "{days} days strong! You're on fire! 🔥",
    ],
    lessonComplete: [
      "Lesson complete! You earned {xp} XP! ☕",
      "Amazing work! +{xp} XP added to your total!",
      "That's a wrap! {xp} XP in the bag!",
    ],
  },
  goat: {
    greeting: [
      "Meh-eh-eh! Ready for a history adventure? 🐐",
      "*munches coffee cherry* Oh, hi there!",
      "Let me tell you about the OLD days...",
      "Back in Ethiopia, we didn't have fancy machines... 🐐",
    ],
    correct: [
      "The monks would be proud! 🐐",
      "*happy goat noises*",
      "You know your coffee history!",
      "Meh-eh-eh! That's right!",
    ],
    incorrect: [
      "*confused goat face* Hmm, that's not how I remember it...",
      "Even I got confused sometimes! Let's try again.",
      "The legend says otherwise... 🐐",
    ],
    encouragement: [
      "Think back to the old stories...",
      "What would the Sufi monks do? 🤔",
      "History has the answers!",
    ],
    streak: [
      "🔥 {days} day streak! Keep the beans flowing!",
      "Unstoppable! {days} days of coffee wisdom!",
    ],
    lessonComplete: [
      "Lesson complete! You earned {xp} XP! 🐐",
      "Amazing work! +{xp} XP! The monks are proud!",
    ],
  },
} as const;

type MascotId = keyof typeof MASCOT_DIALOGUES;
type DialogueCategory = keyof typeof MASCOT_DIALOGUES.caldi;

export function getRandomDialogue(
  mascot: MascotId,
  category: DialogueCategory,
  replacements?: Record<string, string | number>,
): string {
  const mascotData = MASCOT_DIALOGUES[mascot] ?? MASCOT_DIALOGUES.caldi;
  const dialogues = (mascotData as any)[category] ?? MASCOT_DIALOGUES.caldi[category];
  const randomIndex = Math.floor(Math.random() * dialogues.length);
  let text: string = dialogues[randomIndex];

  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value));
    });
  }

  return text;
}
