import { useCallback, useRef, useState, useEffect } from "react";
import { Camera, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language";

interface ScanUploaderProps { onImageSelected: (imageBase64: string) => void; disabled?: boolean; }

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_COMPRESSED_SIZE = 1.5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const compressImage = async (base64: string, maxSize: number = MAX_COMPRESSED_SIZE): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const MAX_DIMENSION = 1920;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) { if (width > height) { height = Math.round((height * MAX_DIMENSION) / width); width = MAX_DIMENSION; } else { width = Math.round((width * MAX_DIMENSION) / height); height = MAX_DIMENSION; } }
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Failed to get canvas context')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      let quality = 0.8;
      let result = canvas.toDataURL('image/jpeg', quality);
      while (result.length > maxSize && quality > 0.1) { quality -= 0.1; result = canvas.toDataURL('image/jpeg', quality); }
      resolve(result);
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = base64;
  });
};

const isMobileDevice = (): boolean => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export function ScanUploader({ onImageSelected, disabled }: ScanUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const { t } = useLanguage();

  useEffect(() => { if (showCameraModal && videoRef.current && streamRef.current) { videoRef.current.srcObject = streamRef.current; } }, [showCameraModal]);
  useEffect(() => { return () => { if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); } }; }, []);

  const closeCameraModal = useCallback(() => { if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; } setShowCameraModal(false); }, []);

  const processFile = useCallback(async (file: File) => {
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    if (isHeic) { toast.error("HEIC format not supported", { description: "Please convert to JPG or PNG first." }); return; }
    if (!ACCEPTED_TYPES.includes(file.type) && !file.type.startsWith('image/')) { toast.error("Please upload a JPG, PNG, or WebP image"); return; }
    if (file.size > MAX_FILE_SIZE) { toast.error("Image must be less than 10MB"); return; }
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => { reader.onload = (e) => resolve(e.target?.result as string); reader.onerror = () => reject(new Error('Failed to read file')); reader.readAsDataURL(file); });
      const compressed = await compressImage(base64);
      setPreview(compressed); onImageSelected(compressed);
    } catch { toast.error("Failed to process image"); } finally { setIsProcessing(false); }
  }, [onImageSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) processFile(file); e.target.value = ""; }, [processFile]);

  const handleCameraClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobileDevice()) { cameraInputRef.current?.click(); return; }
    try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } } }); streamRef.current = stream; setShowCameraModal(true); }
    catch { toast.error("Camera not available"); }
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas'); canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d'); if (!ctx) { toast.error("Failed to capture photo"); return; }
      ctx.drawImage(videoRef.current, 0, 0); const base64 = canvas.toDataURL('image/jpeg', 0.9);
      closeCameraModal(); const compressed = await compressImage(base64); setPreview(compressed); onImageSelected(compressed);
    } catch { toast.error("Failed to capture photo"); } finally { setIsProcessing(false); }
  }, [onImageSelected, closeCameraModal]);

  const handleDrag = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else if (e.type === "dragleave") setDragActive(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); const file = e.dataTransfer.files?.[0]; if (file) processFile(file); }, [processFile]);
  const clearPreview = useCallback(() => { setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; if (cameraInputRef.current) cameraInputRef.current.value = ""; }, []);

  if (preview) {
    return (<div className="relative"><div className="border-4 border-border rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_hsl(var(--border))]"><img src={preview} alt="Coffee bag preview" className="w-full h-auto max-h-[400px] object-contain bg-muted" /></div>{!disabled && (<Button variant="outline" size="sm" onClick={clearPreview} className="absolute top-2 right-2">{t('scanner.changeImage')}</Button>)}</div>);
  }

  if (isProcessing) {
    return (<div className="border-4 border-dashed border-primary rounded-lg p-8 text-center"><div className="flex flex-col items-center gap-4"><div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div><div><h3 className="font-bangers text-2xl text-foreground mb-1">{t('scanner.processingImage')}</h3><p className="text-muted-foreground text-sm">{t('scanner.optimizing')}</p></div></div></div>);
  }

  return (
    <>
      <div className={`border-4 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-border"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={disabled ? undefined : handleDrop}>
        <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(",")} onChange={handleFileChange} className="hidden" disabled={disabled} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" disabled={disabled} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"><Camera className="w-10 h-10 text-primary" /></div>
          <div><h3 className="font-bangers text-2xl text-foreground mb-1">{t('scanner.scanBag')}</h3><p className="text-muted-foreground text-sm">{t('scanner.dragDrop')}</p></div>
          <div className="flex gap-3 mt-2">
            <Button variant="default" onClick={handleCameraClick} disabled={disabled} className="gap-2"><Camera className="w-4 h-4" />{t('scanner.takePhoto')}</Button>
            <Button variant="outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} disabled={disabled} className="gap-2"><Upload className="w-4 h-4" />{t('scanner.upload')}</Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4"><ImageIcon className="w-3 h-3" /><span>{t('scanner.fileFormat')}</span></div>
        </div>
      </div>
      <Dialog open={showCameraModal} onOpenChange={(open) => !open && closeCameraModal()}>
        <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle className="font-bangers text-2xl">{t('scanner.takeAPhoto')}</DialogTitle></DialogHeader>
          <div className="space-y-4"><div className="border-4 border-border rounded-lg overflow-hidden bg-black shadow-[4px_4px_0px_0px_hsl(var(--border))]"><video ref={videoRef} autoPlay playsInline muted className="w-full h-auto max-h-[400px] object-contain" /></div>
            <div className="flex gap-3 justify-center"><Button onClick={capturePhoto} className="gap-2"><Camera className="w-4 h-4" />{t('scanner.capture')}</Button><Button variant="outline" onClick={closeCameraModal}>{t('scanner.cancel')}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
