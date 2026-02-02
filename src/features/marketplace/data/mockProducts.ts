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
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((p) => p.id === id);
};

export const getRoasterById = (id: string): Roaster | undefined => {
  return mockRoasters.find((r) => r.id === id);
};

export const getProductsByRoasterId = (roasterId: string): Product[] => {
  return mockProducts.filter((p) => p.roasterId === roasterId);
};
