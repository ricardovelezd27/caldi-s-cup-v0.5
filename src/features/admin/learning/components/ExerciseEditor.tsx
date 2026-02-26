import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AdminExerciseRow } from "../services/adminLearningService";
import type { Json } from "@/integrations/supabase/types";

const MOODS = ["neutral", "curious", "thinking", "encouraging", "celebrating", "excited", "happy", "confused"];

interface Props {
  exercise: AdminExerciseRow;
  open: boolean;
  onClose: () => void;
  onSave: (updates: {
    question_data?: Json;
    mascot?: string;
    mascot_mood?: string;
    difficulty_score?: number;
    is_active?: boolean;
    concept_tags?: string[];
  }) => Promise<void>;
}

export default function ExerciseEditor({ exercise, open, onClose, onSave }: Props) {
  const [mascot, setMascot] = useState(exercise.mascot);
  const [mood, setMood] = useState(exercise.mascot_mood);
  const [difficulty, setDifficulty] = useState(exercise.difficulty_score);
  const [active, setActive] = useState(exercise.is_active);
  const [tags, setTags] = useState(exercise.concept_tags.join(", "));
  const [jsonStr, setJsonStr] = useState(JSON.stringify(exercise.question_data, null, 2));
  const [jsonError, setJsonError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    let parsed: Json;
    try {
      parsed = JSON.parse(jsonStr);
      setJsonError("");
    } catch {
      setJsonError("Invalid JSON");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        question_data: parsed,
        mascot,
        mascot_mood: mood,
        difficulty_score: difficulty,
        is_active: active,
        concept_tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Edit Exercise</DialogTitle>
          <p className="text-xs text-muted-foreground">Type: {exercise.exercise_type}</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mascot */}
          <div className="space-y-2">
            <Label>Mascot</Label>
            <RadioGroup value={mascot} onValueChange={setMascot} className="flex gap-4">
              <div className="flex items-center gap-1">
                <RadioGroupItem value="caldi" id="m-caldi" />
                <Label htmlFor="m-caldi" className="text-sm">Caldi</Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="goat" id="m-goat" />
                <Label htmlFor="m-goat" className="text-sm">The Goat</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label>Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOODS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label>Difficulty: {difficulty}</Label>
            <Slider
              value={[difficulty]}
              onValueChange={([v]) => setDifficulty(v)}
              min={1}
              max={100}
              step={1}
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <Label>Active</Label>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Concept Tags (comma-separated)</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>

          {/* JSON Editor */}
          <div className="space-y-2">
            <Label>question_data (JSON)</Label>
            <Textarea
              value={jsonStr}
              onChange={(e) => {
                setJsonStr(e.target.value);
                setJsonError("");
              }}
              className="font-mono text-xs min-h-[200px]"
              spellCheck={false}
            />
            {jsonError && <p className="text-xs text-destructive">{jsonError}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
