// ============= Flavor & Preference Types =============

export type IntensityLevel = 'light' | 'medium' | 'bold';
export type AcidityLevel = 'low' | 'medium' | 'high';
export type RoastLevel = 'light' | 'medium' | 'dark';
export type FlavorNote = 'fruity' | 'nutty' | 'chocolatey' | 'earthy' | 'floral' | 'spicy' | 'caramel';
export type BrewingMethod = 'espresso' | 'pour-over' | 'french-press' | 'aeropress' | 'cold-brew' | 'drip' | 'moka-pot';
export type ProcessingMethod = 'washed' | 'natural' | 'honey' | 'anaerobic';

export interface FlavorProfile {
  intensity: IntensityLevel;
  notes: FlavorNote[];
  acidity: AcidityLevel;
}

// Flavor attribute scores for visual display (1-5 scale)
export interface FlavorAttributeScores {
  body: number;      // 1 = Light, 5 = Full
  acidity: number;   // 1 = Subtle, 5 = Bright
  sweetness: number; // 1 = Dry, 5 = Sweet
}

export interface CoffeeBean {
  id: string;
  name: string;
  origin: string;
  roastLevel: RoastLevel;
  flavorProfile: FlavorProfile;
  isOrganic: boolean;
  isFairTrade: boolean;
  description?: string;
  imageUrl?: string;
}

export interface UserTasteProfile {
  preferredIntensity: IntensityLevel;
  preferredNotes: FlavorNote[];
  preferredAcidity: AcidityLevel;
  brewingMethod: BrewingMethod;
  ethicalPreferences: ('organic' | 'fairTrade' | 'singleOrigin')[];
}

// ============= Marketplace Types =============

export interface Roaster {
  id: string;
  name: string;
  slug: string;
  description: string;
  story?: string;
  logoUrl?: string;
  bannerUrl?: string;
  location: {
    city: string;
    country: string;
  };
  contactEmail?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  certifications: ('organic' | 'fairTrade' | 'rainforestAlliance' | 'bCorp')[];
  featuredProductIds?: string[];
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "250g Whole Bean", "500g Ground"
  size: string; // e.g., "250g", "500g", "1kg"
  grind: 'whole-bean' | 'espresso' | 'filter' | 'french-press' | 'turkish';
  price: number;
  compareAtPrice?: number; // For showing discounts
  available: boolean;
  inventoryQuantity: number;
}

export interface Product extends CoffeeBean {
  roasterId: string;
  roasterName: string;
  slug: string;
  variants: ProductVariant[];
  basePrice: number; // Lowest variant price for display
  processingMethod?: ProcessingMethod;
  altitude?: string; // e.g., "1800-2200m"
  harvest?: string; // e.g., "2024"
  producer?: string; // Farm or cooperative name
  tastingNotes?: string; // Detailed tasting description
  brewingTips?: string;
  brewingGuide?: string; // Detailed brewing instructions
  images: string[];
  rating?: number; // 0-5
  reviewCount?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  attributeScores?: FlavorAttributeScores; // Visual attribute display
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  /** External cart line ID - populated when synced with backend (Shopify, Supabase, etc.) */
  lineId?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// ============= Quiz & Results Types =============

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  imageUrl?: string;
  value: string;
}

export interface QuizResponse {
  questionId: string;
  selectedValues: string[];
}

export interface TasteProfileResult {
  profile: UserTasteProfile;
  primaryFlavor: FlavorNote;
  secondaryFlavors: FlavorNote[];
  recommendedProducts?: Product[];
  profileName: string; // e.g., "The Explorer", "The Classic"
  profileDescription: string;
}
