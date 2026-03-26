import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Upload, FileUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import {
  validateTrackImportJson,
  type TrackImportData,
  type TrackValidationResult,
} from "../services/trackImportValidator";
import { transformFlatExerciseToQuestionData, normalizeMascot } from "../services/exerciseFormatTransformer";
import {
  getAdminSections,
  upsertSection,
  upsertUnit,
  upsertLesson,
  upsertExercise,
  getAdminUnits,
  getAdminLessons,
  deleteExercisesByLessonId,
  deleteLessonsByUnitId,
  deleteEntity,
} from "../services/adminLearningService";
import type { Json } from "@/integrations/supabase/types";

type Step = "paste" | "preview" | "done";

interface Props {
  open: boolean;
  onClose: () => void;
  trackId: string;
}

export default function ImportTrackJsonModal({ open, onClose, trackId }: Props) {
  const [step, setStep] = useState<Step>("paste");
  const [rawJson, setRawJson] = useState("");
  const [validation, setValidation] = useState<TrackValidationResult | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ success: boolean; message: string } | null>(null);
  const [overrideMode, setOverrideMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const handleParse = () => {
    const result = validateTrackImportJson(rawJson);
    setValidation(result);
    if (result.valid) setStep("preview");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRawJson(text);
      setValidation(null);
    };
    reader.readAsText(file);
  };

  const handlePublish = async () => {
    if (!validation?.data) return;
    setPublishing(true);
    try {
      const importData = validation.data;

      // 1. Find or create section
      const existingSections = await getAdminSections(trackId);
      let section = existingSections.find(
        (s) =>
          s.name.toLowerCase().replace(/[^a-z0-9]+/g, "_") ===
            (importData.section_id ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "_") ||
          s.name.toLowerCase() === importData.section_title.toLowerCase(),
      );

      if (!section) {
        section = await upsertSection({
          track_id: trackId,
          name: importData.section_title,
          name_es: importData.section_title_es,
          description: "",
          description_es: "",
          learning_goal: "",
          learning_goal_es: "",
          level: "beginner",
          sort_order: existingSections.length,
          is_active: true,
        });
      }

      const sectionId = section.id;

      // 2. Override: delete existing units in section
      if (overrideMode) {
        const existingUnits = await getAdminUnits(sectionId);
        for (const eu of existingUnits) {
          const existingLessons = await getAdminLessons(eu.id);
          for (const el of existingLessons) {
            await deleteExercisesByLessonId(el.id);
          }
          await deleteLessonsByUnitId(eu.id);
          await deleteEntity("learning_units", eu.id);
        }
      }

      // 3. Import units → lessons → exercises
      let totalLessons = 0;
      let totalExercises = 0;
      const existingUnitsCount = overrideMode ? 0 : (await getAdminUnits(sectionId)).length;

      for (const [ui, unit] of importData.units.entries()) {
        const insertedUnit = await upsertUnit({
          section_id: sectionId,
          name: unit.unit_title,
          name_es: unit.unit_title_es,
          description: unit.description ?? "",
          description_es: unit.description_es ?? "",
          icon: unit.icon ?? "📖",
          sort_order: existingUnitsCount + ui,
          estimated_minutes: unit.estimated_minutes ?? 15,
          lesson_count: unit.lessons.length,
          is_active: true,
        });

        for (const [li, lesson] of unit.lessons.entries()) {
          const avgDiff =
            lesson.exercises.reduce((s, e) => s + (e.difficulty_score ?? 50), 0) /
            lesson.exercises.length;
          const xpReward = Math.round(10 + (avgDiff / 100) * 10);

          const insertedLesson = await upsertLesson({
            unit_id: insertedUnit.id,
            name: lesson.lesson_title,
            name_es: lesson.lesson_title_es,
            intro_text: lesson.intro_text ?? "",
            intro_text_es: lesson.intro_text_es ?? "",
            sort_order: li,
            estimated_minutes: lesson.estimated_minutes ?? 4,
            xp_reward: xpReward,
            exercise_count: lesson.exercises.length,
            is_active: true,
          });

          for (const [ei, ex] of lesson.exercises.entries()) {
            const questionData = transformFlatExerciseToQuestionData(ex.type, ex as Record<string, unknown>);
            await upsertExercise({
              lesson_id: insertedLesson.id,
              exercise_type: ex.type,
              sort_order: ei,
              is_active: true,
              question_data: questionData as Json,
              difficulty_score: ex.difficulty_score ?? 50,
              concept_tags: ex.concept_tags ?? [],
              mascot: normalizeMascot(ex.mascot ?? "Caldi"),
              mascot_mood: ex.mascot_mood ?? "neutral",
            });
            totalExercises++;
          }
          totalLessons++;
        }
      }

      setPublishResult({
        success: true,
        message: `Published ${importData.units.length} unit(s), ${totalLessons} lesson(s), ${totalExercises} exercise(s) to "${importData.section_title}".`,
      });
      setStep("done");
      qc.invalidateQueries({ queryKey: ["admin"] });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setPublishResult({ success: false, message });
      setStep("done");
    } finally {
      setPublishing(false);
    }
  };

  const handleClose = () => {
    setStep("paste");
    setRawJson("");
    setValidation(null);
    setPublishResult(null);
    setOverrideMode(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Import Track JSON</DialogTitle>
        </DialogHeader>

        {step === "paste" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
              >
                <FileUp className="h-3 w-3 mr-1" /> Upload File
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <Textarea
              value={rawJson}
              onChange={(e) => {
                setRawJson(e.target.value);
                setValidation(null);
              }}
              placeholder="Paste your AI-generated track JSON here..."
              className="font-mono text-xs min-h-[300px]"
              spellCheck={false}
            />
            <div className="flex items-center gap-3">
              <Switch id="override-track" checked={overrideMode} onCheckedChange={setOverrideMode} />
              <Label htmlFor="override-track" className="text-sm font-medium cursor-pointer">
                Override existing content
              </Label>
            </div>
            {overrideMode && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This will delete all existing units, lessons, and exercises in the matched section before importing.
                </AlertDescription>
              </Alert>
            )}
            {validation && !validation.valid && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc pl-4 text-xs">
                    {validation.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleParse} disabled={!rawJson.trim()}>Parse & Preview</Button>
            </DialogFooter>
          </div>
        )}

        {step === "preview" && validation?.data && (
          <div className="space-y-4">
            {validation.warnings.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc pl-4 text-xs">
                    {validation.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <StagedTrackPreview data={validation.data} />

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("paste")}>Back</Button>
              <Button onClick={handlePublish} disabled={publishing}>
                <Upload className="h-4 w-4 mr-1" />
                {publishing ? "Publishing…" : "Publish to Database"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "done" && publishResult && (
          <div className="space-y-4">
            <Alert variant={publishResult.success ? "default" : "destructive"}>
              {publishResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>{publishResult.message}</AlertDescription>
            </Alert>
            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Inline preview ──

function StagedTrackPreview({ data }: { data: TrackImportData }) {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base font-heading">
            📂 {data.section_title}
            <span className="text-xs text-muted-foreground font-normal ml-2">
              / {data.section_title_es}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {data.units.length} unit(s) •{" "}
          {data.units.reduce((s, u) => s + u.lessons.length, 0)} lesson(s) •{" "}
          {data.units.reduce((s, u) => s + u.lessons.reduce((ls, l) => ls + l.exercises.length, 0), 0)} exercise(s)
        </CardContent>
      </Card>

      {data.units.map((unit, ui) => (
        <Card key={ui} className="ml-2">
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-heading">
              {unit.icon ?? "📖"} {unit.unit_title}
              <span className="text-xs text-muted-foreground font-normal ml-2">
                ({unit.lessons.length} lesson{unit.lessons.length !== 1 ? "s" : ""})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-2">
            {unit.lessons.map((lesson, li) => (
              <div key={li} className="ml-4">
                <p className="text-xs font-medium">
                  Lesson {li + 1}: {lesson.lesson_title}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lesson.exercises.map((ex, ei) => (
                    <Badge key={ei} variant="outline" className="text-[10px]">
                      {ex.type} (D:{ex.difficulty_score ?? 50})
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
