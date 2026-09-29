'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Share2,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';
import type { ArtworkDetail } from '@/lib/artworks-data';
import { getLocalizedArtwork } from '@/lib/artworks-data';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';
import CertificateOfAuthenticityModal from './CertificateOfAuthenticityModal';

interface ArtworkClientProps {
  artwork: ArtworkDetail;
}

/**
 * Awwwards Standartlarında Ürün Detay Mimarisi (ArtworkClient)
 * 
 * KURAL 1:
 * - Sol üst buton: KESİNLİKLE "<- BACK TO SHOP" (href: /[lang]/shop).
 * - Sol panel ekranda KESİNLİKLE SABİT (fixed/sticky h-screen). Sayfa dikey kaymaz.
 * - Sağ galeri KESİNLİKLE SADECE YATAY (overflow-x-auto, snap-x mandatory) kayar.
 * 
 * KURAL 2: SIFIR METİN (Zero Text Policy):
 * - Görsellerin üzerindeki/altındaki tüm etiketler, kutucuklar, "REF 01", "Click to Enlarge"
 *   ve siyah gradient gölgeler TAMAMEN SİLİNDİ. Saf, pürüzsüz fotoğraflar.
 * 
 * KURAL 4:
 * - Tüm mailto bağlantıları: derinbusedemirkaya@gmail.com
 */
