'use client';

import { useState, useRef } from 'react';
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

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    note: '',
  });

  // Global Page Scroll & Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Hero Scroller Parallax
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Smooth springs for high-end organic kinetic feel
  const smoothHeroProgress = useSpring(heroScrollProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  // 3D Spatial Parallax transforms for Hero Section
  // Background slow drift
  const bgY = useTransform(smoothHeroProgress, [0, 1], ['0%', '28%']);
  const bgScale = useTransform(smoothHeroProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(smoothHeroProgress, [0, 0.85], [1, 0.25]);

  // Massive Typography moves TOWARDS the camera (Z-axis scale up & forward drift)
  const typographyScale = useTransform(smoothHeroProgress, [0, 0.9], [1, 1.85]);
  const typographyY = useTransform(smoothHeroProgress, [0, 1], ['0%', '-35%']);
  const typographyOpacity = useTransform(smoothHeroProgress, [0, 0.7, 1], [0.95, 0.4, 0]);
  const typographyZ = useTransform(smoothHeroProgress, [0, 1], [0, 150]);

  // Central Hero Artwork floating sculpture layer
  const artworkScale = useTransform(smoothHeroProgress, [0, 1], [1, 0.88]);
  const artworkY = useTransform(smoothHeroProgress, [0, 1], ['0%', '16%']);
  const artworkRotate = useTransform(smoothHeroProgress, [0, 1], [0, -4]);

  // Floating ambient badge
  const badgeY = useTransform(smoothHeroProgress, [0, 1], ['0%', '-80%']);

  // Narrative Progress Bar
  const progressBar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

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
      className="relative min-h-screen bg-[#0d0d0d] text-neutral-100 selection:bg-white selection:text-black overflow-x-clip"
    >
      {/* İnce Akış Göstergesi (Spatial Progress Spine) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/10 z-50">
        <motion.div
          style={{ width: progressBar }}
          className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
      </div>

      {/* Üst Zarif Navigasyon */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 transition-all">
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
      {/* 🌌 BÖLÜM 1: UZAMSAL PARALLAX HERO (SPATIAL CINEMATIC STAGE) */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        className="relative h-[130vh] sm:h-[145vh] w-full flex items-center justify-center overflow-hidden [perspective:1200px]"
      >
        {/* Katman A: Derin Arka Plan (Deep Spatial Atmosphere) */}
        <motion.div
          style={{ y: bgY, scale: bgScale, opacity: bgOpacity }}
          className="absolute inset-0 z-0 will-change-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0d0d0d] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] z-10" />
          
          <Image
            src={artwork.images[activeImageIndex] || artwork.images[0]}
            alt={`${artwork.title} Atmosferik Doku`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25 filter blur-[32px] scale-125"
          />
        </motion.div>

        {/* Katman B: Devasa Tipografi (Kameraya Doğru Yaklaşan Dev Başlık) */}
        <motion.div
          style={{
            scale: typographyScale,
            y: typographyY,
            opacity: typographyOpacity,
            translateZ: typographyZ,
          }}
          className="absolute inset-x-0 top-[26%] sm:top-[22%] z-10 pointer-events-none text-center px-4 will-change-transform select-none"
        >
          <span className="block font-sans text-xs sm:text-sm uppercase tracking-[0.4em] text-neutral-400 mb-3">
            {artwork.category} • {artwork.year}
          </span>
          <h1 className="font-serif text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-light tracking-tighter text-white/90 uppercase leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            {artwork.title}
          </h1>
        </motion.div>

        {/* Katman C: Merkezde Havada Duran Heykelsi Eser Görseli */}
        <motion.div
          style={{
            scale: artworkScale,
            y: artworkY,
            rotateZ: artworkRotate,
          }}
          className="relative z-20 w-[84vw] sm:w-[55vw] md:w-[42vw] max-w-[540px] aspect-[4/5] will-change-transform shadow-[0_30px_100px_rgba(0,0,0,0.95)] border border-white/10 group cursor-pointer"
          onClick={() => setIsZoomOpen(true)}
        >
          <Image
            src={artwork.images[activeImageIndex] || artwork.images[0]}
            alt={artwork.title}
            fill
            priority
            sizes="(max-width: 768px) 85vw, 45vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* Eser Detay Etiketi */}
          <div className="absolute top-4 left-4 z-30">
            {artwork.isUniquePiece ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-widest text-amber-200">
                <Sparkles className="w-3 h-3 text-amber-300" />
                1/1 Eşsiz Eser (Unique)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-widest text-neutral-300">
                Limitli Atölye Üretimi
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomOpen(true);
            }}
            aria-label="Tam Ekran İncele"
            className="absolute bottom-4 right-4 p-3 bg-black/70 hover:bg-white hover:text-black text-white backdrop-blur-md rounded-full border border-white/20 transition-all opacity-0 group-hover:opacity-100"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Katman D: Uzamsal Fiyat & Satın Alma Rozeti (Bağımsız Hızla Süzülen) */}
        <motion.div
          style={{ y: badgeY }}
          className="absolute bottom-[14%] sm:bottom-[16%] z-30 flex flex-col items-center gap-3 will-change-transform"
        >
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/15 px-6 py-3 rounded-full shadow-2xl">
            <span className="font-serif text-2xl sm:text-3xl text-white font-light">
              {artwork.price}
            </span>
            <div className="h-4 w-[1px] bg-white/20" />
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-white text-black hover:bg-neutral-200 px-5 py-2 rounded-full font-sans text-xs uppercase tracking-widest font-medium transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Satın Al / Rezerve Et</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-xs font-sans tracking-widest uppercase mt-2 animate-pulse">
            <span>Aşağı Kaydırın ve Keşfedin</span>
            <ArrowDown className="w-3.5 h-3.5" />
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
            Işığın ve el çekicinin yüzeyde bıraktığı rastlantısal mikro çatlaklar, her açıda bambaşka bir gölge oyunu meydana getirir.
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
      <section className="relative z-30 bg-[#121212] py-28 border-y border-white/10">
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
          <div className="lg:col-span-6 bg-black/60 border border-white/15 p-8 sm:p-10 shadow-2xl relative">
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
                src={artwork.images[activeImageIndex] || artwork.images[0]}
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
