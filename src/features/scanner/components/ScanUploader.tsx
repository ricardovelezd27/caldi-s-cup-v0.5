import { useCallback, useRef, useState } from "react";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScanUploaderProps {
  onImageSelected: (imageBase64: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ScanUploader({ onImageSelected, disabled }: ScanUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onImageSelected(base64);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
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
