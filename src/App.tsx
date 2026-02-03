import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { CartProvider } from "@/contexts/cart";
import { ErrorBoundary, OfflineIndicator } from "@/components/error";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { ProductPage, MarketplaceBrowsePage, RoasterStorefrontPage } from "./features/marketplace";
import { CartPage } from "./features/cart";
import { QuizPage, ResultsPage } from "./features/quiz";
import { DashboardPage } from "./features/dashboard";
import { ScannerPage } from "./features/scanner";
import { RecipesPage, CreateRecipePage, RecipeViewPage, EditRecipePage } from "./features/recipes";
import { CoffeeProfilePage } from "./features/coffee";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <OfflineIndicator />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/marketplace" element={<MarketplaceBrowsePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/roaster/:id" element={<RoasterStorefrontPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/recipes/new" element={<CreateRecipePage />} />
                <Route path="/recipes/:id" element={<RecipeViewPage />} />
                <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
                <Route path="/coffee/:id" element={<CoffeeProfilePage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
