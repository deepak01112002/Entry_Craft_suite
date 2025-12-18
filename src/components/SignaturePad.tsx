import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, Upload, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImageUpload } from './ImageUpload';

interface SignaturePadProps {
  value?: string;
  onChange: (signature: string | undefined) => void;
}

export const SignaturePad = ({ value, onChange }: SignaturePadProps) => {
  const sigRef = useRef<SignatureCanvas>(null);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');

  const handleClear = () => {
    sigRef.current?.clear();
    onChange(undefined);
  };

  const handleEnd = async () => {
    if (sigRef.current) {
      const dataUrl = sigRef.current.toDataURL('image/png');
      // Upload signature to Cloudinary
      try {
        const { uploadImage } = await import('@/lib/api');
        const url = await uploadImage(dataUrl);
        onChange(url);
      } catch (error) {
        console.error('Failed to upload signature:', error);
        // Fallback to base64 if upload fails
        onChange(dataUrl);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={mode === 'draw' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('draw')}
        >
          <PenTool className="h-4 w-4 mr-1" />
          Draw
        </Button>
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </Button>
      </div>

      {mode === 'draw' ? (
        <div className="space-y-2">
          <div className="signature-canvas overflow-hidden">
            <SignatureCanvas
              ref={sigRef}
              canvasProps={{
                className: 'w-full h-40',
                style: { width: '100%', height: '160px' },
              }}
              backgroundColor="white"
              onEnd={handleEnd}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            <Eraser className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      ) : (
        <ImageUpload
          label=""
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};