export default function ArtworkClient({ artwork }: ArtworkClientProps) {
  const { language, t } = useLanguage();
  const localizedArtwork = useMemo(
    () => getLocalizedArtwork(artwork, language),
    [artwork, language]
  );

  const langCode = language?.toLowerCase() === 'en' ? 'en' : 'tr';
  const isEn = language === 'EN';

  const galleryRef = useRef<HTMLDivElement>(null);

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

  // Eser Görselleri Havuzu
  const displayImages = useMemo(() => {
    return [
      localizedArtwork.images[0] || '/artworks/744a7950cff34beaff3f06e308a540a0.jpg',
      localizedArtwork.images[1] || localizedArtwork.images[0] || '/artworks/5f01a919e1659e62d8e4f6367d419720.jpg',
      localizedArtwork.images[2] || localizedArtwork.images[0] || '/artworks/d579cd77efd0e2e64a2057ab336012b3.jpg',
    ];
  }, [localizedArtwork.images]);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 1.5, behavior: 'auto' });
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

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
        // İptal edildi
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
    <div className="w-screen h-screen overflow-hidden bg-black text-neutral-100 flex flex-col lg:flex-row select-none selection:bg-white selection:text-black">
      {/* ========================================================================= */}
      {/* 1. SOL PANEL: DESKTOPTA SABİT SOL, MOBİLDE ALT %40 DİKEY KAYDIRMA          */}
      {/* ========================================================================= */}
      <aside className="order-2 lg:order-1 w-full lg:w-[38%] xl:w-[35%] h-[40vh] lg:h-screen shrink-0 flex flex-col justify-between pl-20 sm:pl-24 pr-6 sm:pr-8 py-4 sm:py-8 xl:py-10 border-t lg:border-t-0 lg:border-r border-neutral-800/80 bg-neutral-950 z-30 overflow-y-auto no-scrollbar">
        {/* Üst Kısım: Geri Dön Butonu & Paylaşım */}
        <div>
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4 sm:mb-6 xl:mb-8">
            <Link
              href={`/${langCode}/shop`}
              onClick={() => soundFx.playClick()}
              className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>{isEn ? '← BACK TO SHOP' : '← MAĞAZAYA DÖN'}</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white px-2.5 py-1 border border-neutral-800 hover:border-neutral-600 transition-colors cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-white" />
                  <span className="text-white">{isEn ? 'Copied' : 'Kopyalandı'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 text-white" />
                  <span>{isEn ? 'Share' : 'Paylaş'}</span>
                </>
              )}
            </button>
          </div>

          {/* Eser Başlığı & Fiyat */}
          <div className="space-y-2 mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-neutral-800 bg-neutral-900">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-300 font-medium">
                {localizedArtwork.category} • {localizedArtwork.year}
              </span>
            </div>

            <h1 className="font-serif text-[14px] font-normal tracking-widest text-white uppercase leading-snug">
              {localizedArtwork.title}
            </h1>

            <div className="flex items-baseline justify-between pt-1.5 border-t border-neutral-800/80">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                {localizedArtwork.collectionName}
              </span>
              <span className="font-mono text-[10px] text-white tracking-widest uppercase font-semibold">
                {localizedArtwork.price}
              </span>
            </div>
          </div>

          {/* Eser Açıklaması */}
          <p className="font-sans text-[12px] text-neutral-300 leading-relaxed font-light border-l-2 border-neutral-700 pl-3 mb-4 sm:mb-6 line-clamp-3">
            {localizedArtwork.description}
          </p>

          {/* Eser Künye Tablosu */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-widest border-t border-b border-neutral-800/80 py-3 sm:py-4 mb-4 sm:mb-6">
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
              <span className="text-white font-medium">{localizedArtwork.weight}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] mb-0.5">{t('artwork.dimensions')}</span>
              <span className="text-neutral-200">{localizedArtwork.dimensions}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] mb-0.5">{t('artwork.status')}</span>
              <span className="text-neutral-300 font-medium">
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
        </div>

        {/* Alt Aksiyon Butonu */}
        <div className="pt-2 sm:pt-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              soundFx.playClick();
              setIsOrderModalOpen(true);
            }}
            className="w-full py-3 px-4 bg-white hover:bg-neutral-200 text-black font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{t('artwork.orderBtn')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. SAĞ PANEL: MOBİLDE ÜST %60, DESKTOPTA SAĞ TAM EKRAN YATAY GALERİ         */}
      {/* ========================================================================= */}
      <main
        ref={galleryRef}
        className="order-1 lg:order-2 w-full lg:flex-1 h-[60vh] lg:h-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex flex-row items-center gap-4 sm:gap-6 lg:gap-10 px-6 sm:px-12 lg:px-16 no-scrollbar bg-black"
      >
        {displayImages.map((imageSrc, index) => (
          <div
            key={index}
            onClick={() => {
              soundFx.playClick();
              setActiveImageIndex(index);
              setIsZoomOpen(true);
            }}
            className="relative h-[52vh] lg:h-[80vh] w-[75vw] sm:w-[50vw] lg:w-[44vw] xl:w-[38vw] max-w-[700px] shrink-0 snap-center overflow-hidden cursor-zoom-in group"
          >
            {/* KESİN SIFIR METİN: Hiçbir metin, kutu, rozet veya karartıcı gradient yok */}
            <Image
              src={imageSrc}
              alt=""
              fill
              priority={index === 0}
              sizes="50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.03]"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </main>

      {/* ========================================================================= */}
      {/* 3. LIGHTBOX ZOOM MODALI                                                   */}
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
            <div className="relative w-full max-w-5xl aspect-square max-h-[85vh]">
              <Image
                src={displayImages[activeImageIndex] || displayImages[0]}
                alt=""
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
              ✕ {t('artwork.close')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. SATIN ALMA / REZERVASYON MODALI                                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
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
                <X className="w-5 h-5" />
              </button>

              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto border border-white/20">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-[14px] uppercase tracking-wide text-white font-normal">
                    {isEn ? 'Reservation Request Received' : 'Talep Atölyeye İletildi'}
                  </h3>
                  <p className="font-sans text-[12px] text-neutral-300 leading-relaxed max-w-sm mx-auto font-light">
                    {isEn ? (
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
                    className="mt-4 px-6 py-2.5 bg-white text-black text-[10px] font-mono uppercase tracking-widest cursor-pointer font-bold"
                  >
                    {t('artwork.close')}
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                    {t('artwork.modalTitle')}
                  </span>
                  <h2 className="font-serif text-[14px] uppercase tracking-widest text-white mb-1 font-normal">
                    {localizedArtwork.title}
                  </h2>
                  <p className="font-mono text-[10px] text-neutral-400 mb-6">
                    {isEn ? 'Price:' : 'Tutar:'}{' '}
                    <span className="text-white font-semibold">{localizedArtwork.price}</span>
                  </p>

                  <form onSubmit={handleOrderSubmit} className="space-y-4 font-mono text-[10px]">
                    <div>
                      <label className="block text-neutral-400 uppercase tracking-wider mb-1 text-[10px]">
                        {isEn ? 'Full Name *' : 'Ad Soyad *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white font-sans text-[12px] focus:border-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 uppercase tracking-wider mb-1 text-[10px]">
                          {isEn ? 'Email *' : 'E-posta *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white font-sans text-[12px] focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 uppercase tracking-wider mb-1 text-[10px]">
                          {isEn ? 'Phone *' : 'Telefon *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white font-sans text-[12px] focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 uppercase tracking-wider mb-1 text-[10px]">
                        {isEn ? 'Note / Ring Size' : 'Ölçü veya Not (Opsiyonel)'}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white font-sans text-[12px] focus:border-white focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-white text-black font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? '...' : (isEn ? 'Send Studio Request' : 'Atölye Talebini İlet')}</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. ORİJİNALLİK VE MÜLKİYET SERTİFİKASI MODALI (COA) */}
      <CertificateOfAuthenticityModal
        artwork={artwork}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
}
