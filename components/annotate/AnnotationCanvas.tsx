// components/annotate/AnnotationCanvas.tsx
'use client';

import { AnnotationImage, Polygon, PolygonPoint } from '@/types';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

export interface CanvasHandle {
  getSavedPolygons: () => Polygon[];
  getDraftPolygon: () => { points: PolygonPoint[]; label: string; color: string } | null;
  cancelDraft: () => void;
  resetZoom: () => void;
}

interface Props {
  image: AnnotationImage;
  savedPolygons: Polygon[];
  activeColor: string;
  activeLabel: string;
  tool: 'draw' | 'select' | 'pan';
  hiddenIds: Set<number>;
  onPolygonComplete: (points: PolygonPoint[], label: string, color: string) => void;
  onSelectPolygon: (polygon: Polygon | null) => void;
  selectedPolygonId: number | null;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const CLOSE_RADIUS = 12;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;

function dist(a: PolygonPoint, b: PolygonPoint) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

const AnnotationCanvas = forwardRef<CanvasHandle, Props>(({
  image, savedPolygons, activeColor, activeLabel,
  tool, hiddenIds, onPolygonComplete,
  onSelectPolygon, selectedPolygonId,
  zoom, onZoomChange,
}, ref) => {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const containerRef    = useRef<HTMLDivElement>(null);
  const imgRef          = useRef<HTMLImageElement | null>(null);
  const animFrameRef    = useRef<number>(0);

  const [imgLoaded,   setImgLoaded]   = useState(false);
  const [draftPoints, setDraftPoints] = useState<PolygonPoint[]>([]);
  const [mousePos,    setMousePos]    = useState<PolygonPoint | null>(null);
  const [canClose,    setCanClose]    = useState(false);
  const [canvasSize,  setCanvasSize]  = useState({ w: 800, h: 500 });

  /* pan state */
  const [offset,   setOffset]   = useState({ x: 0, y: 0 });
  const isPanning  = useRef(false);
  const panStart   = useRef({ x: 0, y: 0 });
  const offsetSnap = useRef({ x: 0, y: 0 });

  /* ── expose handle ── */
  useImperativeHandle(ref, () => ({
    getSavedPolygons: () => savedPolygons,
    getDraftPolygon: () =>
      draftPoints.length > 0
        ? { points: draftPoints, label: activeLabel, color: activeColor }
        : null,
    cancelDraft: () => setDraftPoints([]),
    resetZoom:   () => { onZoomChange(1); setOffset({ x: 0, y: 0 }); },
  }));

  /* ── load image ── */
  useEffect(() => {
    setImgLoaded(false);
    setDraftPoints([]);
    setOffset({ x: 0, y: 0 });
    onZoomChange(1);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image.image.startsWith('http')
      ? image.image
      : `${BASE}${image.image}`;
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
  }, [image]); // eslint-disable-line

  /* ── resize observer ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      const img = imgRef.current;
      const ratio = img && img.naturalWidth > 0
        ? img.naturalHeight / img.naturalWidth
        : 0.6;
      setCanvasSize({ w: width, h: Math.round(width * ratio) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [imgLoaded]);

  /* ── canvas → image coords (accounts for zoom + pan) ── */
  const canvasToImg = useCallback((cx: number, cy: number): PolygonPoint => ({
    x: Math.round((cx - offset.x) / zoom),
    y: Math.round((cy - offset.y) / zoom),
  }), [zoom, offset]);

  /* ── image → canvas coords ── */
  const imgToCanvas = useCallback((ix: number, iy: number): PolygonPoint => ({
    x: ix * zoom + offset.x,
    y: iy * zoom + offset.y,
  }), [zoom, offset]);

  /* ── draw ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = canvasSize;
    canvas.width  = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    /* checkerboard background */
    const tileSize = 16;
    for (let row = 0; row < Math.ceil(h / tileSize); row++) {
      for (let col = 0; col < Math.ceil(w / tileSize); col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? '#1a1a24' : '#14141c';
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }

    /* image with zoom + pan */
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    ctx.restore();

    /* helper: draw polygon in image-space */
    const drawPoly = (
      points: PolygonPoint[],
      color: string,
      closed: boolean,
      selected: boolean,
      alpha = 0.18,
    ) => {
      if (points.length < 2) return;

      /* convert image coords → canvas coords */
      const cp = points.map(p => imgToCanvas(p.x, p.y));

      ctx.beginPath();
      ctx.moveTo(cp[0].x, cp[0].y);
      for (let i = 1; i < cp.length; i++) ctx.lineTo(cp[i].x, cp[i].y);
      if (closed) ctx.closePath();

      if (closed) {
        ctx.fillStyle = color +
          Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }

      ctx.strokeStyle  = selected ? '#fff' : color;
      ctx.lineWidth    = selected ? 2.5 : 1.8;
      if (!closed) ctx.setLineDash([6, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      /* vertices */
      cp.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, i === 0 ? 5 : 4, 0, Math.PI * 2);
        ctx.fillStyle   = i === 0 ? '#fff' : color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth   = 1;
        ctx.stroke();
      });
    };

    /* saved polygons */
    savedPolygons.forEach(poly => {
      if (hiddenIds.has(poly.id)) return;
      drawPoly(poly.points, poly.color, true, poly.id === selectedPolygonId);

      /* label */
      if (poly.label && poly.points.length > 0) {
        const cpArr = poly.points.map(p => imgToCanvas(p.x, p.y));
        const cx = cpArr.reduce((s, p) => s + p.x, 0) / cpArr.length;
        const cy = cpArr.reduce((s, p) => s + p.y, 0) / cpArr.length;
        ctx.save();
        ctx.font = `bold ${Math.max(10, 11 * zoom)}px Inter,sans-serif`;
        const tw = ctx.measureText(poly.label).width;
        const pad = 5;
        ctx.fillStyle = poly.color + 'cc';
        ctx.beginPath();
        ctx.roundRect(cx - tw / 2 - pad, cy - 10, tw + pad * 2, 18, 4);
        ctx.fill();
        ctx.fillStyle   = '#fff';
        ctx.textAlign   = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(poly.label, cx, cy);
        ctx.restore();
      }
    });

    /* draft */
    if (draftPoints.length > 0 && tool === 'draw') {
      const preview = mousePos
        ? [...draftPoints, canvasToImg(mousePos.x, mousePos.y)]
        : draftPoints;
      drawPoly(preview, activeColor, false, false, 0.12);

      /* close-zone circle */
      if (draftPoints.length >= 3 && canClose) {
        const first = imgToCanvas(draftPoints[0].x, draftPoints[0].y);
        ctx.beginPath();
        ctx.arc(first.x, first.y, CLOSE_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff80';
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    /* zoom level indicator (top-right) */
    ctx.save();
    ctx.fillStyle    = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.roundRect(w - 72, 8, 64, 22, 6);
    ctx.fill();
    ctx.fillStyle    = '#c4c4d4';
    ctx.font         = 'bold 11px Inter,monospace';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(zoom * 100)}%`, w - 40, 19);
    ctx.restore();

  }, [
    canvasSize, imgLoaded, savedPolygons, draftPoints,
    mousePos, activeColor, tool, hiddenIds, selectedPolygonId,
    zoom, offset, canClose, imgToCanvas, canvasToImg,
  ]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  /* ── raw canvas coords ── */
  const getRaw = (e: React.MouseEvent<HTMLCanvasElement>): PolygonPoint => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  /* ── wheel → zoom (pinch-friendly) ── */
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;

    const delta  = e.deltaY < 0 ? 1.1 : 0.9;
    const newZ   = clamp(zoom * delta, MIN_ZOOM, MAX_ZOOM);
    const factor = newZ / zoom;

    /* zoom toward cursor */
    setOffset(prev => ({
      x: mx - (mx - prev.x) * factor,
      y: my - (my - prev.y) * factor,
    }));
    onZoomChange(newZ);
  }, [zoom, onZoomChange]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  /* ── pan handlers (middle-mouse OR pan tool) ── */
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const isMiddle = e.button === 1;
    const isPanTool = tool === 'pan';
    if (!isMiddle && !isPanTool) return;
    e.preventDefault();
    isPanning.current  = true;
    panStart.current   = { x: e.clientX, y: e.clientY };
    offsetSnap.current = { ...offset };
  };

  const handleMouseMovePan = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning.current) {
      setOffset({
        x: offsetSnap.current.x + (e.clientX - panStart.current.x),
        y: offsetSnap.current.y + (e.clientY - panStart.current.y),
      });
      return;
    }
    /* normal move */
    const raw = getRaw(e);
    setMousePos(raw);

    if (draftPoints.length >= 3) {
      const imgPt = canvasToImg(raw.x, raw.y);
      setCanClose(dist(imgPt, draftPoints[0]) * zoom < CLOSE_RADIUS);
    }
  };

  const handleMouseUp = () => { isPanning.current = false; };

  /* point-in-polygon */
  const pointInPolygon = (p: PolygonPoint, poly: PolygonPoint[]) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;
      if ((yi > p.y) !== (yj > p.y) &&
        p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  };

  /* ── click ── */
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning.current) return;
    if (tool === 'pan') return;
    const raw   = getRaw(e);
    const imgPt = canvasToImg(raw.x, raw.y);

    if (tool === 'select') {
      let found: Polygon | null = null;
      for (let i = savedPolygons.length - 1; i >= 0; i--) {
        const poly = savedPolygons[i];
        if (!hiddenIds.has(poly.id) && pointInPolygon(imgPt, poly.points)) {
          found = poly; break;
        }
      }
      onSelectPolygon(found);
      return;
    }

    /* draw */
    if (draftPoints.length >= 3 && canClose) {
      onPolygonComplete([...draftPoints], activeLabel, activeColor);
      setDraftPoints([]);
      setCanClose(false);
      return;
    }
    setDraftPoints(prev => [...prev, imgPt]);
  };

  const handleDoubleClick = () => {
    if (tool === 'draw' && draftPoints.length >= 3) {
      onPolygonComplete([...draftPoints], activeLabel, activeColor);
      setDraftPoints([]);
      setCanClose(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (tool === 'draw') setDraftPoints(prev => prev.slice(0, -1));
  };

  /* cursor */
  const cursor =
    tool === 'pan' ? 'cursor-grab active:cursor-grabbing'
    : tool === 'draw'
      ? canClose ? 'cursor-cell' : 'cursor-crosshair'
      : 'cursor-pointer';

  return (
    <div ref={containerRef} className="w-full relative select-none">
      {!imgLoaded && (
        <div
          className="w-full flex items-center justify-center
                     bg-[#111118] rounded-2xl border border-[#2a2a3a]"
          style={{ height: 400 }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500
                            border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#8b8ba7]">Loading image…</p>
          </div>
        </div>
      )}

      {imgLoaded && (
        <>
          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            className={`w-full rounded-2xl border border-[#2a2a3a]
                        ${cursor}`}
            onClick={handleClick}
            onMouseMove={handleMouseMovePan}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setMousePos(null); isPanning.current = false; }}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
          />

          {/* hint bar */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2
                          px-3 py-1.5 glass rounded-full border border-[#2a2a3a]
                          text-[10px] text-[#8b8ba7] whitespace-nowrap
                          pointer-events-none flex items-center gap-2">
            {tool === 'pan' && '✋ Drag to pan · Scroll to zoom'}
            {tool === 'draw' && draftPoints.length === 0 && '🖱️ Click to start drawing'}
            {tool === 'draw' && draftPoints.length > 0 && draftPoints.length < 3 &&
              `● ${draftPoints.length} pt — need ${3 - draftPoints.length} more`}
            {tool === 'draw' && draftPoints.length >= 3 && !canClose &&
              '🖱️ Double-click to close · Right-click = undo'}
            {tool === 'draw' && canClose && '✅ Click first point to close polygon'}
            {tool === 'select' && '🖱️ Click a polygon to select'}
          </div>
        </>
      )}
    </div>
  );
});

AnnotationCanvas.displayName = 'AnnotationCanvas';
export default AnnotationCanvas;