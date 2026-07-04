'use client';

import { Polygon } from '@/types';
import { Trash2, Eye, EyeOff, MousePointer2 } from 'lucide-react';

interface PolygonListProps {
    polygons: Polygon[];
    selectedId: number | null;
    hiddenIds: Set<number>;
    onSelect: (id: number | null) => void;
    onToggleHide: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function PolygonList({
    polygons, selectedId, hiddenIds,
    onSelect, onToggleHide, onDelete,
}: PolygonListProps) {
    if (polygons.length === 0) {
        return (
        <div className="flex flex-col items-center justify-center py-8
                        text-center">
            <div className="w-10 h-10 bg-[#1a1a2e] rounded-xl flex items-center
                            justify-center mb-3">
            <MousePointer2 size={18} className="text-[#4a4a6a]" />
            </div>
            <p className="text-xs text-[#4a4a6a] leading-relaxed">
            No polygons yet.<br />
            Switch to Draw mode and click the canvas.
            </p>
        </div>
        );
    }

    return (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {polygons.map((poly, idx) => {
            const isSelected = poly.id === selectedId;
            const isHidden = hiddenIds.has(poly.id);

            return (
            <div
                key={poly.id}
                onClick={() => onSelect(isSelected ? null : poly.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer
                border transition-all duration-150 group
                ${isSelected
                    ? 'border-indigo-500/50 bg-indigo-500/10'
                    : 'border-[#2a2a3a] hover:border-[#3a3a5a] hover:bg-white/2'
                }
                ${isHidden ? 'opacity-40' : ''}`}
            >
                {/* color dot */}
                <div
                className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                style={{ backgroundColor: poly.color }}
                />

                {/* label */}
                <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                    {poly.label || `Polygon ${idx + 1}`}
                </p>
                <p className="text-[10px] text-[#4a4a6a] mt-0.5">
                    {poly.points.length} points
                </p>
                </div>

                {/* actions */}
                <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={e => { e.stopPropagation(); onToggleHide(poly.id); }}
                    className="p-1.5 rounded-lg text-[#8b8ba7] hover:text-white
                            hover:bg-white/5 transition-all"
                    title={isHidden ? 'Show' : 'Hide'}
                >
                    {isHidden
                    ? <EyeOff size={12} />
                    : <Eye size={12} />
                    }
                </button>
                <button
                    onClick={e => { e.stopPropagation(); onDelete(poly.id); }}
                    className="p-1.5 rounded-lg text-[#8b8ba7] hover:text-red-400
                            hover:bg-red-500/10 transition-all"
                    title="Delete"
                >
                    <Trash2 size={12} />
                </button>
                </div>
            </div>
            );
        })}
        </div>
    );
}