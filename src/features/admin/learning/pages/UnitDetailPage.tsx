import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUnitById, getAdminTrackById, toggleActive } from "../services/adminLearningService";
import { useAdminLessons } from "../hooks/useAdminLessons";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import AdminBreadcrumb from "../components/AdminBreadcrumb";

export default function UnitDetailPage() {
  const { trackId, unitId } = useParams<{ trackId: string; unitId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: track } = useQuery({
    queryKey: ["admin", "track", trackId],
    queryFn: () => getAdminTrackById(trackId!),
    enabled: !!trackId,
  });

  const { data: unit } = useQuery({
    queryKey: ["admin", "unit", unitId],
    queryFn: () => getAdminUnitById(unitId!),
    enabled: !!unitId,
  });

  const { data: lessons, isLoading } = useAdminLessons(unitId);

  const handleToggle = async (id: string, current: boolean) => {
    await toggleActive("learning_lessons", id, !current);
    qc.invalidateQueries({ queryKey: ["admin", "lessons"] });
  };

  return (
    <div className="space-y-4">
      <AdminBreadcrumb
        crumbs={[
          { label: "Learning Hub", href: "/admin/learning" },
          { label: track?.name ?? "Track", href: `/admin/learning/${trackId}` },
          { label: unit?.name ?? "Unit" },
        ]}
      />

      {unit && (
        <div className="space-y-1">
          <h2 className="font-heading text-2xl flex items-center gap-2">
            <span>{unit.icon}</span> {unit.name}
          </h2>
          <p className="text-sm text-muted-foreground">{unit.description}</p>
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lesson Name</TableHead>
              <TableHead className="text-center">Exercises</TableHead>
              <TableHead className="text-center">XP</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-center">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons?.map((l) => (
              <TableRow
                key={l.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/admin/learning/${trackId}/${unitId}/${l.id}`)}
              >
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell className="text-center">{l.exercise_count}</TableCell>
                <TableCell className="text-center">{l.xp_reward}</TableCell>
                <TableCell className="text-center">{l.estimated_minutes}m</TableCell>
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={l.is_active}
                    onCheckedChange={() => handleToggle(l.id, l.is_active)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
