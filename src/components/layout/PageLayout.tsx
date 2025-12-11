import { Header } from "./Header";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const PageLayout = ({
  children,
  showHeader = true,
  showFooter = true,
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
