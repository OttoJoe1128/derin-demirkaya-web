'use client';

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Film,
  X,
  ArrowLeft,
} from 'lucide-react';
import { ARTWORKS_DATA, ArtworkDetail } from '@/lib/artworks-data';
import { useLanguage } from '@/lib/language-context';

export default function ArchiveCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const { language } = useLanguage();

  const [isDragging, setIsDragging] = useState(false);

  // Kamera & Tuval Durumu
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'constellation' | 'timeline' | 'axis'>('constellation');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Sinematik Efektler
  const [isCinemascope, setIsCinemascope] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredArtwork, setHoveredArtwork] = useState<ArtworkDetail | null>(null);
  const [projectedArtwork, setProjectedArtwork] = useState<ArtworkDetail | null>(null);

  // Web Audio Minimalist Analog Ambient Drone Synthesizer
  const audioContextRef = useRef<AudioContext | null>(null);

  const toggleSound = () => {
    if (isMuted) {
      try {
        if (!audioContextRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          // 65Hz Analog Sinüs Tonu
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(65.41, ctx.currentTime);

          // 130.8Hz Harmonik Ton
          const osc2 = ctx.createOscillator();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(130.81, ctx.currentTime);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(180, ctx.currentTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.05, ctx.currentTime);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();
        } else if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        setIsMuted(false);
      } catch (err) {
        console.warn('Audio initiation failed:', err);
      }
    } else {
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend();
      }
      setIsMuted(true);
    }
  };

  // YÜKSEK PERFORMANSLI FARE TAKİBİ:
  // React State GÜNCELLEMESİ YOK! Doğrudan requestAnimationFrame ile DOM transformu
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX - 400}px, ${e.clientY - 400}px, 0)`;
      }
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [onMouseMove]);

  // Tuval üzerindeki eser konumlandırma haritaları
  const placedItems = useMemo(() => {
    return ARTWORKS_DATA.map((art, idx) => {
      // 1. Constellation (Serbest uzamsal dağılım)
      const constellationPos = [
        { x: '6vw', y: '10vh', w: '320px', h: '420px' },
        { x: '42vw', y: '26vh', w: '380px', h: '300px' },
        { x: '78vw', y: '12vh', w: '300px', h: '400px' },
        { x: '18vw', y: '62vh', w: '340px', h: '440px' },
        { x: '58vw', y: '58vh', w: '310px', h: '420px' },
        { x: '94vw', y: '48vh', w: '340px', h: '340px' },
        { x: '130vw', y: '18vh', w: '420px', h: '320px' },
        { x: '135vw', y: '62vh', w: '360px', h: '440px' },
        { x: '170vw', y: '32vh', w: '330px', h: '420px' },
        { x: '38vw', y: '110vh', w: '400px', h: '300px' },
      ][idx] || { x: `${(idx * 25) % 150}vw`, y: `${30 + (idx * 20) % 80}vh`, w: '320px', h: '400px' };

      // 2. Timeline (Kronolojik sekans)
      const timelinePos = {
        x: `${10 + idx * 30}vw`,
        y: `${idx % 2 === 0 ? '22vh' : '52vh'}`,
        w: '340px',
        h: '420px',
      };

      // 3. Axis (Matris düzeni)
      const isSpace = art.collectionName.includes('space');
      const isLine = art.collectionName.includes('line');
      const axisY = isSpace ? '65vh' : isLine ? '105vh' : '20vh';
      const axisX = `${10 + (idx % 4) * 36}vw`;
      const axisPos = { x: axisX, y: axisY, w: '330px', h: '410px' };

      const activePos =
        viewMode === 'timeline'
          ? timelinePos
          : viewMode === 'axis'
          ? axisPos
          : constellationPos;

      return {
        ...art,
        layout: activePos,
        reelCode: `REEL-NV-${art.year}-${(idx + 1).toString().padStart(2, '0')}`,
      };
    });
  }, [viewMode]);

  // Filtreleme
  const filteredItems = useMemo(() => {
    return placedItems.filter((item) => {
      if (filterCategory === 'ALL') return true;
      return item.collectionName.toUpperCase().includes(filterCategory);
    });
  }, [placedItems, filterCategory]);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen bg-[#050608] text-neutral-100 overflow-hidden select-none font-sans"
    >
      {/* 1. SİNEMATİK DONANIM HIZLANDIRMALI SPOTLIGHT (React re-render tetiklemez, 120 FPS) */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-[800px] h-[800px] rounded-full opacity-60 mix-blend-screen will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(20,25,35,0.02) 45%, transparent 70%)',
          transform: 'translate3d(20vw, 20vh, 0)',
        }}
      />

      {/* 2. STATİK ANAMORFİK CINEMASCOPE 2.39:1 SİYAH ÇERÇEVELER */}
      <div
        className={`absolute top-0 left-0 right-0 bg-black z-40 border-b border-white/10 pointer-events-none transition-all duration-500 ease-out ${
          isCinemascope ? 'h-[8vh]' : 'h-0'
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-black z-40 border-t border-white/10 pointer-events-none transition-all duration-500 ease-out ${
          isCinemascope ? 'h-[8vh]' : 'h-0'
        }`}
      />

      {/* 3. SİNEMATİK VİEWFİNDER KÖŞE ÇİZGİLERİ [ + ] */}
      <div className="pointer-events-none absolute inset-6 md:inset-8 z-30 border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between p-2 text-[10px] font-mono text-neutral-500 tracking-widest">
          <span>[ + ] CAM A // MASTER ARCHIVE</span>
          <span>TC 00:04:18:12 • 24.00 FPS</span>
          <span>[ + ] 2.39:1 CINEMATIC</span>
        </div>
        <div className="flex justify-between p-2 text-[10px] font-mono text-neutral-500 tracking-widest">
          <span>LAT 38.4192° N, 27.1287° E • IZMIR/ISTANBUL</span>
          <span>ZOOM: {zoomLevel.toFixed(1)}x</span>
          <span>ISO 400 • 50mm T1.3</span>
        </div>
      </div>

      {/* 4. ÜST HUD: BAŞLIK & REEL METADATA */}
      <header className="absolute top-8 left-8 md:left-12 z-30 pointer-events-auto flex flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
            CINEMATIC ARCHIVE • DERİN BUSE DEMİRKAYA
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-white uppercase tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          {language === 'TR' ? 'Sinematik Arşiv' : 'Cinematic Archive'}
        </h1>
        <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest max-w-sm">
          {language === 'TR'
            ? 'Ateşin dönüştürücü gücüyle şekillenen uzamsal nesne ve heykelsi takı arşivi.'
            : 'Sculptural jewelry and spatial object archive formed by the transformative force of fire.'}
        </p>
      </header>

      {/* 5. SAĞ ÜST KONTROLLER */}
      <div className="absolute top-8 right-8 md:right-12 z-30 pointer-events-auto flex items-center gap-2 sm:gap-3">
        {/* Ses Butonu */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-widest border transition-colors ${
            !isMuted
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-[#0d0f12]/90 text-neutral-400 border-white/15 hover:text-white'
          }`}
          title={language === 'TR' ? 'Analog Arka Plan Sesi' : 'Ambient Tone'}
        >
          {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{!isMuted ? 'SOUND: ON' : 'SOUND: OFF'}</span>
        </button>

        {/* Cinemascope Modu */}
        <button
          onClick={() => setIsCinemascope(!isCinemascope)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-widest border transition-colors ${
            isCinemascope
              ? 'bg-white text-black border-white'
              : 'bg-[#0d0f12]/90 text-neutral-400 border-white/15 hover:text-white'
          }`}
          title="2.39:1 Cinemascope"
        >
          <Film className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">2.39:1</span>
        </button>

        <Link
          href="/koleksiyon"
          className="px-3 py-1.5 text-xs font-mono uppercase tracking-widest bg-[#0d0f12]/90 text-neutral-300 border border-white/15 hover:border-white/40 hover:text-white transition-colors"
        >
          {language === 'TR' ? 'Katalog' : 'Catalog'}
        </Link>
        <Link
          href="/"
          className="px-3 py-1.5 text-xs font-mono uppercase tracking-widest bg-white text-black border border-white hover:bg-neutral-200 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>{language === 'TR' ? 'Vitrin' : 'Home'}</span>
        </Link>
      </div>

      {/* 6. ALT KONTROL ÇUBUĞU: GÖRÜNÜM MODLARI & ZOOM KONTROLLERİ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-wrap items-center justify-center gap-2.5 max-w-full px-4">
        {/* Görünüm Modları */}
        <div className="flex items-center bg-[#0d0f12]/95 border border-white/15 p-1 shadow-lg">
          <button
            onClick={() => setViewMode('constellation')}
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors ${
              viewMode === 'constellation'
                ? 'bg-white/25 text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Constellation
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white/25 text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Timeline (2018–2025)
          </button>
          <button
            onClick={() => setViewMode('axis')}
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors ${
              viewMode === 'axis'
                ? 'bg-white/25 text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Axis
          </button>
        </div>

        {/* Kategori Filtresi */}
        <div className="hidden sm:flex items-center bg-[#0d0f12]/95 border border-white/15 p-1 shadow-lg">
          {['ALL', 'OBJECT', 'SPACE', 'LINE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                filterCategory === cat
                  ? 'bg-neutral-100 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Zoom & Reset */}
        <div className="flex items-center gap-1 bg-[#0d0f12]/95 border border-white/15 p-1 shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.65, z - 0.15))}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title={language === 'TR' ? 'Uzaklaş' : 'Zoom Out'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[10px] text-neutral-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title={language === 'TR' ? 'Yakınlaş' : 'Zoom In'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 text-neutral-400 hover:text-white transition-colors border-l border-white/10 ml-0.5"
            title={language === 'TR' ? 'Sıfırla' : 'Reset'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7. SİNEMATİK ETKİLEŞİMLİ TUVAL (DRAGGABLE CINEMATIC CANVAS) */}
      <motion.div
        drag
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setTimeout(() => setIsDragging(false), 50);
        }}
        style={{
          scale: zoomLevel,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
        className={`absolute top-0 left-0 w-[240vw] h-[200vh] origin-top-left ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* İnce Uzamsal Izgara Çizgileri */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />

        {/* Eser Kareleri & Sinematik Projektör Kartları */}
        {filteredItems.map((item) => {
          const isHovered = hoveredArtwork?.id === item.id;

          return (
            <div
              key={item.id}
              style={{
                left: item.layout.x,
                top: item.layout.y,
                width: item.layout.w,
                height: item.layout.h,
                zIndex: isHovered ? 35 : 10,
              }}
              className="absolute group transition-transform duration-300 ease-out"
              onMouseEnter={() => setHoveredArtwork(item)}
              onMouseLeave={() => setHoveredArtwork(null)}
            >
              {/* Sinematik Çerçeve */}
              <div className="relative w-full h-full bg-[#0d0f12] border border-neutral-800 group-hover:border-amber-400/80 transition-colors duration-300 overflow-hidden shadow-2xl">
                {/* Sol Üst Reel / Çekim İndeksi */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                  <span className="bg-black/90 px-2 py-0.5 text-[9px] font-mono text-white/80 uppercase tracking-widest border border-white/10">
                    {item.reelCode}
                  </span>
                  {item.isUniquePiece && (
                    <span className="bg-amber-500 text-black px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-widest uppercase">
                      1/1 UNIQUE
                    </span>
                  )}
                </div>

                {/* Sağ Üst Hızlı Sinematik Projeksiyon Butonu */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDragging) setProjectedArtwork(item);
                  }}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                  title={language === 'TR' ? 'Sinematik İnceleme' : 'Cinematic View'}
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                {/* Eser Görseli */}
                <Link
                  href={`/koleksiyon/${item.id}`}
                  onClick={(e) => {
                    if (isDragging) e.preventDefault();
                  }}
                  className="block w-full h-full relative"
                >
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    sizes="400px"
                    className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                  {/* Alt Bilgi Kartı */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 font-sans z-10">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                      <span>{item.category}</span>
                      <span className="text-amber-400 font-bold">{item.price}</span>
                    </div>
                    <h3 className="font-serif text-2xl uppercase tracking-tight text-white group-hover:underline">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 uppercase tracking-widest mt-2 pt-2 border-t border-white/10">
                      <span>{item.material.split('/')[0]}</span>
                      <span>{item.year}</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* 8. SİNEMATİK BÜYÜK EKRAN PROJEKTÖR MODALI */}
      <AnimatePresence>
        {projectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050608]/95 p-6 sm:p-12 flex flex-col justify-between overflow-y-auto"
          >
            {/* Modal Üst Şerit */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-300">
                  {projectedArtwork.title} • {projectedArtwork.year}
                </span>
              </div>
              <button
                onClick={() => setProjectedArtwork(null)}
                className="p-2 border border-white/20 text-neutral-300 hover:text-white hover:border-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Orta Görsel & Eser Odak Alanı */}
            <div className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
              {/* Sinematik Geniş Görsel */}
              <div className="lg:col-span-8 relative aspect-[16/10] bg-neutral-900 border border-white/15 overflow-hidden shadow-2xl">
                <Image
                  src={projectedArtwork.images[0]}
                  alt={projectedArtwork.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 font-mono text-xs uppercase tracking-widest text-amber-300 border border-amber-500/30">
                  {projectedArtwork.collectionName}
                </div>
              </div>

              {/* Sanatçı Notları & Künye */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6 text-neutral-300">
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
                    {language === 'TR' ? 'Eser Künyesi' : 'Specimen Details'}
                  </span>
                  <p className="text-sm font-sans font-light leading-relaxed text-neutral-200">
                    {projectedArtwork.description}
                  </p>
                  <div className="p-4 bg-neutral-900/90 border border-white/10 text-xs font-mono space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{language === 'TR' ? 'Maden / Taş:' : 'Material:'}</span>
                      <span className="text-white text-right">{projectedArtwork.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{language === 'TR' ? 'Teknik:' : 'Technique:'}</span>
                      <span className="text-white text-right">{projectedArtwork.technique}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{language === 'TR' ? 'Ağırlık:' : 'Weight:'}</span>
                      <span className="text-white">{projectedArtwork.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">{language === 'TR' ? 'Fiyat:' : 'Price:'}</span>
                      <span className="text-amber-300 font-bold">{projectedArtwork.price}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <Link
                    href={`/koleksiyon/${projectedArtwork.id}`}
                    className="w-full py-3.5 bg-white text-black text-center font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-neutral-200 transition-colors shadow-lg"
                  >
                    {language === 'TR' ? '3D Parallax İncele →' : '3D Spatial View →'}
                  </Link>
                  <button
                    onClick={() => setProjectedArtwork(null)}
                    className="w-full py-2.5 border border-white/20 text-neutral-400 text-center font-mono text-xs uppercase tracking-[0.2em] hover:text-white hover:border-white transition-colors"
                  >
                    {language === 'TR' ? 'Tuvala Geri Dön' : 'Return to Canvas'}
                  </button>
                </div>
              </div>
            </div>

            {/* Alt Zaman Kodu */}
            <div className="border-t border-white/15 pt-4 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>EXHIBITION ARCHIVE // DERİN BUSE DEMİRKAYA</span>
              <span>DIRECTOR SPECIMEN PROJECTION</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
