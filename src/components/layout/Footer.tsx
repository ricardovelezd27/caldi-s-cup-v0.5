import { APP_CONFIG } from "@/constants/app";

export const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-8 border-t-4 border-border mt-16">
      <div className="text-center">
        <p className="text-muted-foreground font-inter">
          © {APP_CONFIG.year} {APP_CONFIG.name}. Brewed with love.
        </p>
      </div>
    </footer>
  );
};
