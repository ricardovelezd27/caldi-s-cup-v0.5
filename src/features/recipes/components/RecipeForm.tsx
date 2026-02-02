import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type RecipeFormData, BREW_METHODS, GRIND_SIZES } from "../types/recipe";

const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required").max(100),
  description: z.string().max(500).optional(),
  brewMethod: z.string().min(1, "Brew method is required"),
  grindSize: z.string().optional(),
  ratio: z.string().max(20).optional(),
  waterTempCelsius: z.coerce.number().min(0).max(100).optional().nullable(),
  brewTimeSeconds: z.coerce.number().min(0).max(3600).optional().nullable(),
  steps: z.array(z.string()),
  isPublic: z.boolean(),
  coffeeId: z.string().optional(),
});

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function RecipeForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Recipe",
}: RecipeFormProps) {
  const [steps, setSteps] = useState<string[]>(initialData?.steps ?? [""]);

  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      brewMethod: initialData?.brewMethod ?? "",
      grindSize: initialData?.grindSize ?? "",
      ratio: initialData?.ratio ?? "",
      waterTempCelsius: initialData?.waterTempCelsius ?? null,
      brewTimeSeconds: initialData?.brewTimeSeconds ?? null,
      steps: initialData?.steps ?? [],
      isPublic: initialData?.isPublic ?? false,
      coffeeId: initialData?.coffeeId ?? "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof recipeSchema>) => {
    const filteredSteps = steps.filter((s) => s.trim() !== "");
    await onSubmit({
      name: values.name,
      brewMethod: values.brewMethod,
      description: values.description,
      grindSize: values.grindSize,
      ratio: values.ratio,
      steps: filteredSteps,
      isPublic: values.isPublic,
      coffeeId: values.coffeeId,
      waterTempCelsius: values.waterTempCelsius ?? undefined,
      brewTimeSeconds: values.brewTimeSeconds ?? undefined,
    });
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Name *</FormLabel>
                <FormControl>
                  <Input placeholder="My Perfect Pour Over" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A quick description of this recipe..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Brew Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brewMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brew Method *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BREW_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grindSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grind Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grind" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GRIND_SIZES.map((grind) => (
                      <SelectItem key={grind.value} value={grind.value}>
                        {grind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ratio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coffee:Water Ratio</FormLabel>
                <FormControl>
                  <Input placeholder="1:15" {...field} />
                </FormControl>
                <FormDescription>e.g., 1:15 or 15g:225ml</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="waterTempCelsius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Temperature (°C)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="93"
                    min={0}
                    max={100}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brewTimeSeconds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brew Time (seconds)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="240"
                    min={0}
                    max={3600}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>Total brew time in seconds</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <FormLabel>Steps</FormLabel>
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex items-center h-10 text-muted-foreground">
                <GripVertical className="w-4 h-4" />
                <span className="w-6 text-center text-sm font-medium">
                  {index + 1}.
                </span>
              </div>
              <Textarea
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder={`Step ${index + 1}...`}
                rows={2}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStep(index)}
                disabled={steps.length === 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        {/* Public Toggle */}
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border-4 border-border p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Share with Community</FormLabel>
                <FormDescription>
                  Make this recipe visible to other coffee lovers
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
