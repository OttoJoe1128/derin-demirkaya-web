'use client';

import { useState, useRef, useEffect } from 'react';
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
  Compass,
  ArrowDown,
} from 'lucide-react';
import type { ArtworkDetail } from '@/lib/artworks-data';

interface ArtworkClientProps {
  artwork: ArtworkDetail;
}

export default function ArtworkClient({ artwork }: ArtworkClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Fare / Ekran 3 Boyutlu Uzamsal Hareketi (Interactive 3D Mouse Movement)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Ekran merkezine göre normalize edilmiş -1 ile +1 arası değer
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

  // 1. Tipografi Dönüşümleri (Kameraya yaklaşan devasa tipografi, görsellerin arkasında boğulmaz)
  const typographyScale = useTransform(smoothHeroProgress, [0, 0.9], [1, 1.35]);
  const typographyY = useTransform(smoothHeroProgress, [0, 1], ['0%', '-45%']);
  const typographyOpacity = useTransform(smoothHeroProgress, [0, 0.75, 1], [1, 0.6, 0]);

  // 2. Uzamsal Çoklu Görseller (3D Spatially Distributed Floating Images)
  // Görsel 1: Ana Merkez Kart (Primary Sculpture)
  const img1Y = useTransform(smoothHeroProgress, [0, 1], ['0%', '18%']);
  const img1Scale = useTransform(smoothHeroProgress, [0, 1], [1, 0.94]);
  const img1Rotate = useTransform(smoothHeroProgress, [0, 1], [0, -3]);

  // Görsel 2: Sol Alt / Orta Makro Detay Kartı (Daha hızlı yukarı fırlayan katman)
  const img2Y = useTransform(smoothHeroProgress, [0, 1], ['0%', '-32%']);
  const img2Scale = useTransform(smoothHeroProgress, [0, 1], [1, 1.12]);
  const img2Rotate = useTransform(smoothHeroProgress, [0, 1], [-4, 6]);

  // Görsel 3: Sağ Üst / Orta Perspektif Kartı (Daha derinlikte yavaş süzülen katman)
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
    artwork.images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85',
    artwork.images[1] || artwork.images[0],
    artwork.images[2] || artwork.images[0],
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${artwork.title} — Derin Demirkaya`,
          text: artwork.description,
          url: window.location.href,
        });
      } catch {
        // Kullanıcı iptal etti
      }
    } else {
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
            <span>Koleksiyon Arşivi</span>
          </Link>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest uppercase text-neutral-400">
              {artwork.collectionName} — {artwork.year}
            </span>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-300 hover:text-white px-3 py-1.5 rounded-full border border-white/15 hover:border-white/40 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Paylaş</span>
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

        {/* Katman B: ZARİF VE NET TİPOGRAFİ (Görsellerin arkasında boğulmaz, z-30) */}
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
              {artwork.category} • {artwork.year}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-white uppercase leading-[0.95] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            {artwork.title}
          </h1>

          <p className="font-sans text-xs sm:text-sm text-neutral-400 tracking-[0.2em] uppercase mt-4 max-w-lg mx-auto">
            {artwork.collectionName}
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* Katman C: 3 BOYUTLU ETRAFA DAĞILMIŞ ÇOKLU GÖRSELLER (Spatial Constellation) */}
        {/* ========================================================================= */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 h-[480px] sm:h-[580px] md:h-[650px]">
          
          {/* GÖRSEL 1: MERKEZİ HEYKELSİ FORM (PRIMARY FOCUS) */}
          <motion.div
            style={{
              y: img1Y,
              scale: img1Scale,
              rotateZ: img1Rotate,
              x: useTransform(smoothMouseX, (v) => v * 15),
              rotateY: useTransform(smoothMouseX, (v) => v * 8),
              rotateX: useTransform(smoothMouseY, (v) => -v * 8),
            }}
            onClick={() => {
              setActiveImageIndex(0);
              setIsZoomOpen(true);
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[72vw] sm:w-[46vw] md:w-[32vw] max-w-[420px] aspect-[4/5] cursor-pointer group will-change-transform shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-white/15 bg-neutral-900 overflow-hidden"
          >
            <Image
              src={displayImages[0]}
              alt={`${artwork.title} Ana Form`}
              fill
              priority
              sizes="(max-width: 768px) 75vw, 35vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            <div className="absolute top-3 left-3 z-30">
              {artwork.isUniquePiece ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-amber-500/30 text-[9px] uppercase tracking-widest text-amber-200">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  1/1 Eşsiz Eser
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-[9px] uppercase tracking-widest text-neutral-300">
                  Limitli Seri
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(0);
                setIsZoomOpen(true);
              }}
              aria-label="Büyüt"
              className="absolute bottom-3 right-3 p-2 bg-black/70 hover:bg-white hover:text-black text-white rounded-full border border-white/20 transition-all opacity-0 group-hover:opacity-100"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/70 uppercase tracking-widest">
              Ana Form • 01
            </div>
          </motion.div>

          {/* GÖRSEL 2: SOL UZAMSAL KART (MAKRO DOKU & YAKIN DETAY) */}
          <motion.div
            style={{
              y: img2Y,
              scale: img2Scale,
              rotateZ: img2Rotate,
              x: useTransform(smoothMouseX, (v) => -v * 28),
              rotateY: useTransform(smoothMouseX, (v) => -v * 12),
              rotateX: useTransform(smoothMouseY, (v) => v * 10),
            }}
            onClick={() => {
              setActiveImageIndex(1);
              setIsZoomOpen(true);
            }}
            className="absolute left-[3%] sm:left-[6%] md:left-[8%] top-[28%] sm:top-[22%] z-25 w-[44vw] sm:w-[30vw] md:w-[22vw] max-w-[280px] aspect-square cursor-pointer group will-change-transform shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/20 bg-neutral-900 overflow-hidden"
          >
            <Image
              src={displayImages[1]}
              alt={`${artwork.title} Makro Açı`}
              fill
              sizes="(max-width: 768px) 45vw, 22vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] font-mono uppercase text-neutral-300 backdrop-blur-sm border border-white/10">
              Mikro Doku • 02
            </div>
          </motion.div>

          {/* GÖRSEL 3: SAĞ UZAMSAL KART (PERSPEKTİF & AÇI DERİNLİĞİ) */}
          <motion.div
            style={{
              y: img3Y,
              scale: img3Scale,
              rotateZ: img3Rotate,
              x: useTransform(smoothMouseX, (v) => v * 24),
              rotateY: useTransform(smoothMouseX, (v) => v * 14),
              rotateX: useTransform(smoothMouseY, (v) => -v * 10),
            }}
            onClick={() => {
              setActiveImageIndex(2);
              setIsZoomOpen(true);
            }}
            className="absolute right-[3%] sm:right-[6%] md:right-[8%] top-[12%] sm:top-[16%] z-15 w-[42vw] sm:w-[28vw] md:w-[20vw] max-w-[260px] aspect-[4/5] cursor-pointer group will-change-transform shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/15 bg-neutral-900 overflow-hidden"
          >
            <Image
              src={displayImages[2]}
              alt={`${artwork.title} Perspektif Açı`}
              fill
              sizes="(max-width: 768px) 45vw, 20vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] font-mono uppercase text-neutral-300 backdrop-blur-sm border border-white/10">
              Işık Kırılımı • 03
            </div>
          </motion.div>

        </div>

        {/* Katman D: Uzamsal Fiyat & Satın Alma Rozeti */}
        <motion.div
          style={{ y: badgeY }}
          className="relative z-30 flex flex-col items-center gap-3 mt-6 sm:mt-10 will-change-transform"
        >
          <div className="flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <span className="font-serif text-2xl sm:text-3xl text-white font-light">
              {artwork.price}
            </span>
            <div className="h-4 w-[1px] bg-white/20" />
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-white text-black hover:bg-neutral-200 px-5 py-2 rounded-full font-sans text-xs uppercase tracking-widest font-semibold transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Satın Al / Rezerve Et</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-sans tracking-widest uppercase mt-2 animate-pulse">
            <span>Aşağı Kaydırın & Detayları İnceleyin</span>
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
              Perspektif & Dokusal Yansımalar
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
              Eserin Görsel Anatomisi
            </h2>
          </div>
          <p className="font-sans text-sm text-neutral-400 max-w-md">
            Işığın ve el çekicinin yüzeyde bıraktığı rastlantısal mikro izler, her açıda bambaşka bir gölge oyunu meydana getirir.
          </p>
        </div>

        {/* Çoklu Görsel Karuseli / Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artwork.images.map((img, idx) => (
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
                  alt={`${artwork.title} Açı ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-3 left-3 bg-black/80 px-2.5 py-1 text-[10px] font-mono uppercase text-neutral-300 backdrop-blur-sm border border-white/10">
                  Görünüm 0{idx + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🗿 BÖLÜM 3: ZANAAT & DERİNLEMESİNE MATERYAL ANATOMİSİ */}
      {/* ========================================================================= */}
      <section className="relative z-30 bg-[#0f0f0f] py-28 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Sol: Felsefe & Editoryal Anlatım */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Malzemenin Belleği & Felsefe</span>
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-white">
                Kusurluluktaki Ebedi Uyum
              </h3>
            </div>

            <p className="font-sans text-base text-neutral-300 leading-relaxed">
              {artwork.description}
            </p>

            <blockquote className="border-l-2 border-white/40 pl-6 py-2 italic font-serif text-lg text-neutral-300 bg-white/[0.02]">
              &ldquo;{artwork.editorialNote}&rdquo;
            </blockquote>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="border border-white/10 p-5 bg-black/40">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  Maden / Çamur
                </span>
                <p className="font-sans text-sm text-white font-medium">
                  {artwork.material}
                </p>
              </div>

              <div className="border border-white/10 p-5 bg-black/40">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  İşleme Tekniği
                </span>
                <p className="font-sans text-sm text-white font-medium">
                  {artwork.technique}
                </p>
              </div>
            </div>
          </div>

          {/* Sağ: Teknik Şartname & Satın Alma Terminali */}
          <div className="lg:col-span-6 bg-black/70 border border-white/15 p-8 sm:p-10 shadow-2xl relative">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                  Resmi Eser Kaydı
                </span>
                <h4 className="font-serif text-2xl text-white mt-0.5">
                  {artwork.title}
                </h4>
              </div>
              <span className="font-serif text-2xl text-amber-200">
                {artwork.price}
              </span>
            </div>

            {/* Özellikler Tablosu */}
            <div className="divide-y divide-white/10 font-sans text-xs py-4">
              {artwork.specs.map((item, i) => (
                <div key={i} className="py-3 flex justify-between items-center gap-4">
                  <span className="text-neutral-400 uppercase tracking-wider">{item.label}</span>
                  <span className="text-white text-right font-mono font-medium">{item.value}</span>
                </div>
              ))}
              <div className="py-3 flex justify-between items-center gap-4">
                <span className="text-neutral-400 uppercase tracking-wider">Boyut & Ölçü</span>
                <span className="text-white text-right font-mono font-medium">{artwork.dimensions}</span>
              </div>
              <div className="py-3 flex justify-between items-center gap-4">
                <span className="text-neutral-400 uppercase tracking-wider">Ağırlık</span>
                <span className="text-white text-right font-mono font-medium">{artwork.weight}</span>
              </div>
              <div className="py-3 flex justify-between items-center gap-4">
                <span className="text-neutral-400 uppercase tracking-wider">Durum</span>
                <span className="text-emerald-400 uppercase font-mono tracking-wider">
                  {artwork.stock > 0 ? `Atölyede Mevcut (${artwork.stock} Adet)` : 'Özel Sipariş'}
                </span>
              </div>
            </div>

            {/* Satın Alma Butonu */}
            <div className="pt-6 space-y-3">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full py-4 px-6 bg-white hover:bg-neutral-200 text-black font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Satın Al / Rezervasyon Talebi</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={`mailto:sircaedebiyat@gmail.com?subject=Eser%20Talebi%3A%20${encodeURIComponent(artwork.title)}`}
                className="w-full py-3.5 px-6 border border-white/20 hover:border-white text-white font-sans text-xs uppercase tracking-[0.2em] transition-all text-center flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Sanatçıya Doğrudan Soru Sor</span>
              </a>
            </div>

            {/* Orijinallik ve Sigorta İkonları */}
            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-white/10 text-xs">
              <div className="flex items-start gap-2 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>Sanatçı imzalı orijinallik sertifikası dahildir.</span>
              </div>
              <div className="flex items-start gap-2 text-neutral-300">
                <Truck className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>Özel korunaklı sandık ile sigortalı teslimat.</span>
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
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500">
            Koleksiyon Keşfi
          </span>
          <h3 className="font-serif text-3xl sm:text-5xl text-white">
            Diğer Heykel ve Formları İnceleyin
          </h3>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/koleksiyon"
              className="px-8 py-3.5 bg-neutral-900 border border-white/20 hover:border-white text-white font-sans text-xs uppercase tracking-widest transition-colors"
            >
              Tüm Koleksiyon Arşivi
            </Link>
            <Link
              href="/atolye"
              className="px-8 py-3.5 bg-white text-black hover:bg-neutral-200 font-sans text-xs uppercase tracking-widest transition-colors font-medium"
            >
              Atölye Takvimini İncele
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
                alt={artwork.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white uppercase font-sans text-xs tracking-widest px-4 py-2 border border-white/20 rounded-full"
            >
              Kapat ✕
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
                ✕ Kapat
              </button>

              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-white/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl text-white">
                    Rezervasyon Talebiniz Alındı
                  </h3>
                  <p className="font-sans text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
                    <strong>{artwork.title}</strong> eseri için talebiniz atölyemize ulaştı. 
                    Detaylar ve güvenli ödeme/teslimat planı için 24 saat içinde <strong>{formData.email}</strong> adresine dönüş yapılacaktır.
                  </p>
                  <button
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setIsSuccess(false);
                    }}
                    className="mt-6 px-6 py-3 bg-white text-black text-xs uppercase tracking-widest hover:bg-neutral-200 font-medium"
                  >
                    Kapat
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                    Eser Rezervasyonu & Satın Alma
                  </span>
                  <h2 className="font-serif text-2xl text-white mb-1">
                    {artwork.title}
                  </h2>
                  <p className="font-sans text-sm text-neutral-300 mb-6">
                    Tutar: <span className="font-semibold text-white">{artwork.price}</span> (Sigortalı kargo ve sertifika dahil)
                  </p>

                  <form onSubmit={handleOrderSubmit} className="space-y-4 font-sans text-xs">
                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider mb-1">
                        Adınız Soyadınız *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Örn: Selin Yılmaz"
                        className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-white focus:outline-none rounded-none text-sm text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-300 uppercase tracking-wider mb-1">
                          E-posta *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ornek@alanadi.com"
                          className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-white focus:outline-none rounded-none text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-300 uppercase tracking-wider mb-1">
                          Telefon *
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
                        Teslimat Şehri
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Örn: İstanbul / Kadıköy"
                        className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-white focus:outline-none rounded-none text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider mb-1">
                        Özel Not veya Ölçü Talebi (Opsiyonel)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="Varsa parmak ölçünüz veya teslimat notunuz..."
                        className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-white focus:outline-none rounded-none text-sm text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-sans text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-lg"
                    >
                      {isSubmitting ? (
                        <span>İletiliyor...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Talebi İlet ({artwork.price})</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-neutral-400 text-center mt-2">
                      Bu işlem kartınızdan çekim yapmaz. Atölye sizinle iletişime geçer.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
