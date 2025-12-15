import { Product, Roaster } from "@/types/coffee";

export const mockRoasters: Roaster[] = [
  {
    id: "roaster-1",
    name: "Mountain Peak Roasters",
    slug: "mountain-peak-roasters",
    description: "Crafting exceptional single-origin coffees since 2012. We source directly from farmers who share our passion for quality and sustainability.",
    story: "Founded in the highlands of Colombia, Mountain Peak Roasters began as a small family operation dedicated to showcasing the incredible diversity of Latin American coffee. Today, we partner with over 50 farms across 8 countries.",
    logoUrl: "/placeholder.svg",
    location: {
      city: "Portland",
      country: "USA"
    },
    website: "https://mountainpeakroasters.com",
    certifications: ["organic", "fairTrade", "bCorp"],
    createdAt: "2012-03-15"
  },
  {
    id: "roaster-2",
    name: "Nordic Brew Co.",
    slug: "nordic-brew-co",
    description: "Light roast specialists bringing Scandinavian coffee culture to the world. Every bean tells a story of origin and craft.",
    location: {
      city: "Copenhagen",
      country: "Denmark"
    },
    certifications: ["organic", "rainforestAlliance"],
    createdAt: "2018-06-01"
  },
  {
    id: "roaster-3",
    name: "Heritage Coffee House",
    slug: "heritage-coffee-house",
    description: "Traditional roasting methods meet modern quality standards. We celebrate coffee's rich history while pushing boundaries.",
    location: {
      city: "Melbourne",
      country: "Australia"
    },
    certifications: ["fairTrade"],
    createdAt: "2015-09-20"
  },
  {
    id: "roaster-4",
    name: "Sunrise Coffee Co.",
    slug: "sunrise-coffee-co",
    description: "Bringing the best of East African coffees to your cup. Specializing in bright, fruity profiles.",
    location: {
      city: "Nairobi",
      country: "Kenya"
    },
    certifications: ["organic", "fairTrade"],
    createdAt: "2019-02-10"
  },
  {
    id: "roaster-5",
    name: "Artisan Roast Works",
    slug: "artisan-roast-works",
    description: "Small-batch roasting with a focus on experimental processing methods and unique flavor profiles.",
    location: {
      city: "Brooklyn",
      country: "USA"
    },
    certifications: ["bCorp"],
    createdAt: "2020-07-15"
  }
];

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Espresso Roast Blend",
    origin: "Colombia & Brazil",
    roastLevel: "dark",
    flavorProfile: {
      intensity: "bold",
      notes: ["chocolatey", "nutty", "caramel"],
      acidity: "low"
    },
    isOrganic: true,
    isFairTrade: true,
    description: "A rich, full-bodied espresso blend that delivers deep chocolate notes with a smooth, nutty finish. Perfect for those who love a bold cup that stands up to milk.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-1",
    roasterName: "Mountain Peak Roasters",
    slug: "espresso-roast-blend",
    variants: [
      {
        id: "var-1a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 14.99,
        available: true,
        inventoryQuantity: 50
      },
      {
        id: "var-1b",
        name: "500g Whole Bean",
        size: "500g",
        grind: "whole-bean",
        price: 26.99,
        compareAtPrice: 29.98,
        available: true,
        inventoryQuantity: 30
      },
      {
        id: "var-1c",
        name: "250g Ground (Espresso)",
        size: "250g",
        grind: "espresso",
        price: 15.99,
        available: true,
        inventoryQuantity: 25
      }
    ],
    basePrice: 14.99,
    processingMethod: "washed",
    altitude: "1600-1900m",
    harvest: "2024",
    producer: "Finca La Esperanza Cooperative",
    tastingNotes: "Opens with deep dark chocolate and roasted hazelnut aromas. The palate reveals brown sugar sweetness, toasted almond, and a hint of dried fig. Finishes long with caramel and a whisper of spice.",
    brewingTips: "Best as espresso or in milk-based drinks. For pour-over, use a 1:15 ratio with water at 200°F.",
    brewingGuide: "**Espresso:** Use 18g dose, yield 36g in 28-32 seconds. Pre-infuse for 3 seconds.\n\n**Pour Over:** 22g coffee, 330ml water at 200°F. Bloom 45 seconds, then slow spiral pours.\n\n**French Press:** 30g coarse ground, 500ml water at 205°F. Steep 4 minutes, plunge slowly.",
    images: ["/placeholder.svg"],
    rating: 4.5,
    reviewCount: 2147,
    isFeatured: true,
    isBestSeller: true,
    attributeScores: {
      body: 4,
      acidity: 2,
      sweetness: 3
    },
    createdAt: "2023-01-15",
    updatedAt: "2024-11-20"
  },
  {
    id: "prod-2",
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    roastLevel: "light",
    flavorProfile: {
      intensity: "light",
      notes: ["fruity", "floral", "caramel"],
      acidity: "high"
    },
    isOrganic: true,
    isFairTrade: true,
    description: "A bright, complex single-origin from the birthplace of coffee. Bursting with blueberry and jasmine notes, this light roast showcases the natural sweetness of Ethiopian beans.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-2",
    roasterName: "Nordic Brew Co.",
    slug: "ethiopian-yirgacheffe",
    variants: [
      {
        id: "var-2a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 18.99,
        available: true,
        inventoryQuantity: 40
      },
      {
        id: "var-2b",
        name: "250g Ground (Filter)",
        size: "250g",
        grind: "filter",
        price: 19.99,
        available: true,
        inventoryQuantity: 20
      }
    ],
    basePrice: 18.99,
    processingMethod: "natural",
    altitude: "1800-2200m",
    harvest: "2024",
    producer: "Idido Washing Station",
    tastingNotes: "Vibrant blueberry and blackcurrant burst forward, followed by delicate jasmine florals. Mid-palate reveals honey sweetness and bergamot citrus. Clean, tea-like finish.",
    brewingGuide: "**Pour Over (Recommended):** 15g coffee, 250ml water at 195°F. Long bloom (60 sec), gentle pours.\n\n**AeroPress:** 14g fine-medium, inverted method, 1:45 steep, gentle press.",
    images: ["/placeholder.svg"],
    rating: 4.8,
    reviewCount: 892,
    isFeatured: true,
    attributeScores: {
      body: 2,
      acidity: 5,
      sweetness: 4
    },
    createdAt: "2023-06-10",
    updatedAt: "2024-10-15"
  },
  {
    id: "prod-3",
    name: "House Blend Classic",
    origin: "Guatemala & Honduras",
    roastLevel: "medium",
    flavorProfile: {
      intensity: "medium",
      notes: ["nutty", "chocolatey", "caramel"],
      acidity: "medium"
    },
    isOrganic: false,
    isFairTrade: true,
    description: "Our signature everyday coffee. Perfectly balanced with approachable flavors that shine any time of day, any brewing method.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-3",
    roasterName: "Heritage Coffee House",
    slug: "house-blend-classic",
    variants: [
      {
        id: "var-3a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 12.99,
        available: true,
        inventoryQuantity: 100
      },
      {
        id: "var-3b",
        name: "1kg Whole Bean",
        size: "1kg",
        grind: "whole-bean",
        price: 42.99,
        compareAtPrice: 51.96,
        available: true,
        inventoryQuantity: 45
      }
    ],
    basePrice: 12.99,
    processingMethod: "washed",
    altitude: "1400-1700m",
    harvest: "2024",
    tastingNotes: "Toasted walnut and milk chocolate define this approachable blend. Subtle orange zest brightness balanced by brown sugar sweetness. Smooth, medium body with a clean finish.",
    brewingGuide: "**Drip Coffee:** Standard 1:16 ratio works perfectly. Medium grind.\n\n**Cold Brew:** Coarse grind, 1:8 ratio, steep 16-20 hours cold.",
    images: ["/placeholder.svg"],
    rating: 4.3,
    reviewCount: 3256,
    isBestSeller: true,
    attributeScores: {
      body: 3,
      acidity: 3,
      sweetness: 3
    },
    createdAt: "2022-08-01",
    updatedAt: "2024-11-01"
  },
  {
    id: "prod-4",
    name: "Kenya AA Nyeri",
    origin: "Kenya",
    roastLevel: "light",
    flavorProfile: {
      intensity: "medium",
      notes: ["fruity", "floral", "caramel"],
      acidity: "high"
    },
    isOrganic: true,
    isFairTrade: true,
    description: "Exceptional single-origin from the highlands of Kenya. Complex acidity with blackcurrant and grapefruit notes.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-4",
    roasterName: "Sunrise Coffee Co.",
    slug: "kenya-aa-nyeri",
    variants: [
      {
        id: "var-4a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 22.99,
        available: true,
        inventoryQuantity: 25
      },
      {
        id: "var-4b",
        name: "250g Ground (Filter)",
        size: "250g",
        grind: "filter",
        price: 23.99,
        available: true,
        inventoryQuantity: 15
      }
    ],
    basePrice: 22.99,
    processingMethod: "washed",
    altitude: "1700-1900m",
    harvest: "2024",
    producer: "Nyeri Hills Cooperative",
    tastingNotes: "Intense blackcurrant and grapefruit upfront, transitioning to brown sugar and a wine-like finish. Juicy, vibrant acidity.",
    images: ["/placeholder.svg"],
    rating: 4.7,
    reviewCount: 456,
    isFeatured: true,
    attributeScores: {
      body: 3,
      acidity: 5,
      sweetness: 4
    },
    createdAt: "2024-01-20",
    updatedAt: "2024-11-10"
  },
  {
    id: "prod-5",
    name: "Vietnamese Robusta",
    origin: "Vietnam",
    roastLevel: "dark",
    flavorProfile: {
      intensity: "bold",
      notes: ["chocolatey", "earthy", "nutty"],
      acidity: "low"
    },
    isOrganic: false,
    isFairTrade: false,
    description: "Bold and intense robusta perfect for traditional Vietnamese coffee or strong espresso blends.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-3",
    roasterName: "Heritage Coffee House",
    slug: "vietnamese-robusta",
    variants: [
      {
        id: "var-5a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 9.99,
        available: true,
        inventoryQuantity: 80
      },
      {
        id: "var-5b",
        name: "500g Ground (French Press)",
        size: "500g",
        grind: "french-press",
        price: 17.99,
        available: true,
        inventoryQuantity: 35
      }
    ],
    basePrice: 9.99,
    processingMethod: "natural",
    altitude: "800-1200m",
    harvest: "2024",
    tastingNotes: "Intense dark chocolate and toasted grain. Earthy undertones with a thick, syrupy body. Perfect for condensed milk coffee.",
    images: ["/placeholder.svg"],
    rating: 4.1,
    reviewCount: 789,
    attributeScores: {
      body: 5,
      acidity: 1,
      sweetness: 2
    },
    createdAt: "2023-03-12",
    updatedAt: "2024-09-15"
  },
  {
    id: "prod-6",
    name: "Panama Geisha Reserve",
    origin: "Panama",
    roastLevel: "light",
    flavorProfile: {
      intensity: "light",
      notes: ["floral", "fruity", "caramel"],
      acidity: "high"
    },
    isOrganic: true,
    isFairTrade: true,
    description: "The legendary Geisha variety from Panama's Boquete region. Exceptional complexity and elegance.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-5",
    roasterName: "Artisan Roast Works",
    slug: "panama-geisha-reserve",
    variants: [
      {
        id: "var-6a",
        name: "100g Whole Bean",
        size: "100g",
        grind: "whole-bean",
        price: 29.99,
        available: true,
        inventoryQuantity: 10
      }
    ],
    basePrice: 29.99,
    processingMethod: "washed",
    altitude: "1600-1800m",
    harvest: "2024",
    producer: "Hacienda La Esmeralda",
    tastingNotes: "Jasmine and bergamot aromatics. Peach and mango with honeysuckle sweetness. Silky, tea-like body with lingering floral finish.",
    images: ["/placeholder.svg"],
    rating: 4.9,
    reviewCount: 124,
    isFeatured: true,
    attributeScores: {
      body: 2,
      acidity: 4,
      sweetness: 5
    },
    createdAt: "2024-06-01",
    updatedAt: "2024-11-25"
  },
  {
    id: "prod-7",
    name: "Brazilian Santos",
    origin: "Brazil",
    roastLevel: "medium",
    flavorProfile: {
      intensity: "medium",
      notes: ["nutty", "chocolatey", "caramel"],
      acidity: "low"
    },
    isOrganic: false,
    isFairTrade: true,
    description: "Classic Brazilian coffee with smooth, low-acid profile. Perfect for everyday drinking and milk-based drinks.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-1",
    roasterName: "Mountain Peak Roasters",
    slug: "brazilian-santos",
    variants: [
      {
        id: "var-7a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 11.99,
        available: true,
        inventoryQuantity: 120
      },
      {
        id: "var-7b",
        name: "500g Whole Bean",
        size: "500g",
        grind: "whole-bean",
        price: 21.99,
        available: true,
        inventoryQuantity: 60
      },
      {
        id: "var-7c",
        name: "250g Ground (Espresso)",
        size: "250g",
        grind: "espresso",
        price: 12.99,
        available: true,
        inventoryQuantity: 40
      }
    ],
    basePrice: 11.99,
    processingMethod: "natural",
    altitude: "1000-1400m",
    harvest: "2024",
    tastingNotes: "Milk chocolate and roasted peanut with subtle dried fruit. Smooth, velvety body with a sweet caramel finish.",
    images: ["/placeholder.svg"],
    rating: 4.2,
    reviewCount: 1892,
    isBestSeller: true,
    attributeScores: {
      body: 4,
      acidity: 2,
      sweetness: 3
    },
    createdAt: "2022-05-10",
    updatedAt: "2024-10-20"
  },
  {
    id: "prod-8",
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    roastLevel: "dark",
    flavorProfile: {
      intensity: "bold",
      notes: ["earthy", "spicy", "chocolatey"],
      acidity: "low"
    },
    isOrganic: true,
    isFairTrade: false,
    description: "Full-bodied Indonesian coffee with distinctive earthy, herbal notes and low acidity.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-3",
    roasterName: "Heritage Coffee House",
    slug: "sumatra-mandheling",
    variants: [
      {
        id: "var-8a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 16.99,
        available: true,
        inventoryQuantity: 35
      },
      {
        id: "var-8b",
        name: "250g Ground (French Press)",
        size: "250g",
        grind: "french-press",
        price: 17.99,
        available: true,
        inventoryQuantity: 20
      }
    ],
    basePrice: 16.99,
    processingMethod: "washed",
    altitude: "1200-1500m",
    harvest: "2024",
    producer: "Gayo Highlands Cooperative",
    tastingNotes: "Cedar and tobacco leaf aromatics. Dark chocolate, black pepper, and dried herbs. Thick, syrupy body with long, smoky finish.",
    images: ["/placeholder.svg"],
    rating: 4.4,
    reviewCount: 567,
    attributeScores: {
      body: 5,
      acidity: 1,
      sweetness: 2
    },
    createdAt: "2023-08-20",
    updatedAt: "2024-11-05"
  },
  {
    id: "prod-9",
    name: "Costa Rica Tarrazú",
    origin: "Costa Rica",
    roastLevel: "medium",
    flavorProfile: {
      intensity: "medium",
      notes: ["fruity", "caramel", "chocolatey"],
      acidity: "medium"
    },
    isOrganic: true,
    isFairTrade: true,
    description: "Bright and clean Costa Rican coffee from the famous Tarrazú region. Well-balanced with citrus notes.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-2",
    roasterName: "Nordic Brew Co.",
    slug: "costa-rica-tarrazu",
    variants: [
      {
        id: "var-9a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 17.99,
        available: true,
        inventoryQuantity: 45
      },
      {
        id: "var-9b",
        name: "250g Ground (Filter)",
        size: "250g",
        grind: "filter",
        price: 18.99,
        available: true,
        inventoryQuantity: 25
      }
    ],
    basePrice: 17.99,
    processingMethod: "honey",
    altitude: "1500-1800m",
    harvest: "2024",
    producer: "Finca Santa Elena",
    tastingNotes: "Orange zest and red apple brightness. Honey and brown sugar sweetness with milk chocolate undertones. Clean, lingering finish.",
    images: ["/placeholder.svg"],
    rating: 4.6,
    reviewCount: 678,
    isFeatured: true,
    attributeScores: {
      body: 3,
      acidity: 4,
      sweetness: 4
    },
    createdAt: "2023-11-15",
    updatedAt: "2024-10-30"
  },
  {
    id: "prod-10",
    name: "Decaf Colombian",
    origin: "Colombia",
    roastLevel: "medium",
    flavorProfile: {
      intensity: "medium",
      notes: ["chocolatey", "nutty", "caramel"],
      acidity: "low"
    },
    isOrganic: true,
    isFairTrade: true,
    description: "Swiss Water Process decaf that retains all the flavor of our Colombian beans without the caffeine.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-1",
    roasterName: "Mountain Peak Roasters",
    slug: "decaf-colombian",
    variants: [
      {
        id: "var-10a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 15.99,
        available: true,
        inventoryQuantity: 30
      },
      {
        id: "var-10b",
        name: "250g Ground (Espresso)",
        size: "250g",
        grind: "espresso",
        price: 16.99,
        available: true,
        inventoryQuantity: 20
      }
    ],
    basePrice: 15.99,
    processingMethod: "washed",
    altitude: "1600-1800m",
    harvest: "2024",
    tastingNotes: "Smooth milk chocolate and toasted almond. Subtle sweetness with a clean, mellow finish. All the flavor, none of the jitters.",
    images: ["/placeholder.svg"],
    rating: 4.3,
    reviewCount: 423,
    attributeScores: {
      body: 3,
      acidity: 2,
      sweetness: 3
    },
    createdAt: "2023-04-05",
    updatedAt: "2024-11-12"
  },
  {
    id: "prod-11",
    name: "Rwanda Musasa",
    origin: "Rwanda",
    roastLevel: "light",
    flavorProfile: {
      intensity: "medium",
      notes: ["fruity", "floral", "caramel"],
      acidity: "high"
    },
    isOrganic: false,
    isFairTrade: true,
    description: "Exceptional Rwandan coffee with complex red fruit notes and tea-like elegance.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-4",
    roasterName: "Sunrise Coffee Co.",
    slug: "rwanda-musasa",
    variants: [
      {
        id: "var-11a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 19.99,
        available: true,
        inventoryQuantity: 20
      }
    ],
    basePrice: 19.99,
    processingMethod: "washed",
    altitude: "1800-2100m",
    harvest: "2024",
    producer: "Musasa Washing Station",
    tastingNotes: "Cranberry and pomegranate with rose petal aromatics. Honey sweetness and a silky, tea-like body. Elegant, refined finish.",
    images: ["/placeholder.svg"],
    rating: 4.7,
    reviewCount: 234,
    isFeatured: true,
    attributeScores: {
      body: 2,
      acidity: 5,
      sweetness: 4
    },
    createdAt: "2024-02-28",
    updatedAt: "2024-11-18"
  },
  {
    id: "prod-12",
    name: "Mexican Chiapas",
    origin: "Mexico",
    roastLevel: "medium",
    flavorProfile: {
      intensity: "medium",
      notes: ["chocolatey", "nutty", "spicy"],
      acidity: "medium"
    },
    isOrganic: true,
    isFairTrade: true,
    description: "Smooth and balanced Mexican coffee with mild spice notes and chocolate undertones.",
    imageUrl: "/placeholder.svg",
    roasterId: "roaster-5",
    roasterName: "Artisan Roast Works",
    slug: "mexican-chiapas",
    variants: [
      {
        id: "var-12a",
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean",
        price: 14.99,
        available: true,
        inventoryQuantity: 55
      },
      {
        id: "var-12b",
        name: "500g Whole Bean",
        size: "500g",
        grind: "whole-bean",
        price: 27.99,
        available: true,
        inventoryQuantity: 30
      }
    ],
    basePrice: 14.99,
    processingMethod: "washed",
    altitude: "1200-1500m",
    harvest: "2024",
    producer: "Cooperativa Maya Vinic",
    tastingNotes: "Milk chocolate and hazelnut with hints of cinnamon. Medium body with balanced acidity and a sweet, clean finish.",
    images: ["/placeholder.svg"],
    rating: 4.4,
    reviewCount: 345,
    attributeScores: {
      body: 3,
      acidity: 3,
      sweetness: 3
    },
    createdAt: "2023-09-10",
    updatedAt: "2024-10-25"
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};

export const getRoasterById = (id: string): Roaster | undefined => {
  return mockRoasters.find(r => r.id === id);
};

export const getRoasterByProductId = (productId: string): Roaster | undefined => {
  const product = getProductById(productId);
  if (!product) return undefined;
  return getRoasterById(product.roasterId);
};
