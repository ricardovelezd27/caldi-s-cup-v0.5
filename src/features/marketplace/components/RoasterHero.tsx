import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Roaster } from "@/types/coffee";

interface RoasterHeroProps {
  roaster: Roaster;
  productCount: number;
}

const certificationLabels: Record<string, string> = {
  organic: "Organic",
  fairTrade: "Fair Trade",
  rainforestAlliance: "Rainforest Alliance",
  bCorp: "B Corp",
};

export const RoasterHero = ({ roaster, productCount }: RoasterHeroProps) => {
  const establishedYear = new Date(roaster.createdAt).getFullYear();

  return (
    <div className="border-4 border-border rounded-lg shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card overflow-hidden">
      {/* Banner */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-secondary/30 to-primary/30 relative">
        {roaster.bannerUrl && roaster.bannerUrl !== "/placeholder.svg" && (
          <img
            src={roaster.bannerUrl}
            alt={`${roaster.name} banner`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 -mt-12 sm:-mt-16 relative">
        {/* Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-4 border-border bg-card shadow-[4px_4px_0px_0px_hsl(var(--border))] flex items-center justify-center mb-4">
          {roaster.logoUrl && roaster.logoUrl !== "/placeholder.svg" ? (
            <img
              src={roaster.logoUrl}
              alt={`${roaster.name} logo`}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="font-bangers text-3xl sm:text-4xl text-muted-foreground">
              {roaster.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Info */}
        <h1 className="font-bangers text-3xl sm:text-4xl text-foreground tracking-wide mb-2">
          {roaster.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {roaster.location.city}, {roaster.location.country}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Est. {establishedYear}
          </span>
          <span className="text-secondary font-medium">
            {productCount} {productCount === 1 ? "Product" : "Products"}
          </span>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-4 max-w-2xl">
          {roaster.description}
        </p>

        {/* Certifications */}
        {roaster.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {roaster.certifications.map((cert) => (
              <Badge key={cert} variant="outline" className="text-sm">
                {certificationLabels[cert] || cert}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
