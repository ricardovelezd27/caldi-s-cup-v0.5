export const en = {
  nav: {
    scanner: "Label Scanner",
    profile: "My Profile",
    ourStory: "Our Story",
    brewLog: "The Brew Log",
    signIn: "Sign In",
    signOut: "Sign Out",
    feedback: "Feedback",
    menu: "Open menu",
  },
  hero: {
    badge: "AI-POWERED COFFEE DISCOVERY",
    headlinePart1: "Coffee Got ",
    headlineCrossed: "Complicated",
    headlinePart2: "Caldi Makes It Simple.",
    body: "No more guessing. No more jargon. Discover coffees that match your unique taste.",
    cta: "Give Caldi AI a Try!",
    ctaSecondary: "How it works",
    speechBubble: "Let's find your match!",
  },
  features: {
    sectionTitle: "What Caldi Does For You",
    scan: {
      title: "Scan & Understand Any Coffee",
      description:
        "Snap a photo of the bag and instantly decode what makes it special: flavor notes, origin story, and all that confusing jargon translated into plain language.",
    },
    favorites: {
      title: "Never Forget a Great Coffee",
      description:
        "Trying samples at a fair or exploring cafés in your city? Save every coffee you discover so you can remember what you loved and actually find it again later.",
    },
    tribe: {
      title: "Find Your Coffee Tribe",
      description:
        "Skip the intimidating jargon. Answer a few fun questions about how you like your mornings, and we'll match you to your perfect coffee personality, no expertise required.",
    },
  },
  footer: {
    tagline: "Coffee got complicated, Caldi brings it back to clarity.",
    explore: "Explore",
    company: "Company",
    getInTouch: "Get in Touch",
    followUs: "Follow us",
    giveFeedback: "Give Feedback",
    copyright: "Brewed with love.",
    rights: "All rights reserved.",
    scanner: "Label Scanner",
    quiz: "Coffee Quiz",
    brewLog: "The Brew Log",
    ourStory: "Our Story",
  },
  scanner: {
    title: "Coffee Scanner",
    subtitle: "Scan a coffee bag or add one manually",
    tabScan: "Scan",
    tabManual: "Add Manually",
    quizWarningTitle: "Take the Quiz First!",
    quizWarningBody: "For personalized match scores, complete the",
    quizWarningLink: "Coffee Personality Quiz",
    quizWarningEnd: "to discover your coffee tribe.",
    scanFailedTitle: "Scan Failed",
    tryAgain: "Try Again",
  },
  quiz: {
    whatIsThis: "What is this?",
    discoverTitle: "DISCOVER YOUR",
    tribeTitle: "COFFEE TRIBE",
    subheadline: "5 quick questions. 4 coffee personalities.",
    subheadline2: "Find out which one matches your vibe.",
    cta: "Decode My Coffee Ritual",
    timeEstimate: "Takes less than 2 minutes",
  },
  ourStory: {
    heroTitle: "The Story Behind Your Next Great Cup",
    heroParagraph1:
      "Ever stood in the coffee aisle, overwhelmed by endless options, wondering which bag will actually taste good tomorrow morning? That's where Caldi's Cup was born.",
    heroParagraph2:
      "We help you scan any coffee bag and instantly understand what's inside. But we're building something bigger, tools that help you discover and enjoy coffee in your own way. Think of us as your AI-powered coffee companion.",
    whyTitle: "Why \"Caldi\"?",
    whyParagraph1:
      "Legend has it that Kaldi, an Ethiopian goat herder, discovered coffee centuries ago when he noticed his goats dancing with unusual energy after eating mysterious red berries. Curious, he tried them himself, and the rest is history.",
    whyParagraph2:
      "We changed the K to a C as an homage to Colombia, the land of exceptional coffee and the heart of our mission. Caldi's Cup honors both the ancient discovery and the modern mission: helping you discover your perfect coffee while transforming lives in Colombian coffee communities.",
    meetTitle: "Meet the Team",
    meetIntro: "I'm Ricardo, and I built Caldi's Cup at the intersection of three passions:",
    passion1Label: "Understanding people:",
    passion1Text: "Using behavioral science to solve real frustrations",
    passion2Label: "Smart technology:",
    passion2Text: "AI that serves you, not complicates your life",
    passion3Label: "Transforming Colombia",
    passion3Text: "One cup at a time",
    missionTitle: "A Personal Mission",
    missionQ1:
      "I'm Colombian. Coffee is in my blood, I believe in coffee as the force that will transform my country.",
    missionQ2:
      "The farmers growing the world's finest coffee often can't make a living from it. Some turn to coca farming out of desperation. Caldi's Cup will change this story.",
    missionQ3:
      "By helping you discover exceptional coffee, we create demand that rewards quality. We build pathways for farmers to earn dignified livelihoods doing what they do best.",
    northStarTitle: "Our North Star",
    missionCardTitle: "🎯 Mission",
    missionCardText:
      "Make discovering exceptional coffee effortless, while creating real value for the farmers behind every bean.",
    visionCardTitle: "🌟 Vision",
    visionCardText:
      "A world where technology brings you closer to your perfect cup, and every purchase supports farmers building better futures.",
    journeyTitle: "The Journey Ahead",
    journeyToday: "Today",
    journeyTodayText: "Scan & Discover",
    journeyTomorrow: "Tomorrow",
    journeyTomorrowText: "Personalized Brewing Guides & AI at every level — send us your ideas!",
    journeyFuture: "Future",
    journeyFutureText: "Your Complete Coffee Companion",
    ctaTitle: "Ready to discover something extraordinary?",
    ctaButton: "Give Caldi AI a try!",
    ctaSignoff: "With purpose and passion,",
    ctaFounder: "Ricardo",
    ctaFounderRole: "Founder, Caldi's Cup",
    connectText: "Passionate about coffee, technology, or responsible business? Let's connect.",
    feedbackButton: "Give Us Feedback",
  },
  blog: {
    title: "The Brew Log",
    subtitle: "Stories, tips, and rabbit holes from the world of coffee.",
    comingSoon: "Brewing soon — stay tuned!",
  },
  profile: {
    title: "My Profile",
    tribeHeading: "You experience coffee like...",
  },
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    tryAgain: "Try Again",
    save: "Save",
    cancel: "Cancel",
    comingSoon: "Soon",
  },
} as const;

export type TranslationKeys = typeof en;
