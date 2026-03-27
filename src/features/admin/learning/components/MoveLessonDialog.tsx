import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllUnitsForTrack, moveLessonToUnit } from "../services/adminLearningService";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onClose: () => void;
  lessonId: string;
  lessonName: string;
  currentUnitId: string;
  trackId: string;
}

export default function MoveLessonDialog({ open, onClose, lessonId, lessonName, currentUnitId, trackId }: Props) {
  const [units, setUnits] = useState<{ id: string; name: string; section_name: string }[]>([]);
  const [targetUnitId, setTargetUnitId] = useState<string>("");
  const [moving, setMoving] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (!open) return;
    getAllUnitsForTrack(trackId).then((data) => {
      setUnits(data.filter((u) => u.id !== currentUnitId));
    });
  }, [open, trackId, currentUnitId]);

  const handleMove = async () => {
    if (!targetUnitId) return;
    setMoving(true);
    try {
      await moveLessonToUnit(lessonId, currentUnitId, targetUnitId);
      qc.invalidateQueries({ queryKey: ["admin"] });
      onClose();
    } finally {
      setMoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Move Lesson</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Move "<span className="font-medium text-foreground">{lessonName}</span>" to another unit.
        </p>
        <Select value={targetUnitId} onValueChange={setTargetUnitId}>
          <SelectTrigger>
            <SelectValue placeholder="Select target unit…" />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.section_name} → {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleMove} disabled={!targetUnitId || moving}>
            {moving ? "Moving…" : "Move"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
