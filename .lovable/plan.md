

# Plan: Fix Scanner Camera Button and File Browser Reopening Bug

## Overview
Fix two issues in the ScanUploader component: the file browser reopening bug and enable the camera button to work on both mobile AND desktop devices.

## Issues to Fix

### Issue 1: File Browser Reopens After Upload
**Root Cause:** The outer container `div` has an `onClick` handler that can trigger unexpectedly, causing the file browser to reopen after a file is selected.

### Issue 2: Camera Button Needs to Work on All Devices
**Current Behavior:**
- Mobile: Opens rear camera (works via `capture` attribute)
- Desktop: Opens file browser (broken - `capture` attribute is ignored)

**Desired Behavior:**
- Mobile: Opens native camera app
- Desktop: Opens webcam preview modal with capture button

---

## Solution

### File to Modify
`src/features/scanner/components/ScanUploader.tsx`

### Changes Required

#### 1. Remove Container onClick Handler (Line ~207)
Remove the `onClick` from the outer container div to prevent accidental file browser triggers:

```typescript
// Remove this line from the container div:
onClick={disabled ? undefined : () => fileInputRef.current?.click()}
```

#### 2. Reset Input Value After File Selection
In `handleFileChange`, reset the input value to prevent stale state:

```typescript
const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    processFile(file);
  }
  // Reset input to allow re-selecting and prevent reopening
  e.target.value = "";
}, [processFile]);
```

#### 3. Add State for Desktop Camera Modal
```typescript
const [showCameraModal, setShowCameraModal] = useState(false);
const videoRef = useRef<HTMLVideoElement>(null);
const streamRef = useRef<MediaStream | null>(null);
```

#### 4. Add Mobile Detection Helper
```typescript
const isMobileDevice = useCallback(() => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}, []);
```

#### 5. Update Camera Button Handler
```typescript
const handleCameraClick = useCallback(async (e: React.MouseEvent) => {
  e.stopPropagation();
  
  // On mobile, use the native camera input with capture attribute
  if (isMobileDevice()) {
    cameraInputRef.current?.click();
    return;
  }
  
  // On desktop, use MediaDevices API for webcam access
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
    });
    streamRef.current = stream;
    setShowCameraModal(true);
  } catch (err) {
    console.error('Camera access error:', err);
    toast.error("Camera not available", {
      description: "Please allow camera access or use the Upload button instead."
    });
  }
}, [isMobileDevice]);
```

#### 6. Add Capture and Close Functions
```typescript
const capturePhoto = useCallback(async () => {
  if (!videoRef.current) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.drawImage(videoRef.current, 0, 0);
  const base64 = canvas.toDataURL('image/jpeg', 0.9);
  
  closeCameraModal();
  
  // Compress and process the captured image
  const compressed = await compressImage(base64);
  setPreview(compressed);
  onImageSelected(compressed);
}, [onImageSelected, closeCameraModal]);

const closeCameraModal = useCallback(() => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }
  setShowCameraModal(false);
}, []);
```

#### 7. Add useEffect for Video Stream
```typescript
useEffect(() => {
  if (showCameraModal && videoRef.current && streamRef.current) {
    videoRef.current.srcObject = streamRef.current;
  }
}, [showCameraModal]);
```

#### 8. Add Camera Modal UI
Using the existing Dialog component from shadcn/ui:

```tsx
{/* Desktop Camera Modal */}
<Dialog open={showCameraModal} onOpenChange={(open) => !open && closeCameraModal()}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle className="font-bangers text-2xl">Take a Photo</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <div className="border-4 border-border rounded-lg overflow-hidden bg-black">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted
          className="w-full h-auto max-h-[400px] object-contain"
        />
      </div>
      <div className="flex gap-3 justify-center">
        <Button onClick={capturePhoto} className="gap-2">
          <Camera className="w-4 h-4" />
          Capture
        </Button>
        <Button variant="outline" onClick={closeCameraModal}>
          Cancel
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

#### 9. Update Button Click Handlers
```tsx
<Button
  variant="default"
  onClick={handleCameraClick}  // Use the new unified handler
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
```

---

## Imports to Add

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
```

---

## User Flow After Implementation

### Mobile Device - "Take Photo" Button
1. User taps "Take Photo"
2. Native camera app opens (rear camera)
3. User takes photo
4. Photo is processed and displayed

### Desktop Device - "Take Photo" Button
1. User clicks "Take Photo"
2. Browser requests webcam permission
3. Camera modal opens with live video preview
4. User clicks "Capture" to take photo
5. Photo is processed, modal closes

### Both Platforms - "Upload" Button
1. User clicks "Upload"
2. Standard file browser opens
3. User selects image file
4. Image is processed and displayed

---

## Summary

This implementation ensures:
- Camera button works on **mobile** (native camera via `capture` attribute)
- Camera button works on **desktop** (webcam via MediaDevices API with modal)
- File browser no longer reopens unexpectedly after file selection
- Upload button continues to work as expected on all platforms

