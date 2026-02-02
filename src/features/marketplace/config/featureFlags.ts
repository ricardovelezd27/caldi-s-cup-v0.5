/**
 * Feature flags for controlling marketplace data source
 * 
 * When USE_DATABASE_COFFEES is true:
 * - Marketplace fetches from `coffees` table (is_verified = true)
 * - Product pages query database
 * - Roaster pages query database
 * 
 * When false (default for now):
 * - Uses mock data from mockProducts.ts
 * - Allows development without requiring database setup
 */

export const MARKETPLACE_FLAGS = {
  /**
   * Use database coffees instead of mock data
   * Set to true when you have verified coffees in the database
   */
  USE_DATABASE_COFFEES: false,

  /**
   * Show "Coming from database" indicator in dev
   */
  SHOW_DATA_SOURCE_INDICATOR: import.meta.env.DEV,
} as const;

/**
 * Check if marketplace should use database
 */
export function usesDatabaseCoffees(): boolean {
  return MARKETPLACE_FLAGS.USE_DATABASE_COFFEES;
}
