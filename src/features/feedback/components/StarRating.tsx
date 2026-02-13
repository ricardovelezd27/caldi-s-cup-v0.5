import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate: (value: number) => void;
}

export const StarRating = ({ rating, onRate }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onRate(rating === value ? 0 : value)}
          className="p-1 transition-transform hover:scale-110 focus:outline-none"
          aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              value <= rating
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
};
