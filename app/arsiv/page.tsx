'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  ArrowUpRight, 
  Sparkles, 
  Move
} from 'lucide-react';
import { ARTWORKS_DATA, type ArtworkDetail } from '@/lib/artworks-data';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';

// Sonsuz uzaysal tuval boyutları (piksel)
const CANVAS_WIDTH = 3800;
const CANVAS_HEIGHT = 2800;

// Eserlerin uzay boşluğundaki sanatsal konum koordinatları ve açıları
const SPATIAL_COORDINATES: Record<string, { x: number; y: number; rot: number }> = {
  '1': { x: 1600, y: 1250, rot: -2 }, // selflove (Merkeze yakın odak)
  '2': { x: 2200, y: 1180, rot: 3 },  // it's not a set
  '3': { x: 2600, y: 1550, rot: -1.5 }, // non control
  '4': { x: 1900, y: 1780, rot: 2 },  // farewellkiss
  '5': { x: 1300, y: 1700, rot: -3 }, // spatial contour
  '6': { x: 2350, y: 800, rot: 1 },   // gravity void
  '7': { x: 1650, y: 720, rot: -2 },  // brutalist signet
  '8': { x: 2850, y: 1100, rot: 3.5 }, // molten relic
  '9': { x: 1100, y: 1050, rot: -1 }, // axis zero
  '10': { x: 2250, y: 2050, rot: 2 }, // elemental pulse
};

