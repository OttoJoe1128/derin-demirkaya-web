'use client';

import { useState, useRef, useMemo } from 'react';
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
  Share2,
  Maximize2,
  Mail,
  ChevronRight,
  Send,
  Compass,
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

  // Hibrit Dikey-Yatay Kaydırma Konteyner Referansı
  const horizontalScrollSectionRef = useRef<HTMLDivElement>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
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

  // Eser Görselleri Havuzu (En az 3 adet yüksek çözünürlüklü makro açı)
  const displayImages = useMemo(() => {
    return [
      localizedArtwork.images[0] || '/artworks/744a7950cff34beaff3f06e308a540a0.jpg',
      localizedArtwork.images[1] || localizedArtwork.images[0] || '/artworks/5f01a919e1659e62d8e4f6367d419720.jpg',
      localizedArtwork.images[2] || localizedArtwork.images[0] || '/artworks/d579cd77efd0e2e64a2057ab336012b3.jpg',
    ];
  }, [localizedArtwork.images]);

  // Framer Motion: Dikey Kaydırmayı Yatay Harekete Çevirme (Scroll Mapping)
  const { scrollYProgress } = useScroll({
    target: horizontalScrollSectionRef,
    offset: ['start start', 'end end'],
  });

  // Toplam görsel sayısı üzerinden yatay kaydırma yüzdesi hesabı
  const totalCards = displayImages.length;
  const maxTranslatePercent = (totalCards - 1) * 72; // Her kartın genişliğine orantılı kaydırma

  const rawX = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${maxTranslatePercent}%`]
  );

  // Awwwards düzeyinde akıcı yay fiziği (Spring Physics)
  const smoothX = useSpring(rawX, {
    stiffness: 90,
    damping: 24,
    mass: 0.25,
  });

  // Sol paneldeki ve üstteki scroll ilerleme göstergesi
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const handleShare = async () => {
    soundFx.playClick();
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${localizedArtwork.title} — Derin Demirkaya`,
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
    }, 850);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-neutral-100 selection:bg-amber-400 selection:text-neutral-950">
      
      {/* Sabit İnce İlerleme Çubuğu */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-neutral-900 z-50">
        <motion.div
          style={{ width: progressWidth }}
          className="h-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]"
        />
      </div>

      {/* ========================================================================= */}
      {/* 🏛️ MASAÜSTÜ: HİBRİT EDİTORYAL BÖLÜNME (HYBRID SPLIT-SCROLL SECTION) */}
      {/* ========================================================================= */}
      <section
        ref={horizontalScrollSectionRef}
        className="relative hidden lg:block h-[340vh] w-full"
      >
        {/* Sticky Viewport Container (Ekran yüksekliğine kilitli alan) */}
        <div className="sticky top-0 h-screen w-full flex flex-row overflow-hidden">
          
          {/* ------------------------------------------------------------- */}
          {/* SOL SÜTUN (Sticky Anchor - %38 Genişlik - Asla Hareket Etmez) */}
          {/* ------------------------------------------------------------- */}
          <aside className="w-[38%] xl:w-[36%] h-full flex flex-col p-8 xl:p-10 border-r border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md z-30 overflow-hidden">
            
            {/* Üst Navigasyon & Paylaş (Arşiv Linki) */}
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-8 xl:mb-10">
              <Link
                href="/koleksiyon"
                onClick={() => soundFx.playClick()}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>{language === 'EN' ? 'Back to Archive' : 'Koleksiyon Arşivi'}</span>
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white px-2.5 py-1 border border-neutral-800 hover:border-neutral-600 transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">{language === 'EN' ? 'Copied' : 'Kopyalandı'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3 h-3 text-amber-400" />
                    <span>{language === 'EN' ? 'Share' : 'Paylaş'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Tipografik Eser Başlığı & Fiyat */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-amber-400/40 bg-amber-400/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-300 font-semibold">
                  {localizedArtwork.category} • {localizedArtwork.year}
                </span>
              </div>

              <h1 className="font-serif text-3xl xl:text-4xl font-light tracking-tight text-white uppercase leading-tight">
                {localizedArtwork.title}
              </h1>

              <div className="flex items-baseline justify-between pt-2 border-t border-neutral-800/80">
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                  {localizedArtwork.collectionName}
                </span>
                <span className="font-serif text-2xl xl:text-3xl text-amber-300 font-light">
                  {localizedArtwork.price}
                </span>
              </div>
            </div>

            {/* Eser Açıklaması */}
            <p className="font-sans text-xs xl:text-sm text-neutral-300 leading-relaxed font-light border-l-2 border-amber-400/50 pl-3 my-6 xl:my-8 line-clamp-3">
              {localizedArtwork.description}
            </p>

            {/* 2. Nefes Alan Künye Bloğu (Telemetry Plaque Grid) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[10px] font-mono uppercase tracking-widest border-t border-b border-neutral-800/80 py-4 xl:py-5">
              <div>
                <span className="text-neutral-500 block text-[9px] mb-0.5">{t('artwork.metalClay')}</span>
                <span className="text-neutral-200 font-medium">{localizedArtwork.material}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] mb-0.5">{t('artwork.technique')}</span>
                <span className="text-neutral-200">{localizedArtwork.technique}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] mb-0.5">{t('artwork.weight')}</span>
                <span className="text-amber-300 font-bold">{localizedArtwork.weight}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] mb-0.5">{t('artwork.dimensions')}</span>
                <span className="text-neutral-200">{localizedArtwork.dimensions}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] mb-0.5">{t('artwork.status')}</span>
                <span className="text-emerald-400 font-medium">
                  {localizedArtwork.stock > 0
                    ? `${t('artwork.inStudio')} (${localizedArtwork.stock})`
                    : t('artwork.customOrder')}
                </span>
              </div>
              {localizedArtwork.specs && localizedArtwork.specs.map((item, i) => (
                <div key={i}>
                  <span className="text-neutral-500 block text-[9px] mb-0.5">{item.label}</span>
                  <span className="text-neutral-200">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Alt Aksiyon Bloğu (Doğal akışla künyenin hemen altında: mt-6 xl:mt-8) */}
            <div className="mt-6 xl:mt-8 space-y-3">
              {/* 3. Vurucu Ama İnce Ana Aksiyon (Order Button) */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setIsOrderModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-amber-300 text-black font-mono text-xs uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>{t('artwork.orderBtn')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* 2. İkincil Aksiyonları Zarif Metinlere Çevir (Inquire & Certificate) */}
              <div className="flex items-center justify-between px-1 text-[10px] font-mono tracking-widest uppercase">
                <a
                  href={`mailto:sircaedebiyat@gmail.com?subject=${encodeURIComponent(
                    language === 'EN'
                      ? `Studio Inquiry: ${localizedArtwork.title}`
                      : `Atölye Talebi: ${localizedArtwork.title}`
                  )}`}
                  className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors underline underline-offset-4 decoration-neutral-700 hover:decoration-white"
                >
                  <Mail className="w-3 h-3 text-neutral-400" />
                  <span>{language === 'EN' ? 'Studio Inquiry' : 'Atölye Danışma'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setIsCertModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-amber-300/85 hover:text-amber-200 transition-colors underline underline-offset-4 decoration-amber-400/40 hover:decoration-amber-300 cursor-pointer"
                  title={language === 'EN' ? 'Inspect Official COA' : 'Resmi Belgeyi Gör'}
                >
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>{t('artwork.cert')}</span>
                </button>
              </div>

              {/* Scroll İpucu */}
              <div className="pt-2 flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Compass className="w-2.5 h-2.5 text-amber-400 animate-spin" />
                  {language === 'EN' ? 'Scroll down to slide archive →' : 'Aşağı kaydırarak vitrini akıtın →'}
                </span>
                <span>01 / 0{totalCards}</span>
              </div>
            </div>
          </aside>

          {/* ------------------------------------------------------------- */}
          {/* SAĞ SÜTUN (Horizontal Track - %62 Genişlik - Dikey Kaydırma ile Yatay Akış) */}
          {/* ------------------------------------------------------------- */}
          <main className="w-[62%] xl:w-[64%] h-full relative overflow-hidden bg-neutral-900/40 flex items-center">
            
            {/* Arka Plan Sinematik Grid ve Ambiyans */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_50%,rgba(251,191,36,0.04)_0%,transparent_70%)]" />
            
            {/* Yatay Şerit (Horizontal Motion Strip) */}
            <motion.div
              style={{
                x: smoothX,
                willChange: 'transform',
              }}
              className="flex flex-row items-center h-full gap-8 xl:gap-12 px-10 xl:px-16"
            >
              {displayImages.map((imageSrc, index) => {
                const angleLabels = [
                  language === 'EN' ? 'SPECIMEN ANGLE 01 // PRIMARY FORM' : 'ESER AÇISI 01 // BİRİNCİL FORM',
                  language === 'EN' ? 'SPECIMEN ANGLE 02 // MICRO-TEXTURE' : 'ESER AÇISI 02 // MİKRO DOKU & ERİME',
                  language === 'EN' ? 'SPECIMEN ANGLE 03 // PERSPECTIVE & LIGHT' : 'ESER AÇISI 03 // PERSPEKTİF & IŞIK',
                ];

                return (
                  <div
                    key={index}
                    onClick={() => {
                      soundFx.playClick();
                      setActiveImageIndex(index);
                      setIsZoomOpen(true);
                    }}
                    className="relative w-[50vw] xl:w-[44vw] max-w-[700px] h-[75vh] flex-shrink-0 border border-neutral-800 bg-neutral-950 group cursor-zoom-in overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-all hover:border-amber-400/70"
                  >
                    <Image
                      src={imageSrc}
                      alt={`${localizedArtwork.title} — Açı 0${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Üst Bilgi Rozeti */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-neutral-950/90 border border-neutral-800 font-mono text-[10px] text-amber-400 tracking-widest uppercase">
                        REF. 0{index + 1}
                      </span>
                      <span className="px-2 py-1 bg-neutral-950/80 border border-neutral-800 font-mono text-[10px] text-neutral-300 tracking-wider uppercase hidden xl:inline">
                        {angleLabels[index] || `ANGLE 0${index + 1}`}
                      </span>
                    </div>

                    {/* Sağ Üst Büyütme İkonu */}
                    <div className="absolute top-4 right-4 z-20 p-2 bg-neutral-950/80 border border-neutral-800 text-neutral-300 group-hover:text-amber-300 group-hover:border-amber-400 transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Alt Şerit Bilgisi */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-transparent flex items-center justify-between pointer-events-none">
                      <span className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">
                        {localizedArtwork.title} • 925K STERLING SILVER
                      </span>
                      <span className="font-mono text-[10px] text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {language === 'EN' ? 'Click to Enlarge ↗' : 'Büyütmek İçin Tıklayın ↗'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </main>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📱 MOBİL & TABLET: %100 TAM EKRAN SABİT KASA (100DVH APP-LIKE FORMÜL) */}
      {/* ========================================================================= */}
      <div className="block lg:hidden h-[100dvh] w-full relative overflow-hidden flex flex-col bg-[#0a0a0a] text-neutral-100 pr-16 select-none">
        
        {/* Mobil Sabit Üst Bar (Geri Linki & Paylaş & Eser Ref) */}
        <header className="h-14 px-4 border-b border-neutral-850 bg-neutral-950/90 backdrop-blur-md flex items-center justify-between z-30 shrink-0">
          <Link
            href="/koleksiyon"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'EN' ? 'Archive' : 'Arşiv'}</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
              0{activeImageIndex + 1} / 0{displayImages.length}
            </span>
            <button
              type="button"
              onClick={handleShare}
              className="text-xs font-mono text-amber-300 hover:text-amber-200 uppercase tracking-widest px-2 py-1 bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
            >
              {isCopied ? '✓' : (language === 'EN' ? 'Share' : 'Paylaş')}
            </button>
          </div>
        </header>

        {/* 2. ÜST KISIM: YATAY AKIŞ VE MANYETİK SWIPE (THE TOP GALLERY) */}
        <div className="flex-1 w-full relative overflow-hidden flex flex-col justify-center bg-neutral-950">
          {/* Arka Plan Ambient Radyal Işık */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.06)_0%,transparent_75%)]" />

          {/* Yatay Manyetik Scroll & Snap Container */}
          <div
            onScroll={(e) => {
              const el = e.currentTarget;
              const idx = Math.round(el.scrollLeft / (el.clientWidth || 1));
              if (idx !== activeImageIndex && idx >= 0 && idx < displayImages.length) {
                setActiveImageIndex(idx);
              }
            }}
            className="w-full h-full flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center"
          >
            {displayImages.map((imgSrc, idx) => (
              <div
                key={idx}
                className="w-full h-full shrink-0 snap-center flex items-center justify-center p-3.5 relative"
              >
                <div
                  onClick={() => {
                    soundFx.playClick();
                    setActiveImageIndex(idx);
                    setIsZoomOpen(true);
                  }}
                  className="relative w-full h-[96%] max-h-[52dvh] bg-neutral-900/90 border border-neutral-800/90 overflow-hidden shadow-2xl group cursor-zoom-in"
                >
                  <Image
                    src={imgSrc}
                    alt={`${localizedArtwork.title} 0${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw"
                    className="object-contain p-2"
                  />

                  {/* Sol Üst Ref Rozeti */}
                  <div className="absolute top-2.5 left-2.5 bg-neutral-950/90 font-mono text-[9px] px-2 py-0.5 text-amber-400 border border-neutral-800 tracking-wider">
                    SPECIMEN 0{idx + 1}
                  </div>

                  {/* Sağ Üst Büyütme Butonu */}
                  <div className="absolute top-2.5 right-2.5 p-1.5 bg-neutral-950/80 border border-neutral-800 text-neutral-400">
                    <Maximize2 className="w-3 h-3 text-neutral-300" />
                  </div>

                  {/* Görsel Alt Bilgi Şeridi */}
                  <div className="absolute bottom-0 left-0 right-0 py-1.5 px-2.5 bg-neutral-950/90 border-t border-neutral-900 flex items-center justify-between text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                    <span>{localizedArtwork.material}</span>
                    <span className="text-amber-400/80">{localizedArtwork.weight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Galeri Manyetik Noktaları (Pagination Indicators) */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1.5 pointer-events-none z-10">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className={`h-1 transition-all rounded-full ${
                  i === activeImageIndex
                    ? 'w-6 bg-amber-400'
                    : 'w-1.5 bg-neutral-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. SABİT ALT KÜNYE VE AKSİYON BARI (FIXED BOTTOM ANCHOR) */}
        <footer className="mt-auto shrink-0 bg-neutral-950/98 border-t border-neutral-850/90 p-3.5 sm:p-4 z-20 shadow-[0_-12px_28px_rgba(0,0,0,0.85)] flex flex-col gap-2.5">
          {/* Eser Başlığı ve Fiyat */}
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest truncate">
                  {localizedArtwork.category} • {localizedArtwork.year}
                </span>
                {localizedArtwork.isUniquePiece && (
                  <span className="px-1.5 py-0.2 bg-amber-400/10 border border-amber-400/30 text-[8px] font-mono text-amber-300 uppercase">
                    1/1 PIECE
                  </span>
                )}
              </div>
              <h1 className="font-serif text-lg sm:text-xl text-white font-light uppercase tracking-tight truncate leading-snug">
                {localizedArtwork.title}
              </h1>
            </div>

            <div className="text-right shrink-0">
              <span className="block font-serif text-lg sm:text-xl text-amber-300 font-normal leading-none">
                {localizedArtwork.price}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 mt-0.5 block">
                {language === 'EN' ? 'Tax & Custom Crate Inc.' : 'Özel Sandık & KDV Dahil'}
              </span>
            </div>
          </div>

          {/* Kompakt Künye Özeti */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-neutral-900/70 border border-neutral-850 px-2.5 py-1.5">
            <div className="truncate text-neutral-400">
              <span className="text-neutral-500 uppercase">{language === 'EN' ? 'Mat: ' : 'Malz: '}</span>
              <span className="text-neutral-200">{localizedArtwork.material}</span>
            </div>
            <div className="truncate text-right text-neutral-400">
              <span className="text-neutral-500 uppercase">{language === 'EN' ? 'Tech: ' : 'Teknik: '}</span>
              <span className="text-neutral-200">{localizedArtwork.technique}</span>
            </div>
          </div>

          {/* İkili Aksiyon Butonları (Satın Al / Danış & Sertifika) */}
          <div className="grid grid-cols-5 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsOrderModalOpen(true);
              }}
              className="col-span-4 py-3 bg-white text-neutral-950 font-mono text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-amber-300 transition-colors cursor-pointer text-center"
            >
              {t('artwork.orderBtn')}
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsCertModalOpen(true);
              }}
              title={t('artwork.cert')}
              className="col-span-1 py-3 border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 font-mono text-xs uppercase tracking-widest flex items-center justify-center transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* 📜 BÖLÜM 2: EDİTORYAL FELSEFE & ATÖLYE ÇAĞRISI (GENEL DEVAM BLOĞU) */}
      {/* ========================================================================= */}
      <section className="relative z-30 max-w-6xl mx-auto px-6 py-20 lg:py-28 border-t border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-6 space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400 block">
              {t('artwork.philosophySub')}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-white">
              {t('artwork.philosophyTitle')}
            </h2>
            <blockquote className="border-l-2 border-amber-400/60 pl-4 italic font-serif text-base lg:text-lg text-neutral-300">
              &ldquo;{localizedArtwork.editorialNote}&rdquo;
            </blockquote>
          </div>

          <div className="md:col-span-6 bg-neutral-950 border border-neutral-800 p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-amber-400 font-bold tracking-widest uppercase">
                SP-01 // CIRE-PERDUE ATELIER LOG
              </span>
              <span className="text-neutral-500">SPECIMEN LOG</span>
            </div>
            <p className="font-sans text-sm text-neutral-300 leading-relaxed font-light">
              {language === 'EN'
                ? `Edition: ${localizedArtwork.isUniquePiece ? '1/1 Unique Specimen' : 'Limited Studio Series'} • Weight: ${localizedArtwork.weight} • Year: ${localizedArtwork.year}. Sculpted with lost-wax technique and raw 925 sterling silver.`
                : `Edisyon: ${localizedArtwork.isUniquePiece ? '1/1 Eşsiz Parça (Tek Nüsha)' : 'Limitli Koleksiyon Serisi'} • Ağırlık: ${localizedArtwork.weight} • Yıl: ${localizedArtwork.year}. Kayıp mum döküm tekniği ve 925 som gümüş ile biçimlendirilmiştir.`}
            </p>
            <div className="pt-3 border-t border-neutral-800 flex justify-between text-neutral-400">
              <span>{t('artwork.dimensions')}: {localizedArtwork.dimensions}</span>
              <span>{t('artwork.weight')}: {localizedArtwork.weight}</span>
            </div>
            <div className="flex items-center gap-2 pt-2 text-neutral-400">
              <Truck className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{t('artwork.crate')}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center pt-10 border-t border-neutral-800/80">
          <Link
            href="/atolye"
            className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            <span>{t('artwork.exploreWorkshops')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🔍 TAM EKRAN GÖRSEL BÜYÜTME MODALI (LIGHTBOX) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-[99999] bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative w-full max-w-5xl aspect-square max-h-[85vh]">
              <Image
                src={displayImages[activeImageIndex] || displayImages[0]}
                alt={localizedArtwork.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-widest px-4 py-2 border border-neutral-700 bg-neutral-900/80 cursor-pointer"
            >
              {t('artwork.close')} ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 💳 SATIN ALMA / REZERVASYON MODALI */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              className="bg-neutral-950 text-neutral-100 w-full max-w-lg border border-neutral-800 p-8 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => {
                  setIsOrderModalOpen(false);
                  setIsSuccess(false);
                }}
                className="absolute top-6 right-6 text-neutral-400 hover:text-white text-xs font-mono uppercase tracking-widest cursor-pointer"
              >
                ✕ {t('artwork.close')}
              </button>

              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-400/30">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-white">
                    {language === 'EN' ? 'Reservation Request Received' : 'Talep Atölyeye İletildi'}
                  </h3>
                  <p className="font-sans text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                    {language === 'EN' ? (
                      <>
                        Your request for <strong>{localizedArtwork.title}</strong> has been logged.
                        Details will be transmitted to <strong>{formData.email}</strong> within 24 hours.
                      </>
                    ) : (
                      <>
                        <strong>{localizedArtwork.title}</strong> eseri için talebiniz alındı.
                        Özel edisyon ve teslimat detayları <strong>{formData.email}</strong> adresine iletilecektir.
                      </>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setIsSuccess(false);
                    }}
                    className="mt-4 px-6 py-2.5 bg-white text-black text-xs font-mono uppercase tracking-widest cursor-pointer"
                  >
                    {t('artwork.close')}
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                    {t('artwork.modalTitle')}
                  </span>
                  <h2 className="font-serif text-2xl text-white mb-1">
                    {localizedArtwork.title}
                  </h2>
                  <p className="font-mono text-xs text-neutral-300 mb-6">
                    {language === 'EN' ? 'Price:' : 'Tutar:'}{' '}
                    <span className="text-amber-300 font-bold">{localizedArtwork.price}</span>
                  </p>

                  <form onSubmit={handleOrderSubmit} className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-neutral-400 uppercase tracking-wider mb-1 text-[10px]">
                        {language === 'EN' ? 'Full Name *' : 'Ad Soyad *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 uppercase tracking-wider mb-1 text-[10px]">
                          {language === 'EN' ? 'Email *' : 'E-posta *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 uppercase tracking-wider mb-1 text-[10px]">
                          {language === 'EN' ? 'Phone *' : 'Telefon *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 uppercase tracking-wider mb-1 text-[10px]">
                        {language === 'EN' ? 'Note / Ring Size' : 'Ölçü veya Not (Opsiyonel)'}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white font-sans text-xs focus:border-amber-400 focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? '...' : (language === 'EN' ? 'Send Studio Request' : 'Atölye Talebini İlet')}</span>
                    </button>
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
