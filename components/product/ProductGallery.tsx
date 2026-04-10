'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: Array<{
    id: string;
    image: string;
    is_primary: boolean;
  }>;
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-200">
        <ShoppingBag className="w-32 h-32 opacity-10" />
      </div>
    );
  }

  const activeImage = images[activeIdx];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
      <div className="flex flex-row md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setActiveIdx(idx)}
            className={cn(
              "relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0",
              idx === activeIdx ? "border-indigo-600 shadow-xl shadow-indigo-100" : "border-gray-100 hover:border-gray-300"
            )}
          >
            <img src={img.image} alt="Thumbnail" className="w-full h-full object-cover" />
            {idx === activeIdx && (
              <div className="absolute inset-0 bg-indigo-600/5" />
            )}
          </button>
        ))}
      </div>

      {/* Main Display */}
      <div className="relative flex-1 aspect-[4/5] md:aspect-square bg-gray-50 rounded-[3rem] overflow-hidden order-1 md:order-2 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            src={activeImage.image}
            alt="Product Display"
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={() => setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              aria-label="Previous Image"
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              aria-label="Next Image"
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
