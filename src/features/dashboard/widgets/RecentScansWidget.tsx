import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ScanLine } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { WidgetComponentProps } from "./types";

export function RecentScansWidget({ widget }: WidgetComponentProps) {
  const { user } = useAuth();

  const { data: recentScans = [] } = useQuery({
    queryKey: ["recent-scans", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("scanned_coffees")
        .select("id, coffee_name, brand, image_url, scanned_at")
        .eq("user_id", user.id)
        .order("scanned_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <History className="h-5 w-5 text-secondary" />
          Recent Scans
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentScans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ScanLine className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-3">No scans yet</p>
            <Button asChild size="sm">
              <Link to="/scanner">
                <ScanLine className="h-4 w-4 mr-2" />
                Start Scanning
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div 
                key={scan.id}
                className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/30"
              >
                {scan.image_url && (
                  <div className="w-12 h-12 rounded border-2 border-border overflow-hidden shrink-0">
                    <img 
                      src={scan.image_url} 
                      alt={scan.coffee_name || "Coffee"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">
                    {scan.coffee_name || "Unknown Coffee"}
                  </p>
                  {scan.brand && (
                    <p className="text-xs text-muted-foreground truncate">
                      {scan.brand}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {scan.scanned_at 
                    ? format(new Date(scan.scanned_at), "MMM d")
                    : "—"}
                </span>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/scanner">Scan more →</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
