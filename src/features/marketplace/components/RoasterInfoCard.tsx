import { Link } from "react-router-dom";
import { MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Roaster } from "@/types/coffee";

interface RoasterInfoCardProps {
  roaster: Roaster;
}

const certificationLabels: Record<string, string> = {
  organic: "Organic",
  fairTrade: "Fair Trade",
  rainforestAlliance: "Rainforest Alliance",
  bCorp: "B Corp"
};

export const RoasterInfoCard = ({ roaster }: RoasterInfoCardProps) => {
  const establishedYear = new Date(roaster.createdAt).getFullYear();

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
      <div className="flex items-start gap-4">
        {/* Logo placeholder */}
        <div className="w-16 h-16 rounded-lg border-2 border-border bg-muted flex items-center justify-center flex-shrink-0">
          {roaster.logoUrl && roaster.logoUrl !== "/placeholder.svg" ? (
            <img 
              src={roaster.logoUrl} 
              alt={`${roaster.name} logo`}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="font-bangers text-2xl text-muted-foreground">
              {roaster.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Roaster info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bangers text-xl text-foreground tracking-wide truncate">
            {roaster.name}
          </h3>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" />
            <span>{roaster.location.city}, {roaster.location.country}</span>
            <span className="mx-1">•</span>
            <span>Est. {establishedYear}</span>
          </div>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {roaster.description}
          </p>

          {/* Certifications */}
          {roaster.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {roaster.certifications.map(cert => (
                <Badge 
                  key={cert} 
                  variant="outline" 
                  className="text-xs"
                >
                  {certificationLabels[cert] || cert}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Roaster Link */}
      <Link
        to={`/roaster/${roaster.id}`}
        className="flex items-center justify-center gap-2 mt-4 py-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors border-t border-border pt-4"
      >
        View All Products
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  );
};
