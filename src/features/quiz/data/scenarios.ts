import { QuizScenario } from '../types/tribe';

export const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 1,
    category: 'Dining Proxy',
    question: "You're at a new restaurant. What do you order?",
    options: [
      { id: 'A', label: "Chef's Tasting", description: "Avant-garde culinary art.", tribe: 'fox', icon: 'Sparkles' },
      { id: 'B', label: 'Top Rated', description: "Highly reviewed, trusted classics.", tribe: 'owl', icon: 'LineChart' },
      { id: 'C', label: 'The Scene', description: "Aesthetic, vibrant, and photogenic.", tribe: 'hummingbird', icon: 'Camera' },
      { id: 'D', label: 'Comfort Food', description: "Familiar, hearty, and warm.", tribe: 'bee', icon: 'Heart' },
    ],
  },
  {
    id: 2,
    category: 'Travel Proxy',
    question: "It's vacation time. Where are we going?",
    options: [
      { id: 'A', label: 'Off the Grid', description: "Hidden, secret gems.", tribe: 'fox', icon: 'Key' },
      { id: 'B', label: 'Planned Perfectly', description: "Detailed, optimized itineraries.", tribe: 'owl', icon: 'Map' },
      { id: 'C', label: 'The Action', description: "Festivals, nightlife, mingling.", tribe: 'hummingbird', icon: 'PartyPopper' },
      { id: 'D', label: 'Cozy Escape', description: "Relaxing, quiet cabin retreat.", tribe: 'bee', icon: 'Home' },
    ],
  },
  {
    id: 3,
    category: 'Home Screen Proxy',
    question: 'What does your phone home screen look like?',
    options: [
      { id: 'A', label: 'Minimalist', description: "Curated, aesthetic, distraction-free.", tribe: 'fox', icon: 'Gem' },
      { id: 'B', label: 'Organized', description: "Neat folders for everything.", tribe: 'owl', icon: 'FolderTree' },
      { id: 'C', label: 'Chaotic Good', description: "Colorful apps and widgets everywhere.", tribe: 'hummingbird', icon: 'Palette' },
      { id: 'D', label: 'Factory Default', description: "Standard, simple, out-of-the-box.", tribe: 'bee', icon: 'Grid3x3' },
    ],
  },
  {
    id: 4,
    category: 'Gift Proxy',
    question: "Best friend's birthday gift?",
    options: [
      { id: 'A', label: 'Rare Find', description: "Vintage, obscure, hard to get.", tribe: 'fox', icon: 'Gift' },
      { id: 'B', label: 'High Utility', description: "Highly practical and useful.", tribe: 'owl', icon: 'Wrench' },
      { id: 'C', label: 'Live Event', description: "Tickets to a concert or experience.", tribe: 'hummingbird', icon: 'Ticket' },
      { id: 'D', label: 'Sentimental', description: "Handmade, thoughtful, personal.", tribe: 'bee', icon: 'HeartHandshake' },
    ],
  },
  {
    id: 5,
    category: 'Coffee Journey',
    question: 'Where are you in your coffee journey right now?',
    options: [
      { id: 'A', label: 'Exploring the Rare', description: "Chasing exotic origins and wild fermentations.", tribe: 'fox', icon: 'Sparkles' },
      { id: 'B', label: 'Dialing It In', description: "Perfecting recipes, ratios, and extraction.", tribe: 'owl', icon: 'Target' },
      { id: 'C', label: 'Cafe Hopping', description: "Discovering trendy spots and aesthetic drinks.", tribe: 'hummingbird', icon: 'MapPin' },
      { id: 'D', label: 'The Daily Ritual', description: "Enjoying a comforting, reliable everyday cup.", tribe: 'bee', icon: 'Heart' },
    ],
  },
];

export const TOTAL_SCENARIOS = QUIZ_SCENARIOS.length;
