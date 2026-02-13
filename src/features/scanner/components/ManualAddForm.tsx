import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FlavorNotesInput } from "./FlavorNotesInput";
import { useManualAddCoffee } from "../hooks/useManualAddCoffee";

const manualCoffeeSchema = z.object({
  name: z.string().trim().min(1, "Coffee name is required").max(100),
  brand: z.string().trim().min(1, "Roaster/Brand is required").max(100),
  origin_country: z.string().max(100).optional().or(z.literal("")),
  roast_level: z.string().optional(),
  processing_method: z.string().optional(),
  flavor_notes: z.array(z.string()).optional(),
  description: z.string().max(1000).optional().or(z.literal("")),
  altitude_meters: z.number().min(500).max(2500).optional(),
  comments: z.string().max(1000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof manualCoffeeSchema>;

const ROAST_LABELS = ["Light", "Med-Light", "Medium", "Med-Dark", "Dark"];
const ALTITUDE_LABELS = ["500m", "1000m", "1500m", "2000m", "2500m+"];
const PROCESSING_METHODS = ["Washed", "Natural", "Honey", "Anaerobic", "Other"];

export function ManualAddForm() {
  const { submit, isSubmitting } = useManualAddCoffee();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(manualCoffeeSchema),
    defaultValues: {
      name: "",
      brand: "",
      origin_country: "",
      roast_level: undefined,
      processing_method: undefined,
      flavor_notes: [],
      description: "",
      altitude_meters: undefined,
      comments: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: FormValues) => {
    submit({
      name: values.name,
      brand: values.brand,
      origin_country: values.origin_country || undefined,
      roast_level: values.roast_level,
      processing_method: values.processing_method,
      flavor_notes: values.flavor_notes,
      description: values.description || undefined,
      altitude_meters: values.altitude_meters,
      comments: values.comments || undefined,
      imageFile: imageFile || undefined,
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="border-4 border-border rounded-lg p-6 bg-card shadow-[4px_4px_0px_0px_var(--border)]">
        <h2 className="font-bangers text-2xl text-foreground mb-6">
          Add Coffee Manually
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Required Fields */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Coffee Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ethiopia Yirgacheffe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Roaster / Brand *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Blue Bottle Coffee" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Photo</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Coffee preview"
                    className="max-h-48 rounded object-contain"
                  />
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Tap to upload a photo
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Origin */}
            <FormField
              control={form.control}
              name="origin_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin Country</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Colombia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Roast Level Slider */}
            <FormField
              control={form.control}
              name="roast_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roast Level</FormLabel>
                  <FormControl>
                    <div className="space-y-2 pt-2">
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={field.value ? [Number(field.value)] : [3]}
                        onValueChange={(v) => field.onChange(String(v[0]))}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        {ROAST_LABELS.map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Altitude Slider */}
            <FormField
              control={form.control}
              name="altitude_meters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altitude</FormLabel>
                  <FormControl>
                    <div className="space-y-2 pt-2">
                      <Slider
                        min={500}
                        max={2500}
                        step={500}
                        value={field.value ? [field.value] : [1500]}
                        onValueChange={(v) => field.onChange(v[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        {ALTITUDE_LABELS.map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Processing Method */}
            <FormField
              control={form.control}
              name="processing_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processing Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROCESSING_METHODS.map((m) => (
                        <SelectItem key={m} value={m.toLowerCase()}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Flavor Notes */}
            <FormField
              control={form.control}
              name="flavor_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flavor Notes</FormLabel>
                  <FormControl>
                    <FlavorNotesInput
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Press Enter to add each note
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about this coffee..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comments */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any extra notes, brewing tips, etc."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-bangers text-lg"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Coffee"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
