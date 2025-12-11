import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  heroHasLogo?: boolean;
}

export const PageLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  heroHasLogo = false,
}: PageLayoutProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!heroHasLogo) return;

    const handleScroll = () => {
      // Show header logo after scrolling past hero section (roughly 60vh)
      const scrollThreshold = window.innerHeight * 0.5;
      setHasScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroHasLogo]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && <Header showLogo={heroHasLogo ? hasScrolled : true} />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
