import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";

interface ManualCoffeeData {
  name: string;
  brand: string;
  origin_country?: string;
  roast_level?: string;
  processing_method?: string;
  flavor_notes?: string[];
  description?: string;
  altitude_meters?: number;
  comments?: string;
  imageFile?: File;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function useManualAddCoffee() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const submit = async (data: ManualCoffeeData) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // 1. Find or create roaster
      const { data: existingRoasters } = await supabase
        .from("roasters")
        .select("id")
        .ilike("business_name", data.brand)
        .limit(1);

      let roasterId: string;

      if (existingRoasters && existingRoasters.length > 0) {
        roasterId = existingRoasters[0].id;
      } else {
        const slug = generateSlug(data.brand);
        const { data: newRoaster, error: roasterError } = await supabase
          .from("roasters")
          .insert({
            business_name: data.brand,
            slug,
            user_id: user.id,
            is_verified: false,
          })
          .select("id")
          .single();

        if (roasterError) throw roasterError;
        roasterId = newRoaster.id;
      }

      // 2. Upload image if provided
      let imageUrl: string | null = null;
      if (data.imageFile) {
        const ext = data.imageFile.name.split(".").pop() || "jpg";
        const path = `manual/${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("coffee-scans")
          .upload(path, data.imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("coffee-scans")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      // 3. Build description with comments appended
      let fullDescription = data.description || null;
      if (data.comments) {
        fullDescription = fullDescription
          ? `${fullDescription}\n\n---\nNotes: ${data.comments}`
          : data.comments;
      }

      // 4. Insert coffee
      const { data: newCoffee, error: coffeeError } = await supabase
        .from("coffees")
        .insert({
          name: data.name,
          brand: data.brand,
          roaster_id: roasterId,
          origin_country: data.origin_country || null,
          roast_level: (data.roast_level as any) || null,
          processing_method: data.processing_method || null,
          flavor_notes: data.flavor_notes?.length ? data.flavor_notes : [],
          description: fullDescription,
          altitude_meters: data.altitude_meters || null,
          image_url: imageUrl,
          source: "manual" as any,
          created_by: user.id,
          is_verified: false,
        })
        .select("id")
        .single();

      if (coffeeError) throw coffeeError;

      toast({
        title: "Coffee added!",
        description: `${data.name} has been added to the catalog.`,
      });

      navigate(`/coffee/${newCoffee.id}`);
    } catch (err: any) {
      console.error("Manual add error:", err);
      toast({
        title: "Error adding coffee",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting };
}
