'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export default function Modal({
    isOpen, onClose, title, children, size = 'md',
}: ModalProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        }
        return () => {
        document.removeEventListener('keydown', handler);
        document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        />
        <div className={`relative w-full ${sizes[size]} animate-scale-in`}>
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br
                            from-indigo-500/20 via-transparent to-purple-500/10
                            blur-sm" />
            <div className="relative glass rounded-2xl shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between p-6
                            border-b border-[#2a2a3a]">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[#8b8ba7]
                            hover:text-white transition-colors"
                >
                <X size={18} />
                </button>
            </div>
            <div className="p-6">{children}</div>
            </div>
        </div>
        </div>
    );
}