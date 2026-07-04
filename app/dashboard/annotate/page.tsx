// app/dashboard/annotate/page.tsx
'use client';

import AnnotationCanvas, {
    CanvasHandle,
} from '@/components/annotate/AnnotationCanvas';
import ImageSlider from '@/components/annotate/ImageSlider';
import ImageUploader from '@/components/annotate/ImageUploader';
import PolygonList from '@/components/annotate/PolygonList';
import ZoomControls from '@/components/annotate/ZoomControls';
import Button from '@/components/ui/Button';
import { imageApi, polygonApi } from '@/lib/api';
import { AnnotationImage, Polygon, PolygonPoint } from '@/types';
import {
    AlertCircle,
    CheckCircle2,
    ChevronDown, ChevronUp,
    Hand,
    ImageIcon,
    Layers,
    MousePointer2, Pencil,
    RefreshCw,
    Save, Trash2,
} from 'lucide-react';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

type Tool = 'draw' | 'select' | 'pan';

const PRESET_COLORS = [
  '#6366f1', '#a855f7', '#ec4899', '#10b981',
  '#f59e0b', '#06b6d4', '#ef4444', '#84cc16',
];

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function AnnotatePage() {
  /* images */
  const [images,        setImages]        = useState<AnnotationImage[]>([]);
  const [activeImage,   setActiveImage]   = useState<AnnotationImage | null>(null);
  const [loadingImages, setLoadingImages] = useState(true);

  /* polygons */
  const [savedPolygons,    setSavedPolygons]    = useState<Polygon[]>([]);
  const [selectedPolygonId,setSelectedPolygonId] = useState<number | null>(null);
  const [hiddenIds,        setHiddenIds]        = useState<Set<number>>(new Set());

  /* tools */
  const [tool,        setTool]        = useState<Tool>('draw');
  const [activeColor, setActiveColor] = useState(PRESET_COLORS[0]);
  const [activeLabel, setActiveLabel] = useState('');

  /* zoom */
  const [zoom, setZoom] = useState(1);

  /* ui */
  const [saving,       setSaving]       = useState(false);
  const [saveSuccess,  setSaveSuccess]  = useState(false);
  const [saveError,    setSaveError]    = useState('');
  const [uploaderOpen, setUploaderOpen] = useState(true);
  const [sidebarOpen,  setSidebarOpen]  = useState(true);

  const canvasRef     = useRef<CanvasHandle>(null);
  const containerRef  = useRef<HTMLDivElement>(null);

  /* ── fetch images ── */
  const fetchImages = useCallback(async () => {
    setLoadingImages(true);
    try {
      const data = await imageApi.list();
      setImages(data);
      if (data.length > 0 && !activeImage) {
        setActiveImage(data[0]);
        setSavedPolygons(data[0].polygons ?? []);
      }
    } catch (err) {
      console.error('Failed to load images', err);
    } finally {
      setLoadingImages(false);
    }
  }, [activeImage]);

  useEffect(() => { fetchImages(); }, []); // eslint-disable-line

  /* ── select image ── */
  const handleSelectImage = (img: AnnotationImage) => {
    canvasRef.current?.cancelDraft();
    setActiveImage(img);
    setSavedPolygons(img.polygons ?? []);
    setSelectedPolygonId(null);
    setHiddenIds(new Set());
    setZoom(1);
  };

  /* ── uploaded ── */
  const handleUploaded = (img: AnnotationImage) => {
    setImages(prev => [...prev, img]);
    handleSelectImage(img);
  };

  /* ── delete image ── */
  const handleDeleteImage = async (id: number) => {
    if (!confirm('Delete this image and all its annotations?')) return;
    try {
      await imageApi.delete(id);
      const next = images.filter(i => i.id !== id);
      setImages(next);
      if (activeImage?.id === id) {
        const fallback = next[0] ?? null;
        setActiveImage(fallback);
        setSavedPolygons(fallback?.polygons ?? []);
        setSelectedPolygonId(null);
        setZoom(1);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  /* ── polygon complete ── */
  const handlePolygonComplete = async (
    points: PolygonPoint[], label: string, color: string,
  ) => {
    if (!activeImage) return;
    try {
      const poly = await polygonApi.create(activeImage.id, {
        points, label: label || 'Region', color,
      });
      setSavedPolygons(prev => [...prev, poly]);
      setImages(prev =>
        prev.map(img =>
          img.id === activeImage.id
            ? { ...img, polygons: [...(img.polygons ?? []), poly] }
            : img
        )
      );
    } catch (err) {
      console.error('Failed to save polygon', err);
    }
  };

  /* ── delete polygon ── */
  const handleDeletePolygon = async (polyId: number) => {
    try {
      await polygonApi.delete(polyId);
      setSavedPolygons(prev => prev.filter(p => p.id !== polyId));
      setImages(prev =>
        prev.map(img =>
          img.id === activeImage?.id
            ? { ...img, polygons: img.polygons.filter(p => p.id !== polyId) }
            : img
        )
      );
      if (selectedPolygonId === polyId) setSelectedPolygonId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  /* ── toggle visibility ── */
  const toggleHide = (id: number) => {
    setHiddenIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── bulk save ── */
  const handleBulkSave = async () => {
    if (!activeImage) return;
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      await polygonApi.bulkSave(
        activeImage.id,
        savedPolygons.map(p => ({
          label: p.label, color: p.color, points: p.points,
        }))
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  /* ── clear all ── */
  const handleClearAll = async () => {
    if (!activeImage) return;
    if (!confirm('Remove all polygons from this image?')) return;
    try {
      await polygonApi.bulkSave(activeImage.id, []);
      setSavedPolygons([]);
      setImages(prev =>
        prev.map(img =>
          img.id === activeImage.id ? { ...img, polygons: [] } : img
        )
      );
      setSelectedPolygonId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Clear failed');
    }
  };

  /* ── zoom helpers ── */
  const handleZoomChange = (z: number) => setZoom(clamp(z, MIN_ZOOM, MAX_ZOOM));

  const handleResetZoom = () => {
    canvasRef.current?.resetZoom();
    setZoom(1);
  };

  /* fit: calculate zoom so image fills container width */
  const handleFitZoom = () => {
    const img = activeImage;
    if (!img || !containerRef.current) return;

    /* rough container width minus sidebar */
    const containerW = containerRef.current.clientWidth;
    const imgEl = new window.Image();
    imgEl.src = img.image.startsWith('http')
      ? img.image
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${img.image}`;

    const applyFit = (naturalW: number) => {
      const fitZ = clamp(containerW / naturalW, MIN_ZOOM, MAX_ZOOM);
      canvasRef.current?.resetZoom();
      setZoom(fitZ);
    };

    if (imgEl.complete && imgEl.naturalWidth > 0) {
      applyFit(imgEl.naturalWidth);
    } else {
      imgEl.onload = () => applyFit(imgEl.naturalWidth);
    }
  };

  /* keyboard shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'd' || e.key === 'D') setTool('draw');
      if (e.key === 's' || e.key === 'S') setTool('select');
      if (e.key === 'h' || e.key === 'H') setTool('pan');
      if (e.key === 'Escape') canvasRef.current?.cancelDraft();
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleBulkSave();
      }
      if (e.key === '=' || e.key === '+')
        setZoom(z => clamp(z * 1.2, MIN_ZOOM, MAX_ZOOM));
      if (e.key === '-')
        setZoom(z => clamp(z * 0.8, MIN_ZOOM, MAX_ZOOM));
      if (e.key === '0') handleResetZoom();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleBulkSave]); // eslint-disable-line

  /* ── tool buttons config ── */
  const tools = [
    { key: 'draw'   as Tool, icon: Pencil,        label: 'Draw',   shortcut: 'D' },
    { key: 'select' as Tool, icon: MousePointer2,  label: 'Select', shortcut: 'S' },
    { key: 'pan'    as Tool, icon: Hand,           label: 'Pan',    shortcut: 'H' },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      {/* ══ Header ══ */}
      <div className="border-b border-[#2a2a3a] bg-[#0d0d14]/80
                      backdrop-blur-sm sticky top-0 z-30">
        <div className="px-6 py-4 flex items-center justify-between
                        gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-pink-600/20 border border-pink-500/30
                            rounded-xl flex items-center justify-center">
              <ImageIcon size={18} className="text-pink-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                Annotation Tool
              </h1>
              <p className="text-xs text-[#8b8ba7]">
                {images.length} image{images.length !== 1 ? 's' : ''} ·{' '}
                {activeImage
                  ? `${savedPolygons.length} polygon${savedPolygons.length !== 1 ? 's' : ''}`
                  : 'Select an image'}
              </p>
            </div>
          </div>

          {activeImage && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Zoom controls in header */}
              <ZoomControls
                zoom={zoom}
                onZoom={handleZoomChange}
                onReset={handleResetZoom}
                onFit={handleFitZoom}
              />

              <div className="w-px h-6 bg-[#2a2a3a]" />

              {saveSuccess && (
                <span className="flex items-center gap-1.5 text-xs
                                 text-emerald-400 font-medium">
                  <CheckCircle2 size={14} /> Saved!
                </span>
              )}
              {saveError && (
                <span className="flex items-center gap-1.5 text-xs
                                 text-red-400 font-medium">
                  <AlertCircle size={14} /> {saveError}
                </span>
              )}

              <Button
                variant="ghost" size="sm"
                onClick={fetchImages} disabled={loadingImages}
              >
                <RefreshCw size={14}
                  className={loadingImages ? 'animate-spin' : ''} />
                Refresh
              </Button>
              <Button
                variant="danger" size="sm"
                onClick={handleClearAll}
                disabled={savedPolygons.length === 0}
              >
                <Trash2 size={14} /> Clear All
              </Button>
              <Button size="sm" loading={saving} onClick={handleBulkSave}>
                <Save size={14} /> Save All
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">

        {/* ══ Left sidebar ══ */}
        <div className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0
                        lg:border-r border-[#2a2a3a] bg-[#0d0d14]
                        flex-shrink-0 flex flex-col">

          {/* Upload */}
          <div className="border-b border-[#2a2a3a]">
            <button
              onClick={() => setUploaderOpen(v => !v)}
              className="w-full flex items-center justify-between px-5 py-3.5
                         text-sm font-semibold text-white hover:bg-white/3
                         transition-colors"
            >
              <div className="flex items-center gap-2">
                <ImageIcon size={15} className="text-indigo-400" />
                Upload Image
              </div>
              {uploaderOpen
                ? <ChevronUp size={15} className="text-[#8b8ba7]" />
                : <ChevronDown size={15} className="text-[#8b8ba7]" />
              }
            </button>
            {uploaderOpen && (
              <div className="px-4 pb-4">
                <ImageUploader onUploaded={handleUploaded} />
              </div>
            )}
          </div>

          {/* Image strip */}
          <div className="border-b border-[#2a2a3a] px-4 py-4">
            <p className="text-xs font-semibold text-[#8b8ba7]
                          uppercase tracking-wider mb-3">
              Images ({images.length})
            </p>
            {loadingImages
              ? <div className="h-20 bg-[#111118] rounded-xl animate-pulse" />
              : (
                <ImageSlider
                  images={images}
                  activeId={activeImage?.id ?? null}
                  onSelect={handleSelectImage}
                  onDelete={handleDeleteImage}
                />
              )
            }
          </div>

          {/* Tool selector */}
          {activeImage && (
            <div className="border-b border-[#2a2a3a] px-4 py-4">
              <p className="text-xs font-semibold text-[#8b8ba7]
                            uppercase tracking-wider mb-3">
                Tool
              </p>
              <div className="flex gap-2">
                {tools.map(({ key, icon: Icon, label, shortcut }) => (
                  <button
                    key={key}
                    onClick={() => setTool(key)}
                    title={`${label} (${shortcut})`}
                    className={`flex-1 flex flex-col items-center gap-1
                      py-2.5 rounded-xl text-xs font-semibold border
                      transition-all duration-200
                      ${tool === key
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                        : 'border-[#2a2a3a] text-[#8b8ba7] hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                    <span className="text-[9px] opacity-50">[{shortcut}]</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color + Label (draw mode only) */}
          {activeImage && tool === 'draw' && (
            <div className="border-b border-[#2a2a3a] px-4 py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b8ba7]
                                  uppercase tracking-wider mb-2">
                  Label
                </label>
                <input
                  value={activeLabel}
                  onChange={e => setActiveLabel(e.target.value)}
                  placeholder="e.g. Car, Person…"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3a]
                             rounded-xl text-white text-sm placeholder-[#3a3a5a]
                             focus:outline-none focus:border-indigo-500/60
                             focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b8ba7]
                                  uppercase tracking-wider mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setActiveColor(c)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all
                        hover:scale-110
                        ${activeColor === c
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent'
                        }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeColor}
                    onChange={e => setActiveColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer bg-transparent
                               border border-[#2a2a3a] p-0.5"
                  />
                  <span className="text-xs text-[#8b8ba7] font-mono">
                    {activeColor}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Polygon list */}
          {activeImage && (
            <div className="flex-1 px-4 py-4 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setSidebarOpen(v => !v)}
                  className="flex items-center gap-2 text-xs font-semibold
                             text-[#8b8ba7] uppercase tracking-wider
                             hover:text-white transition-colors"
                >
                  <Layers size={13} />
                  Polygons ({savedPolygons.length})
                  {sidebarOpen
                    ? <ChevronUp size={13} />
                    : <ChevronDown size={13} />
                  }
                </button>

                {selectedPolygonId !== null && (
                  <button
                    onClick={() => handleDeletePolygon(selectedPolygonId)}
                    className="flex items-center gap-1 text-xs text-red-400
                               hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                )}
              </div>

              {sidebarOpen && (
                <PolygonList
                  polygons={savedPolygons}
                  selectedId={selectedPolygonId}
                  hiddenIds={hiddenIds}
                  onSelect={setSelectedPolygonId}
                  onToggleHide={toggleHide}
                  onDelete={handleDeletePolygon}
                />
              )}
            </div>
          )}
        </div>

        {/* ══ Canvas area ══ */}
        <div ref={containerRef} className="flex-1 p-6 min-w-0">

          {/* Keyboard shortcut bar */}
          {activeImage && (
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {[
                { label: 'D — Draw' },
                { label: 'S — Select' },
                { label: 'H — Pan' },
                { label: '+ / − — Zoom' },
                { label: '0 — Reset' },
                { label: 'Scroll — Zoom' },
                { label: '⌘S — Save' },
              ].map(({ label }) => (
                <span
                  key={label}
                  className="text-[10px] text-[#4a4a6a] font-mono
                             bg-[#111118] border border-[#2a2a3a]
                             px-2 py-0.5 rounded-lg"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!activeImage && !loadingImages && (
            <div className="h-full flex flex-col items-center
                            justify-center text-center gap-4">
              <div className="w-20 h-20 bg-[#111118] rounded-3xl
                              flex items-center justify-center
                              border border-[#2a2a3a]">
                <ImageIcon size={36} className="text-[#2a2a3a]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  No image selected
                </h3>
                <p className="text-sm text-[#8b8ba7]">
                  Upload an image on the left to get started.
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {loadingImages && (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-indigo-500
                                border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#8b8ba7]">Loading images…</p>
              </div>
            </div>
          )}

          {/* Canvas */}
          {activeImage && !loadingImages && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white truncate">
                  {activeImage.title || `Image #${activeImage.id}`}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#8b8ba7]">
                  <span>
                    {savedPolygons.length} polygon
                    {savedPolygons.length !== 1 ? 's' : ''}
                  </span>
                  <span
                    className="font-mono font-bold text-indigo-400
                               bg-indigo-600/15 px-2 py-0.5 rounded-lg
                               border border-indigo-500/20"
                  >
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
              </div>

              <AnnotationCanvas
                ref={canvasRef}
                image={activeImage}
                savedPolygons={savedPolygons}
                activeColor={activeColor}
                activeLabel={activeLabel || 'Region'}
                tool={tool}
                hiddenIds={hiddenIds}
                onPolygonComplete={handlePolygonComplete}
                onSelectPolygon={p => setSelectedPolygonId(p?.id ?? null)}
                selectedPolygonId={selectedPolygonId}
                zoom={zoom}
                onZoomChange={handleZoomChange}
              />

              <div className="flex items-center justify-between
                              text-xs text-[#4a4a6a] px-1">
                <span>
                  Uploaded{' '}
                  {new Date(activeImage.uploaded_at).toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric' }
                  )}
                </span>
                <span>Middle-mouse drag = pan</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}