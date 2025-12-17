import type { Database } from "@/integrations/supabase/types";

export type CoffeeTribe = Database["public"]["Enums"]["coffee_tribe"];

export interface ScannedCoffee {
  id: string;
  imageUrl: string;
  coffeeName: string | null;
  brand: string | null;
  origin: string | null;
  roastLevel: string | null;
  processingMethod: string | null;
  variety: string | null;
  altitude: string | null;
  acidityScore: number | null;
  bodyScore: number | null;
  sweetnessScore: number | null;
  flavorNotes: string[];
  brandStory: string | null;
  awards: string[];
  cuppingScore: number | null;
  aiConfidence: number;
  tribeMatchScore: number;
  matchReasons: string[];
  jargonExplanations: Record<string, string>;
  scannedAt: string;
}

export interface ScanRequest {
  imageBase64: string;
  userTribe: CoffeeTribe | null;
}

export interface ScanResponse {
  success: boolean;
  data?: ScannedCoffee;
  error?: string;
}

export type ScanStatus = 
  | "idle" 
  | "uploading" 
  | "analyzing" 
  | "enriching" 
  | "complete" 
  | "error";

export interface ScanProgress {
  status: ScanStatus;
  message: string;
  progress: number; // 0-100
}

export const SCAN_PROGRESS_STATES: Record<ScanStatus, ScanProgress> = {
  idle: { status: "idle", message: "Ready to scan", progress: 0 },
  uploading: { status: "uploading", message: "Uploading image...", progress: 20 },
  analyzing: { status: "analyzing", message: "AI is reading your coffee bag...", progress: 50 },
  enriching: { status: "enriching", message: "Searching for additional insights...", progress: 80 },
  complete: { status: "complete", message: "Scan complete!", progress: 100 },
  error: { status: "error", message: "Something went wrong", progress: 0 },
};
