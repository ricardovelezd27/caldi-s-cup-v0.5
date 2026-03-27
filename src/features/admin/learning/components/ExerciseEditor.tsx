import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import type { AdminExerciseRow } from "../services/adminLearningService";
import type { Json } from "@/integrations/supabase/types";
import type { LearningExercise, ExerciseType } from "@/features/learning/types/learning";
import { ExerciseRenderer } from "@/features/learning/components/lesson/ExerciseRenderer";
import {
  TrueFalseForm,
  MultipleChoiceForm,
  FillInBlankForm,
  MatchingPairsForm,
  SequencingForm,
  PredictionForm,
  TroubleshootingForm,
  CategorizationForm,
  GenericJsonForm,
} from "./exercise-forms";

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
  const [questionData, setQuestionData] = useState<Record<string, any>>(
    exercise.question_data as Record<string, any>,
  );
  const [jsonError, setJsonError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (jsonError) return;
    setSaving(true);
    try {
      await onSave({
        question_data: questionData as Json,
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

  const previewExercise: LearningExercise = {
    id: exercise.id,
    lessonId: "",
    exerciseType: exercise.exercise_type as ExerciseType,
    sortOrder: 0,
    isActive: active,
    questionData: questionData as Json,
    imageUrl: exercise.image_url ?? null,
    audioUrl: null,
    difficultyScore: difficulty,
    conceptTags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    mascot,
    mascotMood: mood,
    createdAt: "",
    updatedAt: "",
  };

  const handlePreviewAnswer = (_answer: any, isCorrect: boolean) => {
    toast(isCorrect ? "✅ Preview: Correct!" : "❌ Preview: Incorrect", {
      duration: 2000,
    });
  };

  const renderQuestionForm = () => {
    const type = exercise.exercise_type;

    switch (type) {
      case "true_false":
        return <TrueFalseForm data={questionData} onChange={setQuestionData} />;
      case "multiple_choice":
        return <MultipleChoiceForm data={questionData} onChange={setQuestionData} />;
      case "fill_in_blank":
        return <FillInBlankForm data={questionData} onChange={setQuestionData} />;
      case "matching_pairs":
        return <MatchingPairsForm data={questionData} onChange={setQuestionData} />;
      case "sequencing":
        return <SequencingForm data={questionData} onChange={setQuestionData} />;
      case "prediction":
        return <PredictionForm data={questionData} onChange={setQuestionData} />;
      case "troubleshooting":
        return <TroubleshootingForm data={questionData} onChange={setQuestionData} />;
      case "categorization":
        return <CategorizationForm data={questionData} onChange={setQuestionData} />;
      default:
        return (
          <GenericJsonForm
            data={questionData}
            onChange={setQuestionData}
            error={jsonError}
            onError={setJsonError}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Edit Exercise</DialogTitle>
          <p className="text-xs text-muted-foreground">Type: {exercise.exercise_type}</p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Parameter Form */}
          <div className="space-y-4 overflow-y-auto max-h-[65vh] pr-2">
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

            {/* Question Data Form */}
            <div className="border-t-4 border-border pt-4">
              <h3 className="font-heading text-lg mb-3">Question Content</h3>
              {renderQuestionForm()}
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="flex flex-col items-center">
            <h3 className="font-heading text-lg mb-3 text-muted-foreground">Live Preview</h3>
            <div
              className="border-4 border-border rounded-2xl bg-background overflow-y-auto relative"
              style={{ width: 375, maxHeight: 667 }}
            >
              <div className="p-4">
                <ExerciseRenderer
                  key={JSON.stringify(questionData)}
                  exercise={previewExercise}
                  onAnswer={handlePreviewAnswer}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !!jsonError}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
