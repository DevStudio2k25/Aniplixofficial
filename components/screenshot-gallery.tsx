'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ScreenshotGalleryProps {
  screenshots: string[];
  appName: string;
}

export function ScreenshotGallery({ screenshots, appName }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (screenshots.length === 0) return null;

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
      
      {/* Horizontal scrollable thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {screenshots.map((screenshot, index) => (
          <Dialog key={index} open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <div
                className="relative flex-shrink-0 w-32 h-56 bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all group"
                onClick={() => {
                  setSelectedIndex(index);
                  setIsOpen(true);
                }}
              >
                <Image
                  src={screenshot}
                  alt={`${appName} screenshot ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                
                {/* Mobile-like frame */}
                <div className="absolute inset-0 border-2 border-gray-800 rounded-lg pointer-events-none">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black/95">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>

                {/* Navigation buttons */}
                {screenshots.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 z-10 text-white hover:bg-white/20"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 z-10 text-white hover:bg-white/20"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </>
                )}

                {/* Main image */}
                <div className="relative w-full h-full max-w-2xl max-h-full p-8">
                  <Image
                    src={screenshots[selectedIndex]}
                    alt={`${appName} screenshot ${selectedIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedIndex + 1} / {screenshots.length}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        Click on any screenshot to view in full size
      </p>
    </div>
  );
}