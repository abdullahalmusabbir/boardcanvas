'use client';

import { useRef } from 'react';
import { AnnotationImage } from '@/types';
import { ChevronLeft, ChevronRight, Trash2, ImageIcon } from 'lucide-react';

interface ImageSliderProps {
    images: AnnotationImage[];
    activeId: number | null;
    onSelect: (image: AnnotationImage) => void;
    onDelete: (id: number) => void;
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ImageSlider({
    images, activeId, onSelect, onDelete,
}: ImageSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({
        left: dir === 'left' ? -220 : 220,
        behavior: 'smooth',
        });
    };

    if (images.length === 0) {
        return (
        <div className="flex items-center justify-center gap-2 py-6
                        text-[#4a4a6a] text-sm">
            <ImageIcon size={16} />
            No images uploaded yet
        </div>
        );
    }

    return (
        <div className="relative flex items-center gap-2">
        {/* Left arrow */}
        <button
            onClick={() => scroll('left')}
            className="shrink-0 w-8 h-8 flex items-center justify-center
                    glass rounded-xl text-[#8b8ba7] hover:text-white
                    border border-[#2a2a3a] hover:border-indigo-500/40
                    transition-all z-10"
        >
            <ChevronLeft size={16} />
        </button>

        {/* Scrollable strip */}
        <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto flex-1 pb-1
                    scrollbar-thin scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
        >
            {images.map(img => {
            const isActive = img.id === activeId;
            const polyCount = img.polygons?.length ?? 0;
            const src = img.image.startsWith('http')
                ? img.image
                : `${BASE}${img.image}`;

            return (
                <div
                key={img.id}
                className={`relative group shrink-0 cursor-pointer
                    rounded-xl overflow-hidden border-2 transition-all duration-200
                    ${isActive
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/25'
                    : 'border-[#2a2a3a] hover:border-[#3a3a5a]'
                    }`}
                style={{ width: 120, height: 80 }}
                onClick={() => onSelect(img)}
                >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={img.title || `Image ${img.id}`}
                    className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className={`absolute inset-0 transition-all duration-200
                    ${isActive
                    ? 'bg-indigo-600/20'
                    : 'bg-black/20 group-hover:bg-black/10'
                    }`}
                />

                {/* Polygon count badge */}
                {polyCount > 0 && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5
                                    bg-indigo-600/80 rounded-md text-[9px]
                                    font-bold text-white border border-indigo-400/30">
                    {polyCount}
                    </div>
                )}

                {/* Active indicator */}
                {isActive && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2
                                    w-4 h-1 bg-indigo-400 rounded-full" />
                )}

                {/* Delete button */}
                <button
                    onClick={e => {
                    e.stopPropagation();
                    onDelete(img.id);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 flex items-center
                            justify-center bg-red-500/80 hover:bg-red-500
                            rounded-lg opacity-0 group-hover:opacity-100
                            transition-all"
                >
                    <Trash2 size={10} className="text-white" />
                </button>

                {/* Title tooltip */}
                {img.title && (
                    <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1
                                    bg-black/60 text-[9px] text-white truncate
                                    opacity-0 group-hover:opacity-100
                                    transition-opacity">
                    {img.title}
                    </div>
                )}
                </div>
            );
            })}
        </div>

        {/* Right arrow */}
        <button
            onClick={() => scroll('right')}
            className="shrink-0 w-8 h-8 flex items-center justify-center
                    glass rounded-xl text-[#8b8ba7] hover:text-white
                    border border-[#2a2a3a] hover:border-indigo-500/40
                    transition-all z-10"
        >
            <ChevronRight size={16} />
        </button>
        </div>
    );
}