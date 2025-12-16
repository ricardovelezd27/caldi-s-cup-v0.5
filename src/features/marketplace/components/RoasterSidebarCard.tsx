import { Mail, Globe, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Roaster } from "@/types/coffee";

interface RoasterSidebarCardProps {
  roaster: Roaster;
}

export const RoasterSidebarCard = ({ roaster }: RoasterSidebarCardProps) => {
  const hasLinks = roaster.website || roaster.contactEmail || roaster.socialLinks;

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
      <h3 className="font-bangers text-lg text-foreground tracking-wide mb-3">
        Quick Links
      </h3>

      <div className="space-y-3">
        {/* Website */}
        {roaster.website && (
          <a
            href={roaster.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Visit Website</span>
          </a>
        )}

        {/* Email */}
        {roaster.contactEmail && (
          <a
            href={`mailto:${roaster.contactEmail}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </a>
        )}
      </div>

      {/* Social Links */}
      {roaster.socialLinks && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Follow</p>
          <div className="flex gap-2">
            {roaster.socialLinks.instagram && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-2 h-8 w-8 p-0"
              >
                <a
                  href={roaster.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
            )}
            {roaster.socialLinks.twitter && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-2 h-8 w-8 p-0"
              >
                <a
                  href={roaster.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
            )}
            {roaster.socialLinks.facebook && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-2 h-8 w-8 p-0"
              >
                <a
                  href={roaster.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      )}

      {!hasLinks && (
        <p className="text-sm text-muted-foreground">
          More information coming soon.
        </p>
      )}
    </div>
  );
};
