export type IntensityLevel = 'light' | 'medium' | 'bold';
export type AcidityLevel = 'low' | 'medium' | 'high';
export type RoastLevel = 'light' | 'medium' | 'dark';
export type FlavorNote = 'fruity' | 'nutty' | 'chocolatey' | 'earthy' | 'floral' | 'spicy' | 'caramel';

export interface FlavorProfile {
  intensity: IntensityLevel;
  notes: FlavorNote[];
  acidity: AcidityLevel;
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
  brewingMethod: string;
  ethicalPreferences: ('organic' | 'fairTrade')[];
}
