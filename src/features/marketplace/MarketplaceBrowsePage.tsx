import { useState, useMemo, useEffect } from "react";
import { Filter } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Container, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { mockProducts } from "./data/mockProducts";
import { ProductFilters, DEFAULT_FILTERS, SortOption } from "./types/api";
import {
  filterProducts,
  sortProducts,
  paginateProducts,
  getUniqueOrigins,
  getUniqueGrinds,
  getPriceRange,
} from "./utils/productFilters";
import { FilterPanel } from "./components/FilterPanel";
import { SortDropdown } from "./components/SortDropdown";
import { ProductGrid } from "./components/ProductGrid";
import { MarketplacePagination } from "./components/MarketplacePagination";

const PAGE_SIZE = 6;

/**
 * Marketplace Browse Page
 * Features: filtering, search, sorting, pagination with mock data
 */
export default function MarketplaceBrowsePage() {
  // Filter and sort state
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("best-match");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce search input
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  // Compute available filter options from all products
  const availableOrigins = useMemo(
    () => getUniqueOrigins(mockProducts),
    []
  );
  const availableGrinds = useMemo(
    () => getUniqueGrinds(mockProducts),
    []
  );
  const priceRange = useMemo(() => getPriceRange(mockProducts), []);

  // Initialize price range in filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: priceRange,
    }));
  }, [priceRange]);

  // Apply filters, sort, and pagination
  const { displayedProducts, totalPages, totalItems } = useMemo(() => {
    // Create filters with debounced search
    const filtersWithDebouncedSearch = {
      ...filters,
      search: debouncedSearch,
    };

    // Filter products
    const filtered = filterProducts(mockProducts, filtersWithDebouncedSearch);

    // Sort products
    const sorted = sortProducts(filtered, sortBy);

    // Paginate
    const { items, totalPages, totalItems } = paginateProducts(
      sorted,
      currentPage,
      PAGE_SIZE
    );

    return { displayedProducts: items, totalPages, totalItems };
  }, [filters, debouncedSearch, sortBy, currentPage]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.origins, filters.roastLevels, filters.grinds, filters.priceRange, debouncedSearch, sortBy]);

  // Simulate loading state for UX feedback
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [currentPage, debouncedSearch, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setMobileFiltersOpen(false); // Close mobile sheet on filter change
  };

  // Count active filters for badge
  const activeFilterCount =
    filters.origins.length +
    filters.roastLevels.length +
    filters.grinds.length +
    (filters.search ? 1 : 0) +
    (filters.priceRange[0] > priceRange[0] ||
    filters.priceRange[1] < priceRange[1]
      ? 1
      : 0);

  return (
    <PageLayout>
      <Container className="py-8">
        {/* Page Header */}
        <div className="mb-8">
          <SectionHeading 
            title="Browse Coffees" 
            subtitle="Discover exceptional coffees from artisan roasters around the world"
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Panel (Sidebar) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 border-4 border-border rounded-lg p-4 bg-card shadow-[4px_4px_0px_0px_hsl(var(--border))]">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                availableOrigins={availableOrigins}
                availableGrinds={availableGrinds}
                priceRange={priceRange}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Toolbar: Mobile Filter + Sort */}
            <div className="flex items-center justify-between gap-4 mb-6">
              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden gap-2 border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 border-r-4 border-border overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="font-heading text-2xl">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      availableOrigins={availableOrigins}
                      availableGrinds={availableGrinds}
                      priceRange={priceRange}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Spacer for desktop */}
              <div className="hidden lg:block" />

              {/* Sort Dropdown */}
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={displayedProducts}
              isLoading={isLoading}
              totalCount={totalItems}
            />

            {/* Pagination */}
            <MarketplacePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </Container>
    </PageLayout>
  );
}
