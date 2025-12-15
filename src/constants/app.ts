export const APP_CONFIG = {
  name: "Caldi's Cup",
  tagline: "Coffee got complicated, Caldi brings it back to clarity.",
  description: "No more guessing. No more jargon. Discover coffees that match your unique taste.",
  year: new Date().getFullYear(),
  cta: {
    primary: "Give Caldi AI a try!",
    secondary: "Learn More",
  },
  social: {
    // Ready for future social links
  },
} as const;

export const ROUTES = {
  home: "/",
  marketplace: "/marketplace",
  quiz: "/quiz",
  results: "/results",
  about: "/about",
} as const;

export const NAV_LINKS = [
  { label: "Marketplace", path: "/marketplace" },
] as const;
