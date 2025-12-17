import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coffee, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BrewLog } from "../types/dashboard";
import { format } from "date-fns";

interface RecentBrewsCardProps {
  brews: BrewLog[];
  onAddBrew?: () => void;
}

export function RecentBrewsCard({ brews, onAddBrew }: RecentBrewsCardProps) {
  const hasBrews = brews.length > 0;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide">Recent Brews</CardTitle>
        {onAddBrew && (
          <Button variant="outline" size="sm" onClick={onAddBrew}>
            <Plus className="h-4 w-4 mr-1" />
            Log Brew
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {hasBrews ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Coffee</TableHead>
                  <TableHead className="text-right">Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brews.map((brew) => (
                  <TableRow key={brew.id}>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(brew.brewed_at), "MMM d")}
                    </TableCell>
                    <TableCell className="font-medium">{brew.coffee_name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {brew.brew_method}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Coffee className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-2">No brews logged yet</p>
            <p className="text-sm text-muted-foreground/70">
              Start tracking your coffee journey!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
