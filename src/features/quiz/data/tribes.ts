import { TribeDefinition, CoffeeTribe } from '../types/tribe';

export const TRIBES: Record<CoffeeTribe, TribeDefinition> = {
  fox: {
    id: 'fox',
    name: 'The Fox',
    title: 'The Tastemaker',
    emoji: '🦊',
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
    values: ['Status', 'Exclusivity', 'Cultural Capital'],
    keywords: ['Geisha', 'Rare', 'Competition', 'Anaerobic', '90+', 'Award', 'Exclusive'],
    description: 'You seek the exceptional and the exclusive. Your coffee isn\'t just a drink—it\'s a statement. You\'re drawn to rare lots, award-winning micro-batches, and the stories behind each cup. For you, coffee is cultural currency.',
    coffeeRecommendations: [
      'Panama Geisha - Anaerobic Natural',
      'Ethiopia Yirgacheffe - Competition Lot',
      'Costa Rica Tarrazú - Honey Process 90+'
    ]
  },
  owl: {
    id: 'owl',
    name: 'The Owl',
    title: 'The Optimizer',
    emoji: '🦉',
    colorClass: 'text-secondary',
    bgClass: 'bg-secondary/10',
    values: ['Data', 'Precision', 'Clarity', 'Control'],
    keywords: ['Washed', 'Light Roast', 'Elevation', 'MASL', 'Typica', 'Bourbon', 'Clean'],
    description: 'You approach coffee with scientific precision. Elevation, varietal, processing method—these details matter to you. You dial in your extraction ratio and track your brewing variables. Coffee is your daily optimization ritual.',
    coffeeRecommendations: [
      'Kenya AA - Washed, 1800 MASL',
      'Guatemala Huehuetenango - Bourbon, Light Roast',
      'Colombian Supremo - Typica, Single Estate'
    ]
  },
  hummingbird: {
    id: 'hummingbird',
    name: 'The Hummingbird',
    title: 'The Explorer',
    emoji: '🐦',
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    values: ['Novelty', 'Sensation', 'Vibes', 'Fun'],
    keywords: ['Natural', 'Fruit', 'Fermented', 'Co-ferment', 'Funky', 'Blend', 'Strawberry'],
    description: 'You\'re chasing the next taste adventure. Wild fermentation? Funky naturals? Experimental co-ferments? You\'re there. Coffee should surprise you, delight you, and give you something to talk about.',
    coffeeRecommendations: [
      'Ethiopia Sidama - Natural Processed, Funky',
      'Brazil Cerrado - Anaerobic Fermentation',
      'Rwanda - Co-fermented with Passion Fruit'
    ]
  },
  bee: {
    id: 'bee',
    name: 'The Bee',
    title: 'The Loyalist',
    emoji: '🐝',
    colorClass: 'text-accent',
    bgClass: 'bg-accent/10',
    values: ['Comfort', 'Safety', 'Consistency', 'Trust'],
    keywords: ['House Blend', 'Dark Roast', 'Medium Roast', 'Chocolate', 'Nutty', 'Caramel', 'Bold'],
    description: 'You know what you like, and that\'s a beautiful thing. Your perfect cup is consistent, comforting, and reliably excellent. Coffee is your daily anchor—a moment of calm in the chaos.',
    coffeeRecommendations: [
      'Classic House Blend - Medium-Dark Roast',
      'Colombian Supremo - Nutty & Chocolatey',
      'Brazilian Santos - Caramel & Smooth'
    ]
  }
};

export const getTribeDefinition = (tribe: CoffeeTribe): TribeDefinition => {
  return TRIBES[tribe];
};

export const TRIBE_ORDER: CoffeeTribe[] = ['fox', 'owl', 'hummingbird', 'bee'];
