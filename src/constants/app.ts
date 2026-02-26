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
  // Active routes
  quiz: "/quiz",
  results: "/results",
  dashboard: "/dashboard",
  scanner: "/scanner",

  learn: "/learn",
  leaderboard: "/leaderboard",
  achievements: "/achievements",

  // @dormant — Reserved for future marketplace/cart/recipes features
  marketplace: "/marketplace",
  recipes: "/recipes",
  cart: "/cart",
  auth: "/auth",
  coffeeProfile: "/coffee",
  contactFeedback: "/contact_feedback",
  profile: "/profile",
  blog: "/brew-log",
  admin: "/admin",
} as const;

export const NAV_LINKS = [
  { label: "Label Scanner", path: "/scanner" },
] as const;
