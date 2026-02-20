/**
 * Uploads individual scan images to storage and updates the coffee record
 * with their signed URLs. Also sets the first image as the main image_url.
 */
import { supabase } from "@/integrations/supabase/client";

function base64ToBlob(base64: string): Blob {
  const parts = base64.split(",");
  const byteString = atob(parts.length > 1 ? parts[1] : parts[0]);
  const mimeMatch = parts[0]?.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export async function uploadScanImages(
  userId: string,
  coffeeId: string,
  images: string[]
): Promise<void> {
  if (images.length <= 1) return; // Single image already handled by edge function

  try {
    const uploadPromises = images.map(async (img, i) => {
      const blob = base64ToBlob(img);
      const fileName = `${userId}/${coffeeId}_${i}_${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("coffee-scans")
        .upload(fileName, blob, { contentType: "image/jpeg", upsert: false });

      if (uploadError) {
        console.error(`Failed to upload image ${i}:`, uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from("coffee-scans")
        .getPublicUrl(fileName);

      return data?.publicUrl ?? null;
    });

    const urls = (await Promise.all(uploadPromises)).filter(
      (url): url is string => url !== null
    );

    if (urls.length === 0) return;

    // Update coffee record with individual image URLs and set first as main
    const { error: updateError } = await supabase
      .from("coffees")
      .update({
        additional_image_urls: urls,
        image_url: urls[0], // Replace composite with first individual photo
      })
      .eq("id", coffeeId);

    if (updateError) {
      console.error("Failed to update coffee with image URLs:", updateError);
    }
  } catch (err) {
    console.error("uploadScanImages error:", err);
  }
}
