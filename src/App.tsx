import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { LanguageProvider } from "@/contexts/language";
import { ErrorBoundary, OfflineIndicator } from "@/components/error";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { QuizPage, ResultsPage } from "./features/quiz";
import { DashboardPage } from "./features/dashboard";
import { ScannerPage } from "./features/scanner";
import { CoffeeProfilePage } from "./features/coffee";
import { FeedbackPage } from "./features/feedback";
import { ProfilePage } from "./features/profile";
import BlogPage from "./features/blog/BlogPage";
import { lazy, Suspense } from "react";
import { RequireAuth } from "./components/auth";

const LearnPage = lazy(() => import("./features/learning/pages/LearnPage"));
const TrackPage = lazy(() => import("./features/learning/pages/TrackPage"));
const LessonPage = lazy(() => import("./features/learning/pages/LessonPage"));
const LeaderboardPage = lazy(() => import("./features/learning/pages/LeaderboardPage"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
              <OfflineIndicator />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/coffee/:id" element={<CoffeeProfilePage />} />
                <Route path="/contact_feedback" element={<FeedbackPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/brew-log" element={<BlogPage />} />
                <Route path="/learn" element={<Suspense fallback={null}><LearnPage /></Suspense>} />
                <Route path="/learn/:trackId" element={<Suspense fallback={null}><TrackPage /></Suspense>} />
                <Route path="/learn/:trackId/:lessonId" element={<Suspense fallback={null}><LessonPage /></Suspense>} />
                <Route path="/leaderboard" element={<Suspense fallback={null}><RequireAuth><LeaderboardPage /></RequireAuth></Suspense>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ErrorBoundary>
);

export default App;
