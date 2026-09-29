'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { ARTWORKS_DATA, type ArtworkDetail } from '@/lib/artworks-data';
import { soundFx } from '@/lib/sound-fx';
import type { Locale } from '@/lib/i18n-config';

interface ArchiveCanvasViewProps {
  lang?: Locale;
}

export default function ArchiveCanvasView({ lang = 'tr' }: ArchiveCanvasViewProps) {
  const isEn = lang === 'en';

  // Tuval Konumu ve Zoom
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Seçili Eser (Drawer / Modal)
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkDetail | null>(null);

  // Ses Durumu
  const [isMuted, setIsMuted] = useState(() => soundFx.getMuted());

  // Tuval Konteyner Referansı
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Sadece sol tık ile sürükleme
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = -e.deltaY * 0.001;
    setZoom((prev) => Math.min(Math.max(0.6, prev + zoomFactor), 2.2));
  };

  const handleReset = () => {
    soundFx.playClick();
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-screen h-screen overflow-hidden bg-[#050608] text-neutral-100 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* 1. HUD & VİEWFİNDER TELEMETRİ KATMANI (Fixed) */}
      <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 font-mono text-[9px] sm:text-[10px] text-neutral-500">
        {/* Üst Telemetri */}
        <div className="flex justify-between items-start uppercase tracking-widest pt-12 sm:pt-14">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-neutral-400">REC [ + ] 24 FPS // CINEMATIC CANVAS</span>
          </div>
          <div className="text-right">
            <span className="text-neutral-400">PAN X:{Math.round(pan.x)} Y:{Math.round(pan.y)}</span>
            <span className="text-neutral-600 block">ZOOM: {Math.round(zoom * 100)}%</span>
          </div>
        </div>

        {/* Alt Telemetri */}
        <div className="flex justify-between items-end uppercase tracking-widest pb-12 sm:pb-14">
          <div>
            <span className="text-neutral-400">CINEMASCOPE 2.39:1 // 925K STERLING SILVER</span>
            <span className="text-neutral-600 block">LOST-WAX CONTINUUM</span>
          </div>
          <div className="text-right text-neutral-400">
            [ SÜRÜKLEYİN • TEKERLEKLE YAKINLAŞIN ]
          </div>
        </div>
      </div>

      {/* 2. TUVAL KONTROLLERİ (Sağ Alt / Sol Alt) */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-neutral-950/80 border border-neutral-800 p-1.5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setZoom((z) => Math.min(2.2, z + 0.2));
          }}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          title="Yakınlaş"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setZoom((z) => Math.max(0.6, z - 0.2));
          }}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          title="Uzaklaş"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          title="Sıfırla"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-neutral-800" />
        <button
          type="button"
          onClick={handleToggleSound}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
        </button>
      </div>

      {/* 3. İNTERAKTİF 3D SONSÜZ TUVAL SAHNESİ */}
      <div
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        className="absolute inset-0 w-[240vw] h-[240vh] -left-[70vw] -top-[70vh] pointer-events-auto"
      >
        {/* Arka Plan Radyal Izgara & Koordinat Çizgileri */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Merkez Odak Noktası */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center opacity-30">
          <div className="w-8 h-8 rounded-full border border-dashed border-neutral-500 animate-spin" style={{ animationDuration: '30s' }} />
          <span className="font-mono text-[8px] text-neutral-500 mt-2 tracking-widest">[ 0, 0 ORIGIN ]</span>
        </div>

        {/* Eser İğneleri & Koordinat Kartları */}
        {ARTWORKS_DATA.map((art, idx) => {
          // archiveCoords veya dinamik yerleşim
          const defaultX = (idx * 22) % 80 + 10;
          const defaultY = ((idx * 17) % 70) + 15;
          const x = art.archiveCoords?.x ?? defaultX;
          const y = art.archiveCoords?.y ?? defaultY;

          return (
            <motion.div
              key={art.id}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              whileHover={{ scale: 1.12, zIndex: 40 }}
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playClick();
                setSelectedArtwork(art);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              {/* Çerçevesiz Heykelsi Görsel */}
              <div className="relative w-28 sm:w-36 md:w-44 aspect-[4/5] bg-neutral-950 border border-neutral-800 shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden group-hover:border-amber-400/80 transition-colors">
                <Image
                  src={art.images[0]}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 140px, 180px"
                  className="object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Koordinat & Eser Rozeti */}
              <div className="mt-2 text-center pointer-events-none">
                <span className="font-mono text-[8px] sm:text-[9px] text-neutral-400 group-hover:text-amber-300 uppercase tracking-widest block truncate max-w-[150px]">
                  {art.title}
                </span>
                <span className="font-mono text-[7px] text-neutral-600 tracking-wider">
                  [{x}°, {y}°]
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. SEÇİLİ ESER İNCELEME MODALI / DRAWER */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtwork(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              <button
                type="button"
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Görsel */}
              <div className="md:col-span-5 relative aspect-[4/5] bg-neutral-900 border border-neutral-800">
                <Image
                  src={selectedArtwork.images[0]}
                  alt={selectedArtwork.title}
                  fill
                  className="object-cover"
                  sizes="350px"
                />
              </div>

              {/* Bilgiler */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-amber-400 tracking-widest uppercase">
                    <Sparkles className="w-3 h-3" />
                    <span>{selectedArtwork.collectionName}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-tight">
                    {selectedArtwork.title}
                  </h2>
                  <p className="font-sans text-xs text-neutral-400 leading-relaxed mt-3 line-clamp-3">
                    {isEn ? selectedArtwork.descriptionEn || selectedArtwork.description : selectedArtwork.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-neutral-800/80 grid grid-cols-2 gap-2 font-mono text-[10px] text-neutral-400">
                    <div>
                      <span className="text-neutral-600 block uppercase">Maden / Taş</span>
                      <span className="text-white truncate block">{selectedArtwork.material}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600 block uppercase">Ağırlık</span>
                      <span className="text-white block">{selectedArtwork.weight}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600 block uppercase">Edisyon</span>
                      <span className="text-white block">{selectedArtwork.isUniquePiece ? '1/1 Unique' : 'Bespoke'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600 block uppercase">Fiyat</span>
                      <span className="text-amber-400 font-semibold block">{selectedArtwork.price}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <Link
                    href={`/${lang}/shop/${selectedArtwork.id}`}
                    onClick={() => soundFx.playClick()}
                    className="bg-white hover:bg-neutral-200 text-black px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>{isEn ? 'Open Specimen Page' : 'Eser Sayfasını Aç'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <span className="font-mono text-[9px] text-neutral-500 uppercase">
                    NV-ARCHIVE // ID #{selectedArtwork.id}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
