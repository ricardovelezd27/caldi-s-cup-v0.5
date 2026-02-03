import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coffee, Clock } from "lucide-react";
import { format } from "date-fns";
import { useDashboardData } from "../hooks/useDashboardData";
import type { WidgetComponentProps } from "./types";

export function RecentBrewsWidget({ widget }: WidgetComponentProps) {
  const { recentBrews } = useDashboardData();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Brews
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentBrews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Coffee className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No brews logged yet</p>
            <p className="text-sm text-muted-foreground/70">Start brewing to track your progress!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coffee</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBrews.slice(0, 5).map((brew) => (
                  <TableRow key={brew.id}>
                    <TableCell className="font-medium truncate max-w-[120px]">
                      {brew.coffee_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {brew.brew_method}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {brew.brewed_at 
                        ? format(new Date(brew.brewed_at), "MMM d")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
