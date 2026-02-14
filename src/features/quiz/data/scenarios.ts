import { QuizScenario } from '../types/tribe';

export const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 1,
    category: 'Dining Proxy',
    question: "You're at a new restaurant. What do you order?",
    options: [
      { 
        id: 'A', 
        label: "The Chef's Challenge", 
        description: "You live for surprises—let the kitchen wow you with something you'd never pick yourself.",
        tribe: 'fox',
        icon: 'Sparkles'
      },
      { 
        id: 'B', 
        label: 'The Smart Pick', 
        description: "You've already checked the reviews. You know exactly which dish has the best value.",
        tribe: 'owl',
        icon: 'LineChart'
      },
      { 
        id: 'C', 
        label: 'The Vibe', 
        description: "Honestly? Whatever looks best on camera. The aesthetic IS the meal.",
        tribe: 'hummingbird',
        icon: 'Camera'
      },
      { 
        id: 'D', 
        label: 'The Classic', 
        description: "If it ain't broke, don't fix it. You know what you love and you're sticking with it.",
        tribe: 'bee',
        icon: 'Heart'
      }
    ]
  },
  {
    id: 2,
    category: 'Travel Proxy',
    question: "It's vacation time. Where are we going?",
    options: [
      { 
        id: 'A', 
        label: 'Hidden Gems Only', 
        description: "Off the beaten path, no tourist traps. If it's on a top-10 list, you're not interested.",
        tribe: 'fox',
        icon: 'Key'
      },
      { 
        id: 'B', 
        label: 'The Perfect Itinerary', 
        description: "Spreadsheet-planned, hour-by-hour. Maximum experiences, zero wasted time.",
        tribe: 'owl',
        icon: 'Map'
      },
      { 
        id: 'C', 
        label: 'Wherever The Party Is', 
        description: "No plan needed—just good energy, great people, and spontaneous adventures.",
        tribe: 'hummingbird',
        icon: 'PartyPopper'
      },
      { 
        id: 'D', 
        label: 'The Cozy Retreat', 
        description: "Same cabin by the lake, same book on the porch. Comfort is the destination.",
        tribe: 'bee',
        icon: 'Home'
      }
    ]
  },
  {
    id: 3,
    category: 'Tech Proxy',
    question: 'A revolutionary gadget just dropped.',
    options: [
      { 
        id: 'A', 
        label: 'Pre-Order Immediately', 
        description: "Day-one adopter, always. You want to be the first to try what's next.",
        tribe: 'fox',
        icon: 'Zap'
      },
      { 
        id: 'B', 
        label: 'Wait For The Specs', 
        description: "You need benchmarks, teardowns, and at least three comparison videos first.",
        tribe: 'owl',
        icon: 'FileSearch'
      },
      { 
        id: 'C', 
        label: 'Get It For The Fun', 
        description: "Who cares about specs? If it looks cool and feels fun, you're in.",
        tribe: 'hummingbird',
        icon: 'Smile'
      },
      { 
        id: 'D', 
        label: 'Stick With What Works', 
        description: "Your current setup is just fine. Why fix something that isn't broken?",
        tribe: 'bee',
        icon: 'Shield'
      }
    ]
  },
  {
    id: 4,
    category: 'Home Screen Proxy',
    question: 'What does your phone home screen look like?',
    options: [
      { 
        id: 'A', 
        label: 'Curated & Minimal', 
        description: "Every icon is intentional. Your wallpaper? Carefully chosen. It's a vibe.",
        tribe: 'fox',
        icon: 'Gem'
      },
      { 
        id: 'B', 
        label: 'Folders For Everything', 
        description: "Color-coded, labeled, organized. Finding any app takes exactly one second.",
        tribe: 'owl',
        icon: 'FolderTree'
      },
      { 
        id: 'C', 
        label: 'Beautiful Chaos', 
        description: "Widgets everywhere, random apps, 47 unread notifications. It's YOUR chaos.",
        tribe: 'hummingbird',
        icon: 'Palette'
      },
      { 
        id: 'D', 
        label: 'Standard & Simple', 
        description: "Default layout, stock wallpaper. The phone is a tool, not a canvas.",
        tribe: 'bee',
        icon: 'Grid3x3'
      }
    ]
  },
  {
    id: 5,
    category: 'Gift Proxy',
    question: "Best friend's birthday gift?",
    options: [
      { 
        id: 'A', 
        label: 'Something Rare & Special', 
        description: "A limited-edition find they'd never discover on their own. That's the flex.",
        tribe: 'fox',
        icon: 'Gift'
      },
      { 
        id: 'B', 
        label: 'Something Practical', 
        description: "A gift they'll actually use every day. Thoughtful = useful in your book.",
        tribe: 'owl',
        icon: 'Wrench'
      },
      { 
        id: 'C', 
        label: 'An Epic Experience', 
        description: "Concert tickets, skydiving, a surprise trip—memories over things, always.",
        tribe: 'hummingbird',
        icon: 'Ticket'
      },
      { 
        id: 'D', 
        label: 'Something Sentimental', 
        description: "A handwritten letter, a photo album, something from the heart. Classic you.",
        tribe: 'bee',
        icon: 'HeartHandshake'
      }
    ]
  }
];

export const TOTAL_SCENARIOS = QUIZ_SCENARIOS.length;
