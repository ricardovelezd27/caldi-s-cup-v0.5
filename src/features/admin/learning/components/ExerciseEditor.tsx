import React, { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  exercises: AdminExerciseRow[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onSave: (exerciseId: string, updates: {
    question_data?: Json;
    mascot?: string;
    mascot_mood?: string;
    difficulty_score?: number;
    is_active?: boolean;
    concept_tags?: string[];
  }) => Promise<void>;
}

class PreviewBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidUpdate(prev: { children: React.ReactNode }) {
    if (prev.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded border-2 border-dashed border-border p-4 text-sm text-muted-foreground text-center">
          Preview unavailable for current data. You can still edit parameters on the left.
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ExerciseEditor({ exercise, exercises, currentIndex, open, onClose, onNavigate, onSave }: Props) {
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

  // Track if changes were made
  const initialSnapshot = useRef(JSON.stringify({
    mascot: exercise.mascot,
    mood: exercise.mascot_mood,
    difficulty: exercise.difficulty_score,
    active: exercise.is_active,
    tags: exercise.concept_tags.join(", "),
    questionData: exercise.question_data,
  }));

  // Rehydrate local state when exercise changes (navigation)
  React.useEffect(() => {
    setMascot(exercise.mascot);
    setMood(exercise.mascot_mood);
    setDifficulty(exercise.difficulty_score);
    setActive(exercise.is_active);
    setTags(exercise.concept_tags.join(", "));
    setQuestionData(exercise.question_data as Record<string, any>);
    setJsonError("");
    initialSnapshot.current = JSON.stringify({
      mascot: exercise.mascot,
      mood: exercise.mascot_mood,
      difficulty: exercise.difficulty_score,
      active: exercise.is_active,
      tags: exercise.concept_tags.join(", "),
      questionData: exercise.question_data,
    });
  }, [exercise.id]);

  const [pendingNavDirection, setPendingNavDirection] = useState<number | null>(null);

  const hasChanges = useCallback(() => {
    const current = JSON.stringify({ mascot, mood, difficulty, active, tags, questionData });
    return current !== initialSnapshot.current;
  }, [mascot, mood, difficulty, active, tags, questionData]);

  const getCurrentUpdates = () => ({
    question_data: questionData as Json,
    mascot,
    mascot_mood: mood,
    difficulty_score: difficulty,
    is_active: active,
    concept_tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
  });

  const handleSave = async () => {
    if (jsonError) return;
    setSaving(true);
    try {
      await onSave(exercise.id, getCurrentUpdates());
      // Update snapshot after save
      initialSnapshot.current = JSON.stringify({ mascot, mood, difficulty, active, tags, questionData });
    } finally {
      setSaving(false);
    }
  };

  const attemptNavigate = (targetIndex: number) => {
    if (hasChanges()) {
      setPendingNavDirection(targetIndex);
    } else {
      onNavigate(targetIndex);
    }
  };

  const handleSaveAndNavigate = async () => {
    if (pendingNavDirection === null) return;
    setSaving(true);
    try {
      await onSave(exercise.id, getCurrentUpdates());
      const target = pendingNavDirection;
      setPendingNavDirection(null);
      onNavigate(target);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardAndNavigate = () => {
    if (pendingNavDirection === null) return;
    const target = pendingNavDirection;
    setPendingNavDirection(null);
    onNavigate(target);
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < exercises.length - 1;

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
    toast(isCorrect ? "✅ Preview: Correct!" : "❌ Preview: Incorrect", { duration: 2000 });
  };

  const renderQuestionForm = () => {
    const type = exercise.exercise_type;
    switch (type) {
      case "true_false": return <TrueFalseForm data={questionData} onChange={setQuestionData} />;
      case "multiple_choice": return <MultipleChoiceForm data={questionData} onChange={setQuestionData} />;
      case "fill_in_blank": return <FillInBlankForm data={questionData} onChange={setQuestionData} />;
      case "matching_pairs": return <MatchingPairsForm data={questionData} onChange={setQuestionData} />;
      case "sequencing": return <SequencingForm data={questionData} onChange={setQuestionData} />;
      case "prediction": return <PredictionForm data={questionData} onChange={setQuestionData} />;
      case "troubleshooting": return <TroubleshootingForm data={questionData} onChange={setQuestionData} />;
      case "categorization": return <CategorizationForm data={questionData} onChange={setQuestionData} />;
      default: return <GenericJsonForm data={questionData} onChange={setQuestionData} error={jsonError} onError={setJsonError} />;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Exercise</DialogTitle>
            <p className="text-xs text-muted-foreground">
              Type: {exercise.exercise_type} · Exercise {currentIndex + 1} of {exercises.length}
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Parameter Form */}
            <div className="space-y-4 overflow-y-auto max-h-[65vh] pr-2">
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

              <div className="space-y-2">
                <Label>Difficulty: {difficulty}</Label>
                <Slider value={[difficulty]} onValueChange={([v]) => setDifficulty(v)} min={1} max={100} step={1} />
              </div>

              <div className="flex items-center gap-2">
                <Label>Active</Label>
                <Switch checked={active} onCheckedChange={setActive} />
              </div>

              <div className="space-y-2">
                <Label>Concept Tags (comma-separated)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>

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
                  <PreviewBoundary key={`boundary:${exercise.exercise_type}:${JSON.stringify(questionData)}`}>
                    <ExerciseRenderer
                      key={`${exercise.exercise_type}:${JSON.stringify(questionData)}`}
                      exercise={previewExercise}
                      onAnswer={handlePreviewAnswer}
                      disabled={false}
                    />
                  </PreviewBoundary>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled={!hasPrev} onClick={() => attemptNavigate(currentIndex - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button variant="ghost" size="sm" disabled={!hasNext} onClick={() => attemptNavigate(currentIndex + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !!jsonError}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save-before-navigating confirmation */}
      <AlertDialog open={pendingNavDirection !== null} onOpenChange={(v) => !v && setPendingNavDirection(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save before moving on?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel onClick={() => setPendingNavDirection(null)}>Stay</AlertDialogCancel>
            <Button variant="outline" onClick={handleDiscardAndNavigate}>Discard</Button>
            <AlertDialogAction onClick={handleSaveAndNavigate} disabled={saving}>
              {saving ? "Saving…" : "Save & Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
