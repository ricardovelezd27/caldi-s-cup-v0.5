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
  dashboard: "/dashboard",
  scanner: "/scanner",
  recipes: "/recipes",
  about: "/about",
  cart: "/cart",
  auth: "/auth",
  coffeeProfile: "/coffee",
} as const;

export const NAV_LINKS = [
  { label: "Marketplace", path: "/marketplace" },
  { label: "Scanner", path: "/scanner" },
  { label: "Recipes", path: "/recipes" },
] as const;
