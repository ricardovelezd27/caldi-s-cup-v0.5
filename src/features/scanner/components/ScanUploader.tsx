import { useCallback, useRef, useState } from "react";
import { Camera, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScanUploaderProps {
  onImageSelected: (imageBase64: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_COMPRESSED_SIZE = 1.5 * 1024 * 1024; // 1.5MB target for compression
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

// Compress image using canvas
const compressImage = async (base64: string, maxSize: number = MAX_COMPRESSED_SIZE): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      
      // Scale down if image is very large
      const MAX_DIMENSION = 1920;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels until we're under the max size
      let quality = 0.8;
      let result = canvas.toDataURL('image/jpeg', quality);
      
      while (result.length > maxSize && quality > 0.1) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(result);
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = base64;
  });
};

export function ScanUploader({ onImageSelected, disabled }: ScanUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    // Check file type - handle HEIC specially
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || 
                   file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    
    if (isHeic) {
      toast.error("HEIC format not supported", {
        description: "Please convert to JPG or PNG first, or take a new photo with your camera app set to 'Most Compatible'."
      });
      return;
    }
    
    if (!ACCEPTED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      
      // Compress the image for mobile reliability
      const compressed = await compressImage(base64);
      
      setPreview(compressed);
      onImageSelected(compressed);
    } catch (err) {
      console.error('Error processing image:', err);
      toast.error("Failed to process image", {
        description: "Please try a different image or take a new photo."
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onImageSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const clearPreview = useCallback(() => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }, []);

  if (preview) {
    return (
      <div className="relative">
        <div className="border-4 border-border rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_hsl(var(--border))]">
          <img 
            src={preview} 
            alt="Coffee bag preview" 
            className="w-full h-auto max-h-[400px] object-contain bg-muted"
          />
        </div>
        {!disabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearPreview}
            className="absolute top-2 right-2"
          >
            Change Image
          </Button>
        )}
      </div>
    );
  }

  // Show processing state
  if (isProcessing) {
    return (
      <div className="border-4 border-dashed border-primary rounded-lg p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div>
            <h3 className="font-bangers text-2xl text-foreground mb-1">
              Processing Image
            </h3>
            <p className="text-muted-foreground text-sm">
              Optimizing for best results...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        border-4 border-dashed rounded-lg p-8 text-center transition-colors
        ${dragActive ? "border-primary bg-primary/5" : "border-border"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={disabled ? undefined : handleDrop}
      onClick={disabled ? undefined : () => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Camera className="w-10 h-10 text-primary" />
        </div>
        
        <div>
          <h3 className="font-bangers text-2xl text-foreground mb-1">
            Scan Your Coffee Bag
          </h3>
          <p className="text-muted-foreground text-sm">
            Drag & drop an image or click to upload
          </p>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            disabled={disabled}
            className="gap-2"
          >
            <Camera className="w-4 h-4" />
            Take Photo
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={disabled}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
          <ImageIcon className="w-3 h-3" />
          <span>JPG, PNG, or WebP • Max 10MB</span>
        </div>
      </div>
    </div>
  );
}
