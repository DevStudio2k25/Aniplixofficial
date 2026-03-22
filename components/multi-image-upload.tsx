'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Image as ImageIcon, Plus, Upload } from 'lucide-react';
import Image from 'next/image';

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

export function MultiImageUpload({ value = [], onChange, disabled, maxImages = 5 }: MultiImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (selectedFiles.length + files.length > maxImages) {
      alert(`You can only select up to ${maxImages} images`);
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB`);
        continue;
      }

      validFiles.push(file);
    }

    setSelectedFiles([...selectedFiles, ...validFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of selectedFiles) {
        // Check if Cloudinary is configured
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || cloudName === 'your-cloud-name' || !uploadPreset) {
          // Fallback: Use data URL
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
          newUrls.push(dataUrl);
          continue;
        }

        try {
          // Upload to Cloudinary
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          const data = await response.json();

          if (!response.ok || data.error) {
            console.warn('Cloudinary upload failed for', file.name, '- using fallback');
            // Fallback to data URL
            const reader = new FileReader();
            const dataUrl = await new Promise<string>((resolve) => {
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });
            newUrls.push(dataUrl);
          } else {
            newUrls.push(data.secure_url);
          }
        } catch (error) {
          console.error('Upload failed for', file.name, '- using fallback');
          // Fallback to data URL
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
          newUrls.push(dataUrl);
        }
      }

      // Update the URLs and clear selected files
      onChange([...value, ...newUrls]);
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload some images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveSelected = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleRemoveUploaded = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Uploaded Images */}
      {value.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Uploaded Screenshots ({value.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-green-200 bg-green-50">
                  <Image
                    src={url}
                    alt={`Screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveUploaded(index)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Files (Not uploaded yet) */}
      {selectedFiles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h4>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={uploading || disabled}
              size="sm"
              className="gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload to Cloudinary
                </>
              )}
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-blue-200 bg-blue-50">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveSelected(index)}
                  disabled={disabled || uploading}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add More Button */}
      {(value.length + selectedFiles.length) < maxImages && (
        <div
          onClick={handleClick}
          className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground text-center">
              Select Screenshots ({value.length + selectedFiles.length}/{maxImages})
            </span>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME === 'your-cloud-name' ? (
          <span className="text-yellow-600">
            ⚠️ Cloudinary not configured - using local preview
          </span>
        ) : (
          <>
            <div className="mb-1">
              <strong>Step 1:</strong> Select images from your computer
            </div>
            <div className="mb-1">
              <strong>Step 2:</strong> Click "Upload to Cloudinary" button
            </div>
            <div>
              <strong>Step 3:</strong> Links will be stored in Firebase automatically
            </div>
          </>
        )}
      </div>
    </div>
  );
}