import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer
} from "recharts";
import type { FlavorNote } from "@/types/coffee";

interface FlavorRadarChartProps {
  notes: FlavorNote[];
  className?: string;
}

// Map flavor notes to display values (mock intensity for visualization)
const flavorIntensities: Record<FlavorNote, number> = {
  fruity: 80,
  nutty: 75,
  chocolatey: 85,
  earthy: 60,
  floral: 70,
  spicy: 65,
  caramel: 80
};

const flavorLabels: Record<FlavorNote, string> = {
  fruity: "Fruity",
  nutty: "Nutty",
  chocolatey: "Chocolate",
  earthy: "Earthy",
  floral: "Floral",
  spicy: "Spicy",
  caramel: "Caramel"
};

export const FlavorRadarChart = ({ notes, className = "" }: FlavorRadarChartProps) => {
  // Build data for radar chart from provided notes
  const data = notes.map(note => ({
    flavor: flavorLabels[note] || note,
    value: flavorIntensities[note] || 50,
    fullMark: 100
  }));

  // Ensure we have at least 3 points for a proper polygon
  if (data.length < 3) {
    return (
      <div className={`flex items-center justify-center h-48 ${className}`}>
        <p className="text-sm text-muted-foreground">Not enough flavor data</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <h3 className="font-bangers text-lg text-foreground mb-2 tracking-wide">
        Flavor Profile
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.5}
          />
          <PolarAngleAxis 
            dataKey="flavor" 
            tick={{ 
              fill: "hsl(var(--foreground))", 
              fontSize: 11,
              fontWeight: 500
            }}
          />
          <Radar
            name="Flavor"
            dataKey="value"
            stroke="hsl(var(--secondary))"
            fill="hsl(var(--secondary))"
            fillOpacity={0.4}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
