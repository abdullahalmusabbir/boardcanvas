// components/annotate/ZoomControls.tsx
'use client';

import { Maximize2, ScanSearch, ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoom: (zoom: number) => void;
  onReset: () => void;
  onFit: () => void;
}

const STEPS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8];
const MIN = 0.25;
const MAX = 8;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function snapZoom(current: number, dir: 'in' | 'out') {
  if (dir === 'in') {
    const next = STEPS.find(s => s > current + 0.001);
    return clamp(next ?? current * 1.25, MIN, MAX);
  } else {
    const next = [...STEPS].reverse().find(s => s < current - 0.001);
    return clamp(next ?? current * 0.8, MIN, MAX);
  }
}

const PRESETS = [
  { label: '25%',  value: 0.25 },
  { label: '50%',  value: 0.5  },
  { label: '100%', value: 1    },
  { label: '200%', value: 2    },
  { label: '400%', value: 4    },
];

export default function ZoomControls({
  zoom, onZoom, onReset, onFit,
}: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-1.5 glass rounded-2xl
                    px-3 py-2 border border-[#2a2a3a]">

      {/* Zoom out */}
      <button
        onClick={() => onZoom(snapZoom(zoom, 'out'))}
        disabled={zoom <= MIN}
        title="Zoom out (scroll down)"
        className="w-7 h-7 flex items-center justify-center rounded-lg
                   text-[#8b8ba7] hover:text-white hover:bg-white/8
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-150"
      >
        <ZoomOut size={15} />
      </button>

      {/* Percentage selector */}
      <div className="relative group">
        <select
          value={PRESETS.find(p => Math.abs(p.value - zoom) < 0.01)?.value ?? ''}
          onChange={e => onZoom(Number(e.target.value))}
          className="appearance-none bg-transparent text-xs font-mono
                     font-bold text-white cursor-pointer text-center
                     border-none outline-none pr-0 pl-0 w-14
                     hover:text-indigo-300 transition-colors"
        >
          {PRESETS.map(p => (
            <option key={p.value} value={p.value}
              className="bg-[#1a1a2e] text-white">
              {p.label}
            </option>
          ))}
          {/* show current if not in presets */}
          {!PRESETS.some(p => Math.abs(p.value - zoom) < 0.01) && (
            <option value="" disabled className="bg-[#1a1a2e] text-white">
              {Math.round(zoom * 100)}%
            </option>
          )}
        </select>
        {/* underline hint */}
        <div className="absolute bottom-0 left-0 right-0 h-px
                        bg-indigo-500/40 opacity-0 group-hover:opacity-100
                        transition-opacity" />
      </div>

      {/* Zoom in */}
      <button
        onClick={() => onZoom(snapZoom(zoom, 'in'))}
        disabled={zoom >= MAX}
        title="Zoom in (scroll up)"
        className="w-7 h-7 flex items-center justify-center rounded-lg
                   text-[#8b8ba7] hover:text-white hover:bg-white/8
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-150"
      >
        <ZoomIn size={15} />
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-[#2a2a3a] mx-0.5" />

      {/* Reset 100% */}
      <button
        onClick={onReset}
        title="Reset to 100%"
        className="w-7 h-7 flex items-center justify-center rounded-lg
                   text-[#8b8ba7] hover:text-white hover:bg-white/8
                   transition-all duration-150"
      >
        <ScanSearch size={14} />
      </button>

      {/* Fit to screen */}
      <button
        onClick={onFit}
        title="Fit to canvas"
        className="w-7 h-7 flex items-center justify-center rounded-lg
                   text-[#8b8ba7] hover:text-white hover:bg-white/8
                   transition-all duration-150"
      >
        <Maximize2 size={14} />
      </button>
    </div>
  );
}