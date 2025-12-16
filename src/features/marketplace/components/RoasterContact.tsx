import { Mail, Globe, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Roaster } from "@/types/coffee";

interface RoasterContactProps {
  roaster: Roaster;
}

export const RoasterContact = ({ roaster }: RoasterContactProps) => {
  const hasContactInfo = roaster.contactEmail || roaster.website || roaster.socialLinks;

  if (!hasContactInfo) {
    return (
      <div className="border-4 border-border rounded-lg p-4 sm:p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
        <h2 className="font-bangers text-2xl text-foreground tracking-wide mb-4">
          Contact
        </h2>
        <p className="text-muted-foreground">
          Contact information coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="border-4 border-border rounded-lg p-4 sm:p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
      <h2 className="font-bangers text-2xl text-foreground tracking-wide mb-4">
        Get in Touch
      </h2>

      <div className="space-y-4">
        {/* Email */}
        {roaster.contactEmail && (
          <a
            href={`mailto:${roaster.contactEmail}`}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="w-5 h-5 text-secondary" />
            <span>{roaster.contactEmail}</span>
          </a>
        )}

        {/* Website */}
        {roaster.website && (
          <a
            href={roaster.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="w-5 h-5 text-secondary" />
            <span>Visit Website</span>
          </a>
        )}
      </div>

      {/* Social Links */}
      {roaster.socialLinks && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-bangers text-lg text-foreground tracking-wide mb-3">
            Follow Us
          </h3>
          <div className="flex gap-3">
            {roaster.socialLinks.instagram && (
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-2"
              >
                <a
                  href={roaster.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
            )}
            {roaster.socialLinks.twitter && (
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-2"
              >
                <a
                  href={roaster.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </Button>
            )}
            {roaster.socialLinks.facebook && (
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-2"
              >
                <a
                  href={roaster.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
