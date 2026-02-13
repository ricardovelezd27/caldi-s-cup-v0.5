import { Link } from "react-router-dom";
import { APP_CONFIG, ROUTES } from "@/constants/app";
import { FeedbackTrigger } from "@/features/feedback";

export const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-8 border-t-4 border-border mt-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground font-inter">
          © {APP_CONFIG.year} {APP_CONFIG.name}. Brewed with love.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.contactFeedback}
            className="text-muted-foreground hover:text-primary font-inter transition-colors"
          >
            Who we are
          </Link>
          <FeedbackTrigger>
            {(open) => (
              <button
                onClick={open}
                className="text-muted-foreground hover:text-primary font-inter transition-colors"
              >
                Give Feedback
              </button>
            )}
          </FeedbackTrigger>
        </div>
      </div>
    </footer>
  );
};
