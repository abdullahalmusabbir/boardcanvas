'use client';

import { useRef, useState } from 'react';
import { imageApi } from '@/lib/api';
import { AnnotationImage } from '@/types';
import { Upload, ImageIcon, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
    onUploaded: (image: AnnotationImage) => void;
}

export default function ImageUploader({ onUploaded }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<string | null>(null);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];

        /* validate */
        if (!file.type.startsWith('image/')) {
        setError('Only image files are supported.');
        return;
        }
        if (file.size > 20 * 1024 * 1024) {
        setError('Image must be smaller than 20 MB.');
        return;
        }

        setError('');
        setPreview(URL.createObjectURL(file));
        setUploading(true);

        try {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('title', file.name.replace(/\.[^/.]+$/, ''));
        const uploaded = await imageApi.upload(fd);
        onUploaded(uploaded);
        setPreview(null);
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        setPreview(null);
        } finally {
        setUploading(false);
        /* reset input so same file can be re-uploaded */
        if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
        <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
            }}
            className={`relative flex flex-col items-center justify-center
            gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer
            transition-all duration-300
            ${dragging
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                : 'border-[#2a2a3a] hover:border-indigo-500/60 hover:bg-indigo-500/5'
            }
            ${uploading ? 'pointer-events-none opacity-70' : ''}`}
        >
            {uploading ? (
            <>
                {preview && (
                <div className="w-16 h-16 rounded-xl overflow-hidden mb-1 border
                                border-[#2a2a3a]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                    />
                </div>
                )}
                <Loader2 size={24} className="text-indigo-400 animate-spin" />
                <p className="text-sm text-[#8b8ba7] font-medium">Uploading…</p>
            </>
            ) : (
            <>
                <div className="w-14 h-14 bg-indigo-600/15 border border-indigo-500/30
                                rounded-2xl flex items-center justify-center">
                <Upload size={24} className="text-indigo-400" />
                </div>
                <div className="text-center">
                <p className="text-sm font-semibold text-white mb-1">
                    Drop an image here
                </p>
                <p className="text-xs text-[#8b8ba7]">
                    or click to browse · PNG, JPG, WEBP · max 20 MB
                </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                <ImageIcon size={12} className="text-[#4a4a6a]" />
                <span className="text-[11px] text-[#4a4a6a]">
                    Multiple uploads supported
                </span>
                </div>
            </>
            )}
        </div>

        {error && (
            <div className="flex items-center gap-2 mt-3 px-4 py-3 bg-red-500/10
                            border border-red-500/20 rounded-xl">
            <X size={14} className="text-red-400 shrink-0" />
            <p className="text-xs text-red-400">{error}</p>
            </div>
        )}

        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
        />
        </div>
    );
}