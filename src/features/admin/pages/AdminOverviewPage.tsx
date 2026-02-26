import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ScanLine, Store, Users } from "lucide-react";

const stats = [
  { label: "Learning Tracks", value: "4", icon: BookOpen },
  { label: "Total Scans", value: "—", icon: ScanLine },
  { label: "Products", value: "—", icon: Store },
  { label: "Users", value: "—", icon: Users },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-heading">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
