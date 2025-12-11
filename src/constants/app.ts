export const APP_CONFIG = {
  name: "Caldi's Cup",
  tagline: "Find Your Perfect Coffee",
  description: "No more guessing. No more jargon. Take our quick quiz and discover coffees that match your unique taste.",
  year: new Date().getFullYear(),
  social: {
    // Ready for future social links
  }
} as const;

export const ROUTES = {
  home: '/',
  quiz: '/quiz',
  results: '/results',
  about: '/about',
} as const;
