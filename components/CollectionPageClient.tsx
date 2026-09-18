'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { ARTWORKS_DATA, type ArtworkDetail } from '@/lib/artworks-data';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';
import IndexListItem from '@/components/IndexListItem';
import type { Dictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';

interface CollectionPageClientProps {
  lang?: Locale;
  dict?: Dictionary;
}

/**
 * Lüks Tipografik İndeks (Koleksiyon Sayfası)
 * - Üst filtre barı tamamen kaldırılmış, saf ve heykelsi editoryal başlık.
 * - Sol sütun: Sabit yükseklikli, görünmez çerçeveli (overflow-y-auto, scrollbar-hide) eser listesi.
 *   Yüzlerce eser olsa dahi sayfa taşmaz, sadece bu liste kayar.
 * - Sağ sütun: Viewport'a tam sığdırılmış pürüzsüz Framer Motion önizleme kartı.
 * - Responsive: Mobil, tablet ve masaüstünde dünya standartlarında kusursuz hiyerarşi.
 */
export default function CollectionPageClient({ lang: initialLang }: CollectionPageClientProps) {
  const { language } = useLanguage();
  const currentLang = initialLang || (language === 'EN' ? 'en' : 'tr');
  const isEn = currentLang === 'en';
  const langPrefix = isEn ? '/en' : '/tr';

  const [artworksList, setArtworksList] = useState<ArtworkDetail[]>(ARTWORKS_DATA);
  const [activeArtwork, setActiveArtwork] = useState<ArtworkDetail>(() => ARTWORKS_DATA[0] || null);

  // Veritabanı veya API'deki güncel eserleri dinamik çek (veri kaybı sıfır)
  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        if (data.artworks && Array.isArray(data.artworks) && data.artworks.length > 0) {
          setArtworksList(data.artworks);
          setActiveArtwork((prev) => prev || data.artworks[0]);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic artworks in collection index:', err));
  }, []);

  const handleItemHover = (artwork: ArtworkDetail) => {
    if (activeArtwork?.id !== artwork.id) {
      setActiveArtwork(artwork);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] lg:h-[calc(100dvh-5.5rem)] bg-[#050608] text-neutral-100 px-4 sm:px-8 lg:px-12 py-3 sm:py-5 flex flex-col justify-between overflow-hidden select-none">
      
      {/* 1. ÜST EDİTORYAL BAŞLIK (FİLTRE BARI KALDIRILMIŞ, SAF VE HEYKELSİ) */}
      <header className="w-full border-b border-neutral-800/80 pb-3 sm:pb-4 shrink-0">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="font-mono text-[9px] sm:text-[10px] text-amber-400/90 tracking-[0.25em] uppercase">
              {isEn ? 'INDEX // PERMANENT COLLECTION' : 'İNDEKS // KALICI KOLEKSİYON'}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase leading-none font-normal">
            {isEn ? 'Artwork Index' : 'Eser İndeksi'}
          </h1>

          <p className="font-mono text-[11px] sm:text-xs text-neutral-400 max-w-xl line-clamp-2 sm:line-clamp-none">
            {isEn
              ? 'A curated typographic index of bespoke metal sculptures, molten silver objects, and unique wearable artifacts.'
              : 'Ateşle biçimlenmiş heykelsi gümüş takılar, özgün nesneler ve stüdyo kayıtlarının tipografik arşivi.'}
          </p>
        </div>
      </header>

      {/* 2. ANA GÖVDE: SOLDA GÖRÜNMEZ SCROLLBAR'LI LİSTE, SAĞDA VIEWPORT'A SIĞAN DİNAMİK GÖRSEL */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-3 sm:py-4 min-h-0 overflow-hidden items-start">
        
        {/* SOL: TİPOGRAFİK İNDEKS LİSTESİ (7 Kolon) */}
        {/* Scroll Optimizasyonu: Sabit yükseklik, invisible scroll (overflow-y-auto) */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-0 overflow-hidden">
          {/* Tablo Başlığı */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-[10px] font-mono text-neutral-500 uppercase tracking-widest shrink-0">
            <span>NO / {isEn ? 'ARTWORK TITLE' : 'ESER BAŞLIĞI'}</span>
            <span>{isEn ? 'CATEGORY // EDITION' : 'KATEGORİ // EDİSYON'}</span>
          </div>

          {/* Görünmez Çerçeve (Scrollable List Container) */}
          <div
            id="collection-artwork-list"
            tabIndex={0}
            aria-label="Koleksiyon Eser Listesi"
            className="flex-1 overflow-y-auto pr-2 divide-y divide-neutral-900/40 focus:outline-none scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-h-[46vh] sm:max-h-[52vh] lg:max-h-none"
          >
            {artworksList.map((artwork, idx) => (
              <IndexListItem
                key={artwork.id}
                artwork={artwork}
                index={idx}
                isActive={activeArtwork?.id === artwork.id}
                onHover={handleItemHover}
                lang={currentLang}
              />
            ))}

            {artworksList.length === 0 && (
              <div className="py-12 text-center text-neutral-500 font-mono text-xs">
                {isEn ? 'No artworks found.' : 'Kayıtlı eser bulunamadı.'}
              </div>
            )}
          </div>
        </div>

        {/* SAĞ: VIEWPORT'A TAM SIĞDIRILMIŞ DİNAMİK ÖNİZLEME KARTI (5 Kolon) */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full min-h-0">
          <div className="relative w-full border border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md p-3 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-w-lg mx-auto lg:max-w-none">
            
            {/* Dinamik Görsel Çerçevesi (Ekranı aşmayacak max-h-[38vh] veya aspect-[4/3]) */}
            <div className="relative aspect-[4/3] max-h-[38vh] w-full overflow-hidden bg-neutral-900 border border-neutral-800">
              <AnimatePresence mode="wait">
                {activeArtwork && (
                  <motion.div
                    key={activeArtwork.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeArtwork.images[0] || '/artworks/4107f9b51db8c3dbac92156e1eebba6e.jpg'}
                      alt={activeArtwork.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      priority
                      referrerPolicy="no-referrer"
                    />

                    {/* Lüks Köşe Rozeti */}
                    <div className="absolute top-2.5 left-2.5 bg-neutral-950/90 border border-neutral-800 px-2 py-0.5 text-[9px] font-mono text-amber-300 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>{activeArtwork.isUniquePiece ? '1/1 Unique' : 'Bespoke'}</span>
                    </div>

                    {/* Detayları Gör İpucu */}
                    <Link
                      href={`${langPrefix}/koleksiyon/${activeArtwork.id}`}
                      onClick={() => soundFx.playClick()}
                      className="absolute bottom-2.5 right-2.5 bg-neutral-950/90 hover:bg-neutral-900 border border-neutral-700 px-2.5 py-1 text-[9px] font-mono text-neutral-200 uppercase tracking-widest flex items-center gap-1 shadow-lg transition-all"
                    >
                      <span>{isEn ? 'View Details' : 'Detayları Gör'}</span>
                      <ArrowUpRight className="w-3 h-3 text-amber-400" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dinamik Eser Bilgi Kartı */}
            {activeArtwork && (
              <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-[9px] text-amber-400/90 uppercase tracking-widest block truncate">
                      {activeArtwork.collectionName}
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl text-white uppercase font-light truncate">
                      {activeArtwork.title}
                    </h2>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-semibold text-neutral-200 block">
                      {activeArtwork.price}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {activeArtwork.year}
                    </span>
                  </div>
                </div>

                <p className="font-sans text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {isEn
                    ? (activeArtwork.descriptionEn || activeArtwork.description)
                    : activeArtwork.description}
                </p>

                <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-500 border-t border-neutral-900">
                  <span className="truncate max-w-[200px]">
                    {isEn ? (activeArtwork.materialEn || activeArtwork.material) : activeArtwork.material}
                  </span>
                  <Link
                    href={`${langPrefix}/koleksiyon/${activeArtwork.id}`}
                    onClick={() => soundFx.playClick()}
                    className="text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider flex items-center gap-1 shrink-0"
                  >
                    <span>{isEn ? 'Explore Page' : 'İncele'}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. ALT BİLGİ & MASTER SAYAÇ */}
      <footer className="w-full border-t border-neutral-800/80 pt-2.5 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-500 gap-1.5 shrink-0">
        <div className="flex items-center gap-3">
          <span>NONVALUE MASTER REGISTER</span>
          <span>•</span>
          <span>{artworksList.length} {isEn ? 'WORKS RECORDED' : 'ESER KAYITLI'}</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-400">
          <span>DERİN BUSE DEMİRKAYA</span>
          <span>•</span>
          <span>KARAKÖY ATÖLYE // 2026</span>
        </div>
      </footer>
    </div>
  );
}
