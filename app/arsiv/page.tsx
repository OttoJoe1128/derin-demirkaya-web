'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
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
} from 'lucide-react';
import { ARTWORKS_DATA, ArtworkDetail } from '@/lib/artworks-data';

export default function ArchiveCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });

  // Web Audio Minimalist Analog Ambient Drone Synthesizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleSound = () => {
    if (isMuted) {
      try {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          // Temel 65Hz Analog Sinüs Tonu (Warm Museum Sub-drone)
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2

          // İkincil 130.8Hz Harmonik Ton
          const osc2 = ctx.createOscillator();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(130.81, ctx.currentTime); // C3

          // Düşük Geçirgen Filtre (Analog Bant Filtresi)
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(180, ctx.currentTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.06, ctx.currentTime); // Nazik, rahatsız etmeyen arka plan rezonansı
          gainNodeRef.current = gain;

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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Tuval üzerindeki eser konumlandırma haritaları
  const placedItems = useMemo(() => {
    return ARTWORKS_DATA.map((art, idx) => {
      // 1. Constellation (Serbest uzamsal dağılım)
      const constellationPos = [
        { x: '8vw', y: '10vh', w: '320px', h: '420px' },    // selflove
        { x: '45vw', y: '28vh', w: '380px', h: '300px' },   // it's not a set
        { x: '80vw', y: '12vh', w: '300px', h: '400px' },   // non control
        { x: '22vw', y: '65vh', w: '340px', h: '440px' },   // farewellkiss
        { x: '62vw', y: '60vh', w: '310px', h: '420px' },   // tension
        { x: '98vw', y: '50vh', w: '340px', h: '340px' },   // uncut
        { x: '135vw', y: '18vh', w: '440px', h: '320px' },  // not a jewelry
        { x: '140vw', y: '65vh', w: '360px', h: '440px' },  // zin
        { x: '175vw', y: '35vh', w: '330px', h: '420px' },  // plastque
        { x: '40vw', y: '115vh', w: '420px', h: '300px' },  // line traces
      ][idx] || { x: `${(idx * 25) % 160}vw`, y: `${30 + (idx * 20) % 90}vh`, w: '320px', h: '400px' };

      // 2. Timeline (Yıllara göre kronolojik sinematik sekans)
      const timelinePos = {
        x: `${12 + idx * 32}vw`,
        y: `${idx % 2 === 0 ? '22vh' : '52vh'}`,
        w: '340px',
        h: '420px',
      };

      // 3. Axis (Object - Space - Line matrisi)
      const isSpace = art.collectionName.includes('space');
      const isLine = art.collectionName.includes('line');
      const axisY = isSpace ? '65vh' : isLine ? '105vh' : '20vh';
      const axisX = `${10 + (idx % 4) * 38}vw`;
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
  const filteredItems = placedItems.filter((item) => {
    if (filterCategory === 'ALL') return true;
    return item.collectionName.toUpperCase().includes(filterCategory);
  });

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen bg-[#060709] text-neutral-100 overflow-hidden select-none font-sans"
    >
      {/* 1. SİNEMATİK AMBİYANS: SPOTLIGHT & DİNAMİK VİGNETTE */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle 800px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.04) 0%, rgba(6,7,9,0.7) 60%, rgba(6,7,9,0.98) 100%)`,
        }}
      />

      {/* 2. SİNEMATİK FİLM NOISE / GRAIN KATMANI */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. ANAMORFİK CINEMASCOPE 2.39:1 SİYAH ÇERÇEVELER (TOGGLEABLE) */}
      <motion.div
        initial={false}
        animate={{ height: isCinemascope ? '8vh' : '0vh' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 bg-black z-40 border-b border-white/5 pointer-events-none"
      />
      <motion.div
        initial={false}
        animate={{ height: isCinemascope ? '8vh' : '0vh' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 bg-black z-40 border-t border-white/5 pointer-events-none"
      />

      {/* 4. SİNEMATİK VİEWFİNDER KÖŞE ÇAPRAZ ÇİZGİLERİ [ + ] */}
      <div className="pointer-events-none absolute inset-6 md:inset-10 z-30 border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between p-2 text-[10px] font-mono text-neutral-500 tracking-widest">
          <span>[ + ] CAM A // MASTER RECORD</span>
          <span>TC 00:04:18:12 • 24.00 FPS</span>
          <span>[ + ] 2.39:1 CINEMATIC ARCHIVE</span>
        </div>
        <div className="flex justify-between p-2 text-[10px] font-mono text-neutral-500 tracking-widest">
          <span>LAT 38.4192° N, 27.1287° E • IZMIR/ISTANBUL</span>
          <span>PAN: X={Math.round(panPos.x)} Y={Math.round(panPos.y)} • ZOOM: {zoomLevel.toFixed(1)}x</span>
          <span>ISO 400 • 50mm T1.3</span>
        </div>
      </div>

      {/* 5. ÜST HUD: BAŞLIK & REEL METADATA */}
      <header className="absolute top-10 left-10 md:left-14 z-30 pointer-events-auto flex flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">
            CINEMATIC CANVAS • DERİN BUSE DEMİRKAYA
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-white uppercase tracking-tighter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          Sinematik Tuval
        </h1>
        <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest max-w-md">
          Ateşin dönüştürücü gücüyle şekillenen uzamsal nesne ve çağdaş takı arşivi (2018–2025).
        </p>
      </header>

      {/* 6. SAĞ ÜST: KAMERA KONTROL & AMBİYANS SES PANELİ */}
      <div className="absolute top-10 right-10 md:right-14 z-30 pointer-events-auto flex items-center gap-3">
        {/* Ses Butonu */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-widest border transition-all duration-300 ${
            !isMuted
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-black/60 backdrop-blur-md text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
          }`}
          title="Analog Arka Plan Sesi"
        >
          {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{!isMuted ? 'SOUND: ON (65Hz)' : 'SOUND: OFF'}</span>
        </button>

        {/* Cinemascope Modu Butonu */}
        <button
          onClick={() => setIsCinemascope(!isCinemascope)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-widest border transition-all ${
            isCinemascope
              ? 'bg-white text-black border-white'
              : 'bg-black/60 backdrop-blur-md text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
          }`}
          title="Anamorfik Sinema Çerçevesi"
        >
          <Film className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">2.39:1</span>
        </button>

        {/* Navigasyon Linkleri */}
        <Link
          href="/koleksiyon"
          className="px-3.5 py-2 text-xs font-mono uppercase tracking-widest bg-black/60 backdrop-blur-md text-neutral-300 border border-white/10 hover:border-white/40 hover:text-white transition-colors"
        >
          Katalog
        </Link>
        <Link
          href="/"
          className="px-3.5 py-2 text-xs font-mono uppercase tracking-widest bg-white text-black border border-white hover:bg-neutral-200 transition-colors"
        >
          Vitrine Dön
        </Link>
      </div>

      {/* 7. ALT KONTROL ÇUBUĞU: GÖRÜNÜM MODLARI & ZOOM KONTROLLERİ */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-wrap items-center justify-center gap-3 max-w-full px-4">
        {/* Görünüm Modları */}
        <div className="flex items-center bg-black/80 backdrop-blur-md border border-white/15 p-1">
          <button
            onClick={() => setViewMode('constellation')}
            className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest transition-all ${
              viewMode === 'constellation'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Constellation
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest transition-all ${
              viewMode === 'timeline'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Timeline (2018–2025)
          </button>
          <button
            onClick={() => setViewMode('axis')}
            className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest transition-all ${
              viewMode === 'axis'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Axis Matrices
          </button>
        </div>

        {/* Kategori Filtresi */}
        <div className="hidden sm:flex items-center bg-black/80 backdrop-blur-md border border-white/15 p-1">
          {['ALL', 'OBJECT', 'SPACE', 'LINE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all ${
                filterCategory === cat
                  ? 'bg-neutral-100 text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Zoom & Reset Kontrolleri */}
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md border border-white/15 p-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Uzaklaş"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono text-[10px] text-neutral-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Yakınlaş"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanPos({ x: 0, y: 0 });
            }}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors border-l border-white/10 ml-1"
            title="Kamerayı Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8. SİNEMATİK ETKİLEŞİMLİ TUVAL (DRAGGABLE CINEMATIC CANVAS) */}
      <motion.div
        drag
        dragElastic={0.08}
        dragMomentum={true}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setTimeout(() => setIsDragging(false), 100);
          setPanPos((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }));
        }}
        animate={{ scale: zoomLevel }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className={`absolute top-0 left-0 w-[260vw] h-[220vh] origin-top-left ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* İnce Uzamsal Izgara Çizgileri */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Eser Kareleri & Sinematik Projektör Kartları */}
        {filteredItems.map((item) => {
          const isHovered = hoveredArtwork?.id === item.id;

          return (
            <motion.div
              key={item.id}
              style={{
                left: item.layout.x,
                top: item.layout.y,
                width: item.layout.w,
                height: item.layout.h,
              }}
              className="absolute group transition-all duration-700 ease-out"
              animate={{
                scale: isHovered ? 1.05 : 1,
                zIndex: isHovered ? 40 : 20,
              }}
              onMouseEnter={() => setHoveredArtwork(item)}
              onMouseLeave={() => setHoveredArtwork(null)}
            >
              {/* Sinematik Çerçeve */}
              <div className="relative w-full h-full bg-[#0d0f12] border border-neutral-800/80 group-hover:border-amber-400/80 transition-colors duration-500 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                {/* Sol Üst Reel / Çekim İndeksi */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                  <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-white/80 uppercase tracking-widest border border-white/10">
                    {item.reelCode}
                  </span>
                  {item.isUniquePiece && (
                    <span className="bg-amber-500/90 text-black px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-widest uppercase">
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
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                  title="Sinematik Projeksiyon Modu"
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
                    sizes="440px"
                    className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-108 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                  {/* Alt Bilgi Kartı */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 font-sans z-10">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                      <span>{item.category}</span>
                      <span className="text-white font-medium">{item.price}</span>
                    </div>

                    <h3 className="font-serif text-2xl text-white uppercase tracking-tight group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-[11px] font-sans text-neutral-400 line-clamp-1 mt-1 font-light">
                      {item.material}
                    </p>

                    {/* Detay Çağrısı */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono uppercase tracking-widest text-neutral-300">
                      <span>Uzamsal Detay →</span>
                      <span className="text-neutral-500">[{item.year}]</span>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 9. SİNEMATİK PROJEKSİYON LIGHTBOX / TAM EKRAN İNCELEME MODALI */}
      <AnimatePresence>
        {projectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 md:p-12 overflow-y-auto"
          >
            {/* Üst Kapatma & Başlık */}
            <div className="flex items-center justify-between border-b border-white/15 pb-6">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                    CINEMATIC PROJECTION • FULL APERTURE
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl text-white uppercase tracking-tight">
                    {projectedArtwork.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setProjectedArtwork(null)}
                className="p-3 rounded-full border border-white/20 text-neutral-300 hover:text-white hover:border-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Orta Görsel & Eser Odak Alanı */}
            <div className="my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
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
                    Eser Künyesi & Metin
                  </span>
                  <p className="text-sm font-sans font-light leading-relaxed text-neutral-200">
                    {projectedArtwork.description}
                  </p>
                  <div className="p-4 bg-neutral-900/80 border border-white/10 text-xs font-mono space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Maden / Taş:</span>
                      <span className="text-white text-right">{projectedArtwork.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Teknik:</span>
                      <span className="text-white text-right">{projectedArtwork.technique}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Ağırlık:</span>
                      <span className="text-white">{projectedArtwork.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Fiyat:</span>
                      <span className="text-amber-300 font-bold">{projectedArtwork.price}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <Link
                    href={`/koleksiyon/${projectedArtwork.id}`}
                    className="w-full py-4 bg-white text-black text-center font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    3D Uzamsal Parallax Moduna Geç →
                  </Link>
                  <button
                    onClick={() => setProjectedArtwork(null)}
                    className="w-full py-3 border border-white/20 text-neutral-400 text-center font-mono text-xs uppercase tracking-[0.2em] hover:text-white hover:border-white transition-colors"
                  >
                    Tuvala Geri Dön
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
