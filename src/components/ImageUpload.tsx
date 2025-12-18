import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  className?: string;
}

export const ImageUpload = ({ label, value, onChange, className }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload JPG, PNG, or WEBP images only',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        try {
          const url = await uploadImage(base64);
          onChange(url);
          toast({
            title: 'Image uploaded',
            description: 'Image has been uploaded successfully',
          });
        } catch (error) {
          console.error('Upload error:', error);
          toast({
            title: 'Upload failed',
            description: 'Failed to upload image. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: 'Error',
        description: 'Failed to process image',
        variant: 'destructive',
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="input-label">{label}</label>
      
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-border bg-muted/50">
          <img
            src={value}
            alt={label}
            className="w-full h-40 object-contain bg-background"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            'image-upload-zone',
            isDragging && 'border-primary bg-primary/10',
            isUploading && 'opacity-50 pointer-events-none'
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            className="hidden"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center gap-2 py-4">
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            ) : (
              <div className="p-3 rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="text-sm">
              <span className="font-medium text-primary">
                {isUploading ? 'Uploading...' : 'Upload image'}
              </span>
              {!isUploading && <span className="text-muted-foreground"> or drag & drop</span>}
            </div>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP</p>
          </div>
        </div>
      )}
    </div>
  );
};
