'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Check if Cloudinary is configured
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || cloudName === 'your-cloud-name' || !uploadPreset) {
        // Fallback: Use data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          onChange(dataUrl);
          setSelectedFile(null);
        };
        reader.readAsDataURL(selectedFile);
        return;
      }

      try {
        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', selectedFile);
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
          console.warn('Cloudinary upload failed, using fallback:', data.error);
          // Fallback to data URL
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            onChange(dataUrl);
            setSelectedFile(null);
          };
          reader.readAsDataURL(selectedFile);
          return;
        }

        onChange(data.secure_url);
        setSelectedFile(null);
      } catch (error) {
        console.error('Upload failed, using fallback:', error);
        // Fallback to data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          onChange(dataUrl);
          setSelectedFile(null);
        };
        reader.readAsDataURL(selectedFile);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveSelected = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Uploaded Image */}
      {value && (
        <div>
          <h4 className="text-sm font-medium mb-2">Uploaded Icon</h4>
          <div className="relative group inline-block">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-green-200 bg-green-50">
              <Image
                src={value}
                alt="App icon"
                fill
                className="object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onRemove}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Selected File (Not uploaded yet) */}
      {selectedFile && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Selected File</h4>
            <div className="flex gap-2">
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveSelected}
                disabled={uploading || disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative group inline-block">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-blue-200 bg-blue-50">
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Selected icon"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded truncate">
              {selectedFile.name}
            </div>
          </div>
        </div>
      )}

      {/* Select Button */}
      {!value && !selectedFile && (
        <div
          onClick={handleClick}
          className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground text-center">
              Select App Icon
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
              <strong>Step 1:</strong> Select icon from your computer
            </div>
            <div className="mb-1">
              <strong>Step 2:</strong> Click "Upload to Cloudinary" button
            </div>
            <div>
              <strong>Step 3:</strong> Link will be stored in Firebase automatically
            </div>
          </>
        )}
        <div className="mt-1">Recommended: 512x512px, PNG or JPG, max 5MB</div>
      </div>
    </div>
  );
}