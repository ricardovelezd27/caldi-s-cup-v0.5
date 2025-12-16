import { Badge } from "@/components/ui/badge";
import type { Roaster } from "@/types/coffee";

interface RoasterAboutProps {
  roaster: Roaster;
}

const certificationLabels: Record<string, string> = {
  organic: "Organic",
  fairTrade: "Fair Trade",
  rainforestAlliance: "Rainforest Alliance",
  bCorp: "B Corp",
};

export const RoasterAbout = ({ roaster }: RoasterAboutProps) => {
  const establishedYear = new Date(roaster.createdAt).getFullYear();

  return (
    <div className="border-4 border-border rounded-lg p-4 sm:p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
      <h2 className="font-bangers text-2xl text-foreground tracking-wide mb-4">
        Our Story
      </h2>

      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {roaster.story ? (
          <p>{roaster.story}</p>
        ) : (
          <p>{roaster.description}</p>
        )}

        <p>
          Founded in {establishedYear} in {roaster.location.city},{" "}
          {roaster.location.country}, we continue to bring exceptional coffee
          experiences to our customers.
        </p>
      </div>

      {/* Certifications */}
      {roaster.certifications.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-bangers text-lg text-foreground tracking-wide mb-3">
            Certifications & Values
          </h3>
          <div className="flex flex-wrap gap-2">
            {roaster.certifications.map((cert) => (
              <Badge key={cert} variant="secondary" className="text-sm">
                {certificationLabels[cert] || cert}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