export default function ArchiveCanvas() {
  const { language } = useLanguage();
  const isEn = language === 'EN';
  const langPrefix = isEn ? '/en' : '/tr';

  const [artworksList, setArtworksList] = useState<ArtworkDetail[]>(ARTWORKS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [hoveredArtwork, setHoveredArtwork] = useState<ArtworkDetail | null>(null);

  // Pan ve Zoom Durumları
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(0.85);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({ width: 1200, height: 800 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedRef = useRef<boolean>(false);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);

  // Dinamik Eserleri Çek
  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        if (data.artworks && Array.isArray(data.artworks) && data.artworks.length > 0) {
          setArtworksList(data.artworks);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic artworks for spatial canvas:', err));
  }, []);

  // Sayfa yüklendiğinde tuvali viewport merkezine odakla
  const centerCanvas = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setViewportSize({ width: clientWidth, height: clientHeight });
    // (1900, 1400) merkez noktası
    const targetX = clientWidth / 2 - 1900 * 0.85;
    const targetY = clientHeight / 2 - 1400 * 0.85;
    setPan({ x: targetX, y: targetY });
    setZoom(0.85);
  }, []);

  useEffect(() => {
    centerCanvas();
    const handleResize = () => {
      if (containerRef.current) {
        setViewportSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [centerCanvas]);

  // Mouse ile Sürükleme (Drag & Pan)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Sadece sol tık ile sürükleme
    if (e.button !== 0) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    if (Math.hypot(deltaX, deltaY) > 5) {
      hasDraggedRef.current = true;
    }

    setPan({
      x: panStartRef.current.x + deltaX,
      y: panStartRef.current.y + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Dokunmatik (Touch Pan & Pinch Zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      hasDraggedRef.current = false;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
      pinchStartDistanceRef.current = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistanceRef.current = dist;
      pinchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const deltaX = e.touches[0].clientX - dragStartRef.current.x;
      const deltaY = e.touches[0].clientY - dragStartRef.current.y;

      if (Math.hypot(deltaX, deltaY) > 6) {
        hasDraggedRef.current = true;
      }

      setPan({
        x: panStartRef.current.x + deltaX,
        y: panStartRef.current.y + deltaY,
      });
    } else if (e.touches.length === 2 && pinchStartDistanceRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = currentDist / pinchStartDistanceRef.current;
      const newZoom = Math.min(Math.max(pinchStartZoomRef.current * scaleFactor, 0.45), 1.6);
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartDistanceRef.current = null;
  };

  // Mouse Tekerleği ile Zoom (Wheel Zoom)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom((prevZoom) => {
      const next = Math.min(Math.max(prevZoom * zoomFactor, 0.45), 1.7);
      return Number(next.toFixed(3));
    });
  };

  // Zoom Butonları
  const zoomIn = () => {
    soundFx.playClick();
    setZoom((z) => Math.min(z + 0.15, 1.7));
  };

  const zoomOut = () => {
    soundFx.playClick();
    setZoom((z) => Math.max(z - 0.15, 0.45));
  };

  const resetView = () => {
    soundFx.playClick();
    centerCanvas();
  };

  // Eserlerin hesaplanmış konumları
  const positionedArtworks = useMemo(() => {
    return artworksList.map((artwork, idx) => {
      const preset = SPATIAL_COORDINATES[artwork.id];
      if (preset) {
        return { ...artwork, posX: preset.x, posY: preset.y, rot: preset.rot };
      }
      // Preset yoksa spiral veya açısal uzamsal dağıtım
      const angle = (idx * 0.9) + 0.5;
      const radius = 550 + (idx * 120);
      return {
        ...artwork,
        posX: 1900 + Math.cos(angle) * radius,
        posY: 1400 + Math.sin(angle) * (radius * 0.75),
        rot: ((idx % 5) - 2) * 1.5,
      };
    });
  }, [artworksList]);

  // Kategoriler
  const categories = useMemo(() => {
    const cats = new Set<string>();
    artworksList.forEach((a) => {
      const c = isEn ? (a.categoryEn || a.category) : a.category;
      if (c) cats.add(c);
    });
    return ['ALL', ...Array.from(cats)];
  }, [artworksList, isEn]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className={`relative w-full h-[calc(100vh-4rem)] lg:h-[calc(100dvh-5rem)] bg-[#040406] overflow-hidden select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. UZAYSAL KANVAS KATMANI (TRANSFORM MATRIX: PAN + ZOOM)                   */}
      {/* ========================================================================= */}
      <div
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
        className="absolute top-0 left-0 will-change-transform"
      >
        {/* Arka Plan Uzamsal Izgarası ve Koordinat Noktaları */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.4) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: '120px 120px, 240px 240px, 240px 240px',
          }}
        />

        {/* Takımyıldızı Vektörel Bağlantı Çizgileri (Constellation Links) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-500/15 stroke-dasharray-[4_6] fill-none">
          <polyline
            points={positionedArtworks
              .slice(0, 8)
              .map((a) => `${a.posX},${a.posY}`)
              .join(' ')}
            strokeWidth="1.5"
          />
          <line x1="1600" y1="1250" x2="2600" y2="1550" strokeWidth="1" stroke="rgba(255,255,255,0.08)" />
          <line x1="1300" y1="1700" x2="1900" y2="1780" strokeWidth="1" stroke="rgba(255,255,255,0.08)" />
          <line x1="2200" y1="1180" x2="2350" y2="800" strokeWidth="1" stroke="rgba(255,255,255,0.08)" />
        </svg>

        {/* Merkez Orijin İşareti */}
        <div className="absolute top-[1400px] left-[1900px] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="font-mono text-[9px] text-amber-400/60 uppercase tracking-widest mt-2">
            ORIGIN // [0,0] STUDIO VOID
          </span>
        </div>

        {/* Eserlerin Uzay Boşluğundaki Kartları */}
        {positionedArtworks.map((artwork) => {
          const isMatchCategory =
            selectedCategory === 'ALL' ||
            (isEn ? (artwork.categoryEn || artwork.category) : artwork.category) === selectedCategory;
          const isHovered = hoveredArtwork?.id === artwork.id;

          return (
            <div
              key={artwork.id}
              style={{
                left: `${artwork.posX}px`,
                top: `${artwork.posY}px`,
                transform: `translate(-50%, -50%) rotate(${artwork.rot}deg)`,
                opacity: isMatchCategory ? 1 : 0.25,
              }}
              onMouseEnter={() => {
                setHoveredArtwork(artwork);
                soundFx.playHover();
              }}
              onMouseLeave={() => setHoveredArtwork(null)}
              className="absolute z-20 group transition-opacity duration-300"
            >
              {/* Eser Kartı Çerçevesi */}
              <div
                className={`relative w-64 sm:w-72 bg-neutral-950/90 border transition-all duration-300 p-2.5 shadow-2xl backdrop-blur-md ${
                  isHovered
                    ? 'border-amber-400 scale-105 shadow-[0_0_40px_rgba(245,158,11,0.35)] z-40'
                    : 'border-neutral-800/90 hover:border-neutral-600'
                }`}
              >
                {/* Eser Görseli */}
                <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden border border-neutral-800">
                  <Image
                    src={artwork.images[0] || '/artworks/4107f9b51db8c3dbac92156e1eebba6e.jpg'}
                    alt={artwork.title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                    draggable={false}
                    referrerPolicy="no-referrer"
                  />

                  {/* Rozet */}
                  <div className="absolute top-2 left-2 bg-black/85 border border-neutral-700 px-1.5 py-0.5 text-[8px] font-mono text-amber-300 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span>{artwork.isUniquePiece ? '1/1' : 'Bespoke'}</span>
                  </div>

                  {/* Koordinat Tag */}
                  <div className="absolute bottom-2 right-2 bg-black/80 font-mono text-[8px] text-neutral-400 px-1 py-0.5 border border-neutral-800">
                    NV-0{artwork.id} {'//'} {Math.round(artwork.posX)},{Math.round(artwork.posY)}
                  </div>
                </div>

                {/* Bilgi Katmanı */}
                <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono text-[8px] text-amber-400/90 uppercase tracking-widest block truncate">
                      {isEn ? (artwork.categoryEn || artwork.category) : artwork.category}
                    </span>
                    <h3 className="font-serif text-base text-white uppercase truncate font-normal">
                      {artwork.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs text-neutral-200 block font-medium">
                      {artwork.price}
                    </span>
                    <span className="font-mono text-[9px] text-neutral-500">
                      {artwork.year}
                    </span>
                  </div>
                </div>

                {/* Sürükleme yapılmadıysa tıklanabilir Detay Butonu */}
                <Link
                  href={`${langPrefix}/koleksiyon/${artwork.id}`}
                  onClick={(e) => {
                    if (hasDraggedRef.current) {
                      e.preventDefault();
                      return;
                    }
                    soundFx.playClick();
                  }}
                  className="mt-2 w-full py-1.5 bg-neutral-900 hover:bg-amber-400 hover:text-black border border-neutral-700 font-mono text-[9px] uppercase tracking-widest text-neutral-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{isEn ? 'Inspect Object' : 'Nesneyi İncele'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 2. SABİT HUD: ÜST SOL BAŞLIK & TALİMATLAR                                  */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30 pointer-events-none">
        <div className="inline-flex items-center gap-2 bg-neutral-950/80 border border-neutral-800 px-3 py-1 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-mono text-[9px] sm:text-[10px] text-amber-400 tracking-[0.25em] uppercase font-bold">
            {isEn ? 'SPATIAL ARCHIVE // LIVE 2D SURFACE' : 'UZAYSAL ARŞİV // CANLI TUVAL'}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl text-white uppercase tracking-tight mt-2 drop-shadow-md">
          {isEn ? 'Infinite Canvas' : 'Uzaysal Kanvas'}
        </h1>

        <p className="font-mono text-[10px] sm:text-[11px] text-neutral-400 mt-1 max-w-sm flex items-center gap-2">
          <Move className="w-3 h-3 text-amber-400 shrink-0" />
          <span>
            {isEn
              ? 'Drag to pan • Scroll / pinch to zoom in deep space'
              : 'Sürükleyerek gezinin • Büyütmek için tekerleği kaydırın'}
          </span>
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. SABİT HUD: ÜST SAĞ TELEMETRİ BİLGİSİ                                    */}
      {/* ========================================================================= */}
      <div className="absolute top-4 right-14 sm:top-6 sm:right-16 md:right-20 lg:right-28 z-30 pointer-events-none hidden sm:block">
        <div className="bg-neutral-950/80 border border-neutral-800 p-2.5 font-mono text-[9px] text-neutral-400 space-y-1 backdrop-blur-md">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">CANVAS_POS:</span>
            <span className="text-amber-400">X: {Math.round(-pan.x)} | Y: {Math.round(-pan.y)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">MAGNIFICATION:</span>
            <span className="text-neutral-200">{Math.round(zoom * 100)}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">REGISTERED:</span>
            <span className="text-neutral-200">{artworksList.length} ARTIFACTS</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SABİT HUD: ALT SOL MİNİ-RADAR (MINIMAP)                                 */}
      {/* ========================================================================= */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 z-30 pointer-events-none hidden md:block">
        <div className="relative w-36 h-24 bg-neutral-950/90 border border-neutral-800 p-1.5 backdrop-blur-md shadow-2xl">
          <div className="absolute top-1 left-1.5 font-mono text-[7px] text-neutral-500 tracking-wider">
            RADAR 1:25
          </div>
          
          {/* Eser Noktaları */}
          <div className="relative w-full h-full">
            {positionedArtworks.map((a) => (
              <div
                key={a.id}
                style={{
                  left: `${(a.posX / CANVAS_WIDTH) * 100}%`,
                  top: `${(a.posY / CANVAS_HEIGHT) * 100}%`,
                }}
                className={`absolute w-1 h-1 rounded-full -translate-x-1/2 -translate-y-1/2 ${
                  hoveredArtwork?.id === a.id ? 'bg-amber-400 ring-2 ring-amber-400/50' : 'bg-neutral-500'
                }`}
              />
            ))}

            {/* Viewport Görüş Alanı Kutusu */}
            <div
              style={{
                left: `${Math.max(0, Math.min(100, (-pan.x / (CANVAS_WIDTH * zoom)) * 100))}%`,
                top: `${Math.max(0, Math.min(100, (-pan.y / (CANVAS_HEIGHT * zoom)) * 100))}%`,
                width: `${Math.min(100, (viewportSize.width / (CANVAS_WIDTH * zoom)) * 100)}%`,
                height: `${Math.min(100, (viewportSize.height / (CANVAS_HEIGHT * zoom)) * 100)}%`,
              }}
              className="absolute border border-amber-400/70 bg-amber-400/10 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SABİT HUD: ALT SAĞ DOK / KONTROL PANELİ (ZOOM, RESET, KATEGORİ)         */}
      {/* ========================================================================= */}
      <div className="absolute bottom-4 right-14 sm:bottom-6 sm:right-16 md:right-20 lg:right-28 z-30 flex items-center gap-2 sm:gap-3">
        {/* Kategori Filtre Butonları (Hafif ve Açılır) */}
        <div className="bg-neutral-950/90 border border-neutral-800 p-1 flex items-center gap-1 backdrop-blur-md shadow-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-black font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {cat === 'ALL' ? (isEn ? 'ALL' : 'TÜMÜ') : cat}
            </button>
          ))}
        </div>

        {/* Zoom Kontrolleri */}
        <div className="bg-neutral-950/90 border border-neutral-800 p-1 flex items-center gap-1 backdrop-blur-md shadow-2xl">
          <button
            onClick={zoomIn}
            title={isEn ? 'Zoom In' : 'Yakınlaş'}
            className="w-8 h-8 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={zoomOut}
            title={isEn ? 'Zoom Out' : 'Uzaklaş'}
            className="w-8 h-8 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            title={isEn ? 'Center Origin' : 'Merkeze Odaklan'}
            className="w-8 h-8 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
