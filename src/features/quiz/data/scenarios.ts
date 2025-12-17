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
        tribe: 'fox',
        icon: 'Sparkles'
      },
      { 
        id: 'B', 
        label: 'The Smart Pick', 
        tribe: 'owl',
        icon: 'LineChart'
      },
      { 
        id: 'C', 
        label: 'The Vibe', 
        tribe: 'hummingbird',
        icon: 'Camera'
      },
      { 
        id: 'D', 
        label: 'The Classic', 
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
        tribe: 'fox',
        icon: 'Key'
      },
      { 
        id: 'B', 
        label: 'The Perfect Itinerary', 
        tribe: 'owl',
        icon: 'Map'
      },
      { 
        id: 'C', 
        label: 'Wherever The Party Is', 
        tribe: 'hummingbird',
        icon: 'PartyPopper'
      },
      { 
        id: 'D', 
        label: 'The Cozy Retreat', 
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
        tribe: 'fox',
        icon: 'Zap'
      },
      { 
        id: 'B', 
        label: 'Wait For The Specs', 
        tribe: 'owl',
        icon: 'FileSearch'
      },
      { 
        id: 'C', 
        label: 'Get It For The Fun', 
        tribe: 'hummingbird',
        icon: 'Smile'
      },
      { 
        id: 'D', 
        label: 'Stick With What Works', 
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
        tribe: 'fox',
        icon: 'Gem'
      },
      { 
        id: 'B', 
        label: 'Folders For Everything', 
        tribe: 'owl',
        icon: 'FolderTree'
      },
      { 
        id: 'C', 
        label: 'Beautiful Chaos', 
        tribe: 'hummingbird',
        icon: 'Palette'
      },
      { 
        id: 'D', 
        label: 'Standard & Simple', 
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
        tribe: 'fox',
        icon: 'Gift'
      },
      { 
        id: 'B', 
        label: 'Something Practical', 
        tribe: 'owl',
        icon: 'Wrench'
      },
      { 
        id: 'C', 
        label: 'An Epic Experience', 
        tribe: 'hummingbird',
        icon: 'Ticket'
      },
      { 
        id: 'D', 
        label: 'Something Sentimental', 
        tribe: 'bee',
        icon: 'HeartHandshake'
      }
    ]
  }
];

export const TOTAL_SCENARIOS = QUIZ_SCENARIOS.length;
