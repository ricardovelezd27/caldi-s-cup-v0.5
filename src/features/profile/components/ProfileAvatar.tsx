import { cn } from "@/lib/utils";
import caldiPlaceholder from "@/assets/characters/caldi-profile-placeholder.png";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  displayName?: string | null;
  email?: string;
  className?: string;
  variant?: "square" | "circle";
  onClick?: () => void;
}

export function ProfileAvatar({ avatarUrl, displayName, className, variant = "square", onClick }: ProfileAvatarProps) {
  const isCircle = variant === "circle";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        onClick && "cursor-pointer",
        isCircle
          ? "rounded-full border-[4px] border-background"
          : "w-full aspect-square rounded-md border-[4px] border-border",
        className
      )}
      style={isCircle ? undefined : { boxShadow: "4px 4px 0px 0px hsl(var(--border))" }}
      onClick={onClick}
    >
      <img
        src={avatarUrl || caldiPlaceholder}
        alt={displayName || "User avatar"}
        className={cn(
          "w-full h-full",
          isCircle
            ? (avatarUrl ? "object-cover rounded-full" : "object-contain p-2")
            : "object-contain p-2"
        )}
      />
    </div>
  );
}
