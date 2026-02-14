import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  displayName?: string | null;
  email?: string;
  className?: string;
}

export function ProfileAvatar({ avatarUrl, displayName, email, className }: ProfileAvatarProps) {
  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : email?.slice(0, 2).toUpperCase() || "U";

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-md border-[4px] border-border",
        className
      )}
      style={{ boxShadow: "4px 4px 0px 0px hsl(var(--border))" }}
    >
      <Avatar className="h-full w-full rounded-none">
        <AvatarImage
          src={avatarUrl || undefined}
          alt={displayName || "User avatar"}
          className="object-cover"
        />
        <AvatarFallback className="rounded-none bg-primary text-primary-foreground text-6xl font-bold font-[Bangers]">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
