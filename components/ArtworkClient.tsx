'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  Share2,
  Maximize2,
  Mail,
  ChevronRight,
  Send,
  ArrowDown,
} from 'lucide-react';
import type { ArtworkDetail } from '@/lib/artworks-data';
import { getLocalizedArtwork } from '@/lib/artworks-data';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';
import CertificateOfAuthenticityModal from './CertificateOfAuthenticityModal';

interface ArtworkClientProps {
  artwork: ArtworkDetail;
}

export default function ArtworkClient({ artwork }: ArtworkClientProps) {
  const { language, t } = useLanguage();
  const localizedArtwork = useMemo(
    () => getLocalizedArtwork(artwork, language),
    [artwork, language]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 3D Uzamsal Parallax Modları & İğneleri (Spatial Parallax Modes)
  const [spatialMode, setSpatialMode] = useState<'orbit' | 'exploded' | 'specular'>('orbit');
  
  // Aktif Telemetri İğnesi (Default: 1 - Doku ve Materyal)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(1);

  // Eser Özelinde Dinamik ve Kristal Netliğinde Mikro Analiz Noktaları
  const specimenHotspots = useMemo(() => {
    const isEn = language === 'EN';
    return [
      {
        id: 1,
        pinNumber: '01',
        code: isEn ? 'SP-01 // MATERIAL & SURFACE TEXTURE' : 'SP-01 // MATERYAL & DOKUSAL KATMAN',
        tag: isEn ? 'SURFACE TEXTURE' : 'DOKUSAL YÜZEY',
        title: localizedArtwork.material,
        description: localizedArtwork.description,
        position: { top: '34%', left: '26%' },
      },
      {
        id: 2,
        pinNumber: '02',
        code: isEn ? 'SP-02 // CRAFT & FORGING TECHNIQUE' : 'SP-02 // ZANAAT & DÖKÜM TEKNİĞİ',
        tag: isEn ? 'FORGING TECHNIQUE' : 'ÜRETİM TEKNİĞİ',
        title: localizedArtwork.technique,
        description: isEn
          ? `Edition: ${localizedArtwork.isUniquePiece ? '1/1 Unique Specimen' : 'Limited Studio Series'} • Weight: ${localizedArtwork.weight} • Year: ${localizedArtwork.year}. Hand-shaped on hearth with open flame and artisan steel hammers.`
          : `Edisyon Durumu: ${localizedArtwork.isUniquePiece ? '1/1 Eşsiz Parça (Tek Nüsha)' : 'Limitli Koleksiyon Serisi'} • Eser Ağırlığı: ${localizedArtwork.weight} • Üretim Yılı: ${localizedArtwork.year}. Doğrudan ocak ateşi ve el aletleriyle biçimlendirilmiştir.`,
        position: { bottom: '28%', right: '24%' },
      },
    ];
  }, [localizedArtwork, language]);

  // Fare / Ekran 3 Boyutlu Uzamsal Hareketi (Interactive 3D Mouse Movement)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Yumuşak yay fiziği ile 3D tilt
  const smoothMouseX = useSpring(mousePos.x, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(mousePos.y, { stiffness: 60, damping: 20 });

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    note: '',
  });

  // Global Page Scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Hero Scroller Parallax
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothHeroProgress = useSpring(heroScrollProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.3,
  });

  // 1. Tipografi Dönüşümleri
  const typographyScale = useTransform(smoothHeroProgress, [0, 0.9], [1, 1.35]);
  const typographyY = useTransform(smoothHeroProgress, [0, 1], ['0%', '-45%']);
  const typographyOpacity = useTransform(smoothHeroProgress, [0, 0.75, 1], [1, 0.6, 0]);

  // 2. Uzamsal Çoklu Görseller (3D Spatially Distributed Floating Images)
  const img1Y = useTransform(smoothHeroProgress, [0, 1], ['0%', '18%']);
  const img1Scale = useTransform(smoothHeroProgress, [0, 1], [1, 0.94]);
  const img1Rotate = useTransform(smoothHeroProgress, [0, 1], [0, -3]);

  const img2Y = useTransform(smoothHeroProgress, [0, 1], ['0%', '-32%']);
  const img2Scale = useTransform(smoothHeroProgress, [0, 1], [1, 1.12]);
  const img2Rotate = useTransform(smoothHeroProgress, [0, 1], [-4, 6]);

  const img3Y = useTransform(smoothHeroProgress, [0, 1], ['0%', '38%']);
  const img3Scale = useTransform(smoothHeroProgress, [0, 1], [1, 0.86]);
  const img3Rotate = useTransform(smoothHeroProgress, [0, 1], [3, -5]);

  // Arka plan atmosferi
  const bgScale = useTransform(smoothHeroProgress, [0, 1], [1, 1.2]);
  const bgOpacity = useTransform(smoothHeroProgress, [0, 0.85], [1, 0.2]);

  // Alt Rozet
  const badgeY = useTransform(smoothHeroProgress, [0, 1], ['0%', '-60%']);
  const progressBar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Çoklu görsel havuzu (En az 3 görsel temin edilir)
  const displayImages = [
    localizedArtwork.images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85',
    localizedArtwork.images[1] || localizedArtwork.images[0],
    localizedArtwork.images[2] || localizedArtwork.images[0],
  ];

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${localizedArtwork.title} — Derin Buse Demirkaya`,
          text: localizedArtwork.description,
          url: window.location.href,
        });
      } catch {
        // Kullanıcı iptal etti
      }
    } else if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const activeSpotData = activeHotspot === 2 ? specimenHotspots[1] : specimenHotspots[0];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0a0a0a] text-neutral-100 selection:bg-white selection:text-black overflow-x-clip"
    >
      {/* İnce Akış Göstergesi (Spatial Progress Line) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/10 z-50">
        <motion.div
          style={{ width: progressBar }}
          className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
        />
      </div>

      {/* Üst Şeffaf Navigasyon */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/50 to-transparent backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/koleksiyon"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-sans text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>{language === 'EN' ? 'Back to Collection' : 'Koleksiyon Arşivi'}</span>
          </Link>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest uppercase text-neutral-400">
              {localizedArtwork.collectionName} — {localizedArtwork.year}
            </span>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-300 hover:text-white px-3 py-1.5 rounded-full border border-white/15 hover:border-white/40 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">
                    {language === 'EN' ? 'Link Copied' : 'Kopyalandı'}
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{language === 'EN' ? 'Share' : 'Paylaş'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🌌 BÖLÜM 1: UZAMSAL PARALLAX & ÇOKLU GÖRSEL SAHNESİ (SPATIAL STAGE) */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        className="relative min-h-[125vh] sm:min-h-[140vh] w-full flex flex-col items-center justify-center overflow-hidden [perspective:1400px] pt-24 pb-20"
      >
        {/* Katman A: Derin Arka Plan (Deep Blur Glow Atmosphere) */}
        <motion.div
          style={{ scale: bgScale, opacity: bgOpacity }}
          className="absolute inset-0 z-0 pointer-events-none will-change-transform"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08)_0%,transparent_65%)] z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10" />
          <Image
            src={displayImages[0]}
            alt="Atmosfer"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20 filter blur-[40px] scale-125"
          />
        </motion.div>

        {/* Katman B: ZARİF VE NET TİPOGRAFİ */}
        <motion.div
          style={{
            scale: typographyScale,
            y: typographyY,
            opacity: typographyOpacity,
          }}
          className="relative z-30 text-center px-4 mb-8 sm:mb-12 pointer-events-none select-none will-change-transform max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-300">
              {localizedArtwork.category} • {localizedArtwork.year}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-white uppercase leading-[0.95] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            {localizedArtwork.title}
          </h1>

          <p className="font-sans text-xs sm:text-sm text-neutral-400 tracking-[0.2em] uppercase mt-4 max-w-lg mx-auto">
            {localizedArtwork.collectionName}
          </p>

          {/* Uzamsal Parallax Mod Seçici */}
          <div className="mt-6 inline-flex items-center gap-2 p-1.5 bg-black/90 border border-neutral-700 rounded-full pointer-events-auto shadow-xl">
            <button
              onClick={() => setSpatialMode('orbit')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                spatialMode === 'orbit'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {t('artwork.orbit')}
            </button>
            <button
              onClick={() => setSpatialMode('exploded')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                spatialMode === 'exploded'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {t('artwork.exploded')}
            </button>
            <button
              onClick={() => setSpatialMode('specular')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                spatialMode === 'specular'
                  ? 'bg-amber-300 text-black font-bold shadow-md'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {t('artwork.specular')}
            </button>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* Katman C: 3 BOYUTLU ETRAFA DAĞILMIŞ ÇOKLU GÖRSELLER (Spatial Constellation) */}
        {/* ========================================================================= */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 h-[480px] sm:h-[580px] md:h-[650px] [transform-style:preserve-3d]">
          
          {/* GÖRSEL 1: MERKEZİ HEYKELSİ FORM (PRIMARY FOCUS) */}
          <motion.div
            style={{
              y: img1Y,
              scale: img1Scale,
              rotateZ: img1Rotate,
              x: useTransform(smoothMouseX, (v) => v * (spatialMode === 'exploded' ? 25 : 15)),
              rotateY: useTransform(smoothMouseX, (v) => v * (spatialMode === 'exploded' ? 16 : 8)),
              rotateX: useTransform(smoothMouseY, (v) => -v * (spatialMode === 'exploded' ? 16 : 8)),
            }}
            onClick={() => {
              setActiveImageIndex(0);
              setIsZoomOpen(true);
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[72vw] sm:w-[46vw] md:w-[32vw] max-w-[420px] aspect-[4/5] cursor-pointer group will-change-transform shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-white/20 bg-neutral-900 overflow-hidden [transform-style:preserve-3d]"
          >
            <Image
              src={displayImages[0]}
              alt={`${localizedArtwork.title} Ana Form`}
              fill
              priority
              sizes="(max-width: 768px) 75vw, 35vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            
            {/* Dinamik Işık Parlaması (Specular Light Sheen) */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                spatialMode === 'specular' ? 'opacity-90' : 'opacity-30'
              }`}
              style={{
                background: `radial-gradient(circle 320px at ${(mousePos.x + 0.5) * 100}% ${(mousePos.y + 0.5) * 100}%, rgba(255,255,255,0.4) 0%, transparent 70%)`,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            {/* Eser Durum Rozeti */}
            <div className="absolute top-3 left-3 z-30 pointer-events-none">
              {localizedArtwork.isUniquePiece ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-amber-300 border border-amber-400 font-mono text-xs uppercase tracking-wider font-semibold shadow-md">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {t('artwork.unique')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-neutral-200 border border-white/40 font-mono text-xs uppercase tracking-wider font-semibold shadow-md">
                  {t('artwork.limited')}
                </span>
              )}
            </div>

            {/* 3D KOORDİNAT İĞNELERİ (Hotspots with Zero-Overflow & High Contrast Beacon) */}
            {specimenHotspots.map((spot) => {
              const isSelected = activeHotspot === spot.id;
              return (
                <div
                  key={spot.id}
                  style={{
                    top: spot.position.top,
                    left: spot.position.left,
                    bottom: spot.position.bottom,
                    right: spot.position.right,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(isSelected ? null : spot.id);
                  }}
                  className="absolute z-40 cursor-pointer group/pin"
                  title={`${spot.tag}: ${language === 'EN' ? 'Click to inspect in docked console below' : 'Aşağıdaki panelde incelemek için tıklayın'}`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`animate-ping absolute inline-flex h-8 w-8 rounded-full ${
                        isSelected ? 'bg-amber-400 opacity-90' : 'bg-white opacity-60'
                      }`}
                    />
                    <div
                      className={`relative inline-flex items-center justify-center rounded-full h-6 w-6 font-mono text-[10px] font-bold transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)] border-2 ${
                        isSelected
                          ? 'bg-amber-400 text-black border-white scale-110 shadow-[0_0_18px_#f59e0b]'
                          : 'bg-black text-white border-amber-300 group-hover/pin:scale-110'
                      }`}
                    >
                      {spot.pinNumber}
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(0);
                setIsZoomOpen(true);
              }}
              aria-label="Büyüt"
              className="absolute bottom-3 right-3 p-2.5 bg-black/90 hover:bg-white hover:text-black text-white rounded-full border border-white/30 transition-all opacity-0 group-hover:opacity-100"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3 text-xs font-mono font-semibold text-white bg-black/90 px-2.5 py-1 border border-white/30 uppercase tracking-widest">
              {language === 'EN' ? 'Primary Focus • 01 [Z: 0mm]' : 'Ana Form • 01 [Z: 0mm]'}
            </div>
          </motion.div>

          {/* GÖRSEL 2: SOL UZAMSAL KART (MAKRO DOKU & YAKIN DETAY) */}
          <motion.div
            style={{
              y: img2Y,
              scale: img2Scale,
              rotateZ: img2Rotate,
              x: useTransform(smoothMouseX, (v) => -v * (spatialMode === 'exploded' ? 55 : 28)),
              rotateY: useTransform(smoothMouseX, (v) => -v * (spatialMode === 'exploded' ? 22 : 12)),
              rotateX: useTransform(smoothMouseY, (v) => v * (spatialMode === 'exploded' ? 18 : 10)),
            }}
            onClick={() => {
              setActiveImageIndex(1);
              setIsZoomOpen(true);
            }}
            className="absolute left-[3%] sm:left-[6%] md:left-[8%] top-[28%] sm:top-[22%] z-25 w-[44vw] sm:w-[30vw] md:w-[22vw] max-w-[280px] aspect-square cursor-pointer group will-change-transform shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/20 bg-neutral-900 overflow-hidden"
          >
            <Image
              src={displayImages[1]}
              alt={`${localizedArtwork.title} Makro Açı`}
              fill
              sizes="(max-width: 768px) 45vw, 22vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-2 left-2 bg-black text-white px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider border border-white/30">
              {language === 'EN' ? 'Micro-Texture • 02 [Z: +80mm]' : 'Mikro Doku • 02 [Z: +80mm]'}
            </div>
          </motion.div>

          {/* GÖRSEL 3: SAĞ UZAMSAL KART (PERSPEKTİF & AÇI DERİNLİĞİ) */}
          <motion.div
            style={{
              y: img3Y,
              scale: img3Scale,
              rotateZ: img3Rotate,
              x: useTransform(smoothMouseX, (v) => v * (spatialMode === 'exploded' ? 48 : 24)),
              rotateY: useTransform(smoothMouseX, (v) => v * (spatialMode === 'exploded' ? 24 : 14)),
              rotateX: useTransform(smoothMouseY, (v) => -v * (spatialMode === 'exploded' ? 18 : 10)),
            }}
            onClick={() => {
              setActiveImageIndex(2);
              setIsZoomOpen(true);
            }}
            className="absolute right-[3%] sm:right-[6%] md:right-[8%] top-[12%] sm:top-[16%] z-15 w-[42vw] sm:w-[28vw] md:w-[20vw] max-w-[260px] aspect-[4/5] cursor-pointer group will-change-transform shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/15 bg-neutral-900 overflow-hidden"
          >
            <Image
              src={displayImages[2]}
              alt={`${localizedArtwork.title} Perspektif Açı`}
              fill
              sizes="(max-width: 768px) 45vw, 20vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-2 left-2 bg-black text-white px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider border border-white/30">
              {language === 'EN' ? 'Light Angle • 03 [Z: -60mm]' : 'Işık Kırılımı • 03 [Z: -60mm]'}
            </div>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* 🔬 KRİSTAL NETLİĞİNDE DİJİTAL TELEMETRİ KONSOLU (Ultra-Crisp Docked Console) */}
        {/* Görselin dışında yer alır: Asla taşmaz, 3D bulanıklığı yaşamaz, %100 net */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full max-w-4xl mx-auto px-4 sm:px-6 mt-6 sm:mt-10">
          <div className="bg-neutral-950/95 border-2 border-white/20 hover:border-white/35 transition-all p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl">
            {/* Konsol Üst Şeridi */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-85"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <div>
                  <span className="text-amber-400 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] block">
                    {activeSpotData.code}
                  </span>
                  <span className="text-neutral-400 font-mono text-[10px] uppercase tracking-wider block">
                    {language === 'EN' ? 'HIGH-RESOLUTION SPECIMEN SURFACE TELEMETRY' : 'YÜKSEK ÇÖZÜNÜRLÜKLÜ ESER YÜZEY TELEMETRİSİ'}
                  </span>
                </div>
              </div>
              
              {/* İğne Seçici Butonlar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveHotspot(1)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                    activeHotspot === 1
                      ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-[0_0_15px_rgba(251,191,36,0.35)]'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{t('artwork.pin1')}</span>
                </button>
                <button
                  onClick={() => setActiveHotspot(2)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                    activeHotspot === 2
                      ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-[0_0_15px_rgba(251,191,36,0.35)]'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{t('artwork.pin2')}</span>
                </button>
              </div>
            </div>

            {/* İçerik Alanı - Kristal Netliğinde Tipografi */}
            <div className="pt-5 space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-semibold">
                  {activeSpotData.tag}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border border-neutral-800 px-2 py-0.5">
                  {language === 'EN' ? '100% NATIVE DENSITY • CRYSTAL RESOLUTION' : '100% ÇÖZÜNÜRLÜK • KRİSTAL NETLİK'}
                </span>
              </div>

              <h4 className="font-serif text-xl sm:text-2xl text-white font-normal leading-snug">
                {activeSpotData.title}
              </h4>

              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-light">
                {activeSpotData.description}
              </p>

              {/* Teknik Parametreler */}
              <div className="pt-4 mt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-500 uppercase">{t('artwork.dimensions')}:</span>
                  <span className="text-white font-medium">{localizedArtwork.dimensions}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-500 uppercase">{t('artwork.weight')}:</span>
                  <span className="text-white font-medium">{localizedArtwork.weight}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-500 uppercase">{language === 'EN' ? 'FINISH:' : 'BİTİŞ:'}</span>
                  <span className="text-white font-medium">{localizedArtwork.finish}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Katman D: Uzamsal Fiyat & Satın Alma Rozeti */}
        <motion.div
          style={{ y: badgeY }}
          className="relative z-30 flex flex-col items-center gap-3 mt-8 sm:mt-10 will-change-transform"
        >
          <div className="flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <span className="font-serif text-2xl sm:text-3xl text-white font-light">
              {localizedArtwork.price}
            </span>
            <div className="h-4 w-[1px] bg-white/20" />
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-white text-black hover:bg-neutral-200 px-5 py-2 rounded-full font-sans text-xs uppercase tracking-widest font-semibold transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>{t('artwork.buy')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-sans tracking-widest uppercase mt-2 animate-pulse">
            <span>{t('artwork.scrollHint')}</span>
            <ArrowDown className="w-3 h-3" />
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 📐 BÖLÜM 2: MİMARİ AÇILAR & ÇOKLU PERSPEKTİF GALERİSİ */}
      {/* ========================================================================= */}
      <section className="relative z-30 max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-2">
              {t('artwork.anatomySub')}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
              {t('artwork.anatomyTitle')}
            </h2>
          </div>
          <p className="font-sans text-sm text-neutral-400 max-w-md">
            {t('artwork.anatomyDesc')}
          </p>
        </div>

        {/* Çoklu Görsel Karuseli / Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              onClick={() => {
                setActiveImageIndex(idx);
                setIsZoomOpen(true);
              }}
              className="group cursor-pointer flex flex-col gap-3"
            >
              <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden border border-white/10 group-hover:border-white/40 transition-colors">
                <Image
                  src={img}
                  alt={`${localizedArtwork.title} Açı ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-4 right-4 p-2 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-widest pt-2 border-t border-white/10">
                <span>{t('artwork.view')} 0{idx + 1}</span>
                <span className="text-white group-hover:text-amber-300 transition-colors">
                  {language === 'EN' ? 'Inspect Detail →' : 'Detayı İncele →'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📜 BÖLÜM 3: EDİTORYAL FELSEFE & TEKNİK ŞARTNAME (FİNAL ALIM BLOĞU) */}
      {/* ========================================================================= */}
      <section className="relative z-30 max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Sol: Küratöryel Anlatı & Felsefe */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-2">
                {t('artwork.philosophySub')}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-white">
                {t('artwork.philosophyTitle')}
              </h3>
            </div>

            <p className="font-sans text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
              {localizedArtwork.description}
            </p>

            <blockquote className="border-l-2 border-amber-300/60 pl-6 py-2 italic font-serif text-lg text-neutral-200">
              &ldquo;{localizedArtwork.editorialNote}&rdquo;
            </blockquote>

            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                  {t('artwork.metalClay')}
                </span>
                <p className="font-sans text-sm text-white font-medium">
                  {localizedArtwork.material}
                </p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                  {t('artwork.technique')}
                </span>
                <p className="font-sans text-sm text-white font-medium">
                  {localizedArtwork.technique}
                </p>
              </div>
            </div>
          </div>

          {/* Sağ: Teknik Şartname & Satın Alma Terminali */}
          <div className="lg:col-span-6 bg-black/70 border border-white/15 p-8 sm:p-10 shadow-2xl relative">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                  {t('artwork.recordTitle')}
                </span>
                <h4 className="font-serif text-2xl text-white mt-0.5">
                  {localizedArtwork.title}
                </h4>
              </div>
              <span className="font-serif text-2xl text-amber-200">
                {localizedArtwork.price}
              </span>
            </div>

            {/* Özellikler Tablosu (Fully Localized) */}
            <div className="divide-y divide-white/10 font-sans text-xs py-4">
              {localizedArtwork.specs.map((item, i) => (
                <div key={i} className="py-3 flex justify-between items-center gap-4">
                  <span className="text-neutral-400 uppercase tracking-wider">{item.label}</span>
                  <span className="text-white text-right font-mono font-medium">{item.value}</span>
                </div>
              ))}
              <div className="py-3 flex justify-between items-center gap-4">
                <span className="text-neutral-400 uppercase tracking-wider">{t('artwork.dimensions')}</span>
                <span className="text-white text-right font-mono font-medium">{localizedArtwork.dimensions}</span>
              </div>
              <div className="py-3 flex justify-between items-center gap-4">
                <span className="text-neutral-400 uppercase tracking-wider">{t('artwork.weight')}</span>
                <span className="text-white text-right font-mono font-medium">{localizedArtwork.weight}</span>
              </div>
              <div className="py-3 flex justify-between items-center gap-4">
                <span className="text-neutral-400 uppercase tracking-wider">{t('artwork.status')}</span>
                <span className="text-emerald-400 uppercase font-mono tracking-wider">
                  {localizedArtwork.stock > 0
                    ? `${t('artwork.inStudio')} (${localizedArtwork.stock} ${t('artwork.pieces')})`
                    : t('artwork.customOrder')}
                </span>
              </div>
            </div>

            {/* Satın Alma Butonu */}
            <div className="pt-6 space-y-3">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full py-4 px-6 bg-white hover:bg-neutral-200 text-black font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{t('artwork.orderBtn')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={`mailto:sircaedebiyat@gmail.com?subject=${encodeURIComponent(
                  language === 'EN'
                    ? `Artwork Inquiry: ${localizedArtwork.title}`
                    : `Eser Talebi: ${localizedArtwork.title}`
                )}`}
                className="w-full py-3.5 px-6 border border-white/20 hover:border-white text-white font-sans text-xs uppercase tracking-[0.2em] transition-all text-center flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t('artwork.contactBtn')}</span>
              </a>
            </div>

            {/* Orijinallik ve Sigorta İkonları */}
            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setIsCertModalOpen(true);
                }}
                className="flex items-start gap-2 text-left text-neutral-300 hover:text-amber-300 transition-colors group cursor-pointer"
                title={language === 'EN' ? 'View Official Certificate of Authenticity' : 'Resmi Orijinallik Sertifikasını İncele'}
              >
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="underline decoration-amber-400/50 underline-offset-4 font-medium block">
                    {t('artwork.cert')}
                  </span>
                  <span className="text-[10px] text-neutral-400 group-hover:text-amber-300 font-mono block mt-0.5">
                    {language === 'EN' ? 'Inspect Official COA ↗' : 'Resmi Belgeyi Gör ↗'}
                  </span>
                </div>
              </button>
              <div className="flex items-start gap-2 text-neutral-300">
                <Truck className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>{t('artwork.crate')}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🚀 BÖLÜM 4: ALT SİNEMATİK ÇAĞRI (ATÖLYE & DİĞER ESERLER) */}
      {/* ========================================================================= */}
      <section className="relative py-24 text-center border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">
            {t('artwork.exploreSub')}
          </span>
          <h3 className="font-serif text-3xl sm:text-5xl text-white">
            {t('artwork.exploreTitle')}
          </h3>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/koleksiyon"
              className="px-8 py-3.5 bg-neutral-900 border border-white/20 hover:border-white text-white font-sans text-xs uppercase tracking-widest transition-colors"
            >
              {t('artwork.exploreAll')}
            </Link>
            <Link
              href="/atolye"
              className="px-8 py-3.5 bg-white text-black hover:bg-neutral-200 font-sans text-xs uppercase tracking-widest transition-colors font-medium"
            >
              {t('artwork.exploreWorkshops')}
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🔍 FULLSCREEN GÖRSEL BÜYÜTME MODALI */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative w-full max-w-5xl aspect-[4/5] sm:aspect-square max-h-[90vh]">
              <Image
                src={displayImages[activeImageIndex] || displayImages[0]}
                alt={localizedArtwork.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white uppercase font-sans text-xs tracking-widest px-4 py-2 border border-white/20 rounded-full"
            >
              {t('artwork.close')} ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 💳 SATIN ALMA & REZERVASYON MODALI */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#141414] text-neutral-100 w-full max-w-lg border border-white/20 p-8 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsOrderModalOpen(false);
                  setIsSuccess(false);
                }}
                className="absolute top-6 right-6 text-neutral-400 hover:text-white text-xs font-sans uppercase tracking-widest"
              >
                ✕ {t('artwork.close')}
              </button>

              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-white/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl text-white">
                    {language === 'EN' ? 'Reservation Request Received' : 'Rezervasyon Talebiniz Alındı'}
                  </h3>
                  <p className="font-sans text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
                    {language === 'EN' ? (
                      <>
                        Your request for <strong>{localizedArtwork.title}</strong> has reached our studio.
                        A private viewing and acquisition plan will be sent to <strong>{formData.email}</strong> within 24 hours.
                      </>
                    ) : (
                      <>
                        <strong>{localizedArtwork.title}</strong> eseri için talebiniz atölyemize ulaştı.
                        Detaylar ve güvenli alım planı için 24 saat içinde <strong>{formData.email}</strong> adresine dönüş yapılacaktır.
                      </>
                    )}
                  </p>
                  <button
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setIsSuccess(false);
                    }}
                    className="mt-6 px-6 py-3 bg-white text-black text-xs uppercase tracking-widest hover:bg-neutral-200 font-medium"
                  >
                    {t('artwork.close')}
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                    {t('artwork.modalTitle')}
                  </span>
                  <h2 className="font-serif text-2xl text-white mb-1">
                    {localizedArtwork.title}
                  </h2>
                  <p className="font-sans text-sm text-neutral-300 mb-6">
                    {language === 'EN' ? 'Amount:' : 'Tutar:'}{' '}
                    <span className="font-semibold text-white">{localizedArtwork.price}</span>{' '}
                    ({language === 'EN' ? 'Insured courier & authenticity certificate included' : 'Sigortalı kargo ve sertifika dahil'})
                  </p>

                  <form onSubmit={handleOrderSubmit} className="space-y-4 font-sans text-xs">
                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider mb-1">
                        {language === 'EN' ? 'Full Name *' : 'Adınız Soyadınız *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={language === 'EN' ? 'e.g. Eleanor Vance' : 'Örn: Selin Yılmaz'}
                        className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-white focus:outline-none rounded-none text-sm text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-300 uppercase tracking-wider mb-1">
                          {language === 'EN' ? 'Email Address *' : 'E-posta *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@domain.com"
                          className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-white focus:outline-none rounded-none text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-300 uppercase tracking-wider mb-1">
                          {language === 'EN' ? 'Phone Number *' : 'Telefon *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+90 5XX XXX XX XX"
                          className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-white focus:outline-none rounded-none text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider mb-1">
                        {language === 'EN' ? 'Delivery City / Country' : 'Teslimat Şehri'}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder={language === 'EN' ? 'e.g. London / UK or Istanbul' : 'Örn: İstanbul / Kadıköy'}
                        className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-white focus:outline-none rounded-none text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider mb-1">
                        {language === 'EN' ? 'Sizing or Specific Requests (Optional)' : 'Özel Not veya Ölçü Talebi (Opsiyonel)'}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder={
                          language === 'EN'
                            ? 'Ring size, wrist circumference, or custom questions...'
                            : 'Varsa parmak ölçünüz veya teslimat notunuz...'
                        }
                        className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-white focus:outline-none rounded-none text-sm text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-sans text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-lg"
                    >
                      {isSubmitting ? (
                        <span>{language === 'EN' ? 'Transmitting...' : 'İletiliyor...'}</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {language === 'EN' ? 'Submit Request' : 'Talebi İlet'} ({localizedArtwork.price})
                          </span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-neutral-400 text-center mt-2">
                      {language === 'EN'
                        ? 'This action does not charge your card. Our artisan studio will contact you directly.'
                        : 'Bu işlem kartınızdan çekim yapmaz. Atölye sizinle doğrudan iletişime geçer.'}
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📜 ORİJİNALLİK VE MÜLKİYET SERTİFİKASI MODALI (COA) */}
      <CertificateOfAuthenticityModal
        artwork={artwork}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
}
