'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { ARTWORKS_DATA, type ArtworkDetail } from '@/lib/artworks-data';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';
import IndexListItem from '@/components/IndexListItem';

export default function ArchiveCanvas() {
  const { language } = useLanguage();
  const lang = language === 'EN' ? 'en' : 'tr';
  const langPrefix = lang === 'en' ? '/en' : '/tr';

  const [artworksList, setArtworksList] = useState<ArtworkDetail[]>(ARTWORKS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Hover edilen eser durumu (İlk eser varsayılan aktif gelir)
  const [activeArtwork, setActiveArtwork] = useState<ArtworkDetail>(() => ARTWORKS_DATA[0] || null);

  // Veritabanı veya API'deki güncel eserleri dinamik çek (veri kaybı sıfır)
  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        if (data.artworks && Array.isArray(data.artworks) && data.artworks.length > 0) {
          setArtworksList(data.artworks);
          setActiveArtwork(data.artworks[0]);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic artworks in archive index:', err));
  }, []);

  // Benzersiz kategoriler
  const categories = useMemo(() => {
    const cats = new Set<string>();
    artworksList.forEach((item) => {
      const cat = lang === 'en' ? (item.categoryEn || item.category) : item.category;
      if (cat) cats.add(cat);
    });
    return Array.from(cats);
  }, [artworksList, lang]);

  // Filtrelenmiş eserler
  const filteredArtworks = useMemo(() => {
    if (selectedCategory === 'ALL') return artworksList;
    return artworksList.filter((item) => {
      const cat = lang === 'en' ? (item.categoryEn || item.category) : item.category;
      return cat === selectedCategory;
    });
  }, [artworksList, selectedCategory, lang]);

  // Filtre değiştiğinde ilk eseri önizlemeye ata
  const handleCategoryChange = (cat: string) => {
    soundFx.playClick();
    setSelectedCategory(cat);
    const nextList = cat === 'ALL'
      ? artworksList
      : artworksList.filter((item) => {
          const c = lang === 'en' ? (item.categoryEn || item.category) : item.category;
          return c === cat;
        });
    if (nextList.length > 0) {
      setActiveArtwork(nextList[0]);
    }
  };

  const handleItemHover = (artwork: ArtworkDetail) => {
    if (activeArtwork?.id !== artwork.id) {
      setActiveArtwork(artwork);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050608] text-neutral-100 px-4 sm:px-8 lg:px-14 py-8 sm:py-12 flex flex-col justify-between select-none">
      {/* 1. ÜST EDİTORYAL BAŞLIK & FİLTRELER */}
      <header className="w-full border-b border-neutral-800/80 pb-6 sm:pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="font-mono text-[10px] text-amber-400/90 tracking-[0.25em] uppercase">
                {lang === 'en' ? 'INDEX // PERMANENT ARCHIVE' : 'İNDEKS // KALICI ARŞİV'}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase">
              {lang === 'en' ? 'Artwork Index' : 'Eser İndeksi'}
            </h1>
            <p className="font-mono text-xs text-neutral-400 max-w-lg">
              {lang === 'en'
                ? 'A curated typographic index of bespoke metal sculptures, molten silver objects, and unique wearable artifacts.'
                : 'Ateşle biçimlenmiş heykelsi gümüş takılar, özgün nesneler ve stüdyo kayıtlarının tipografik arşivi.'}
            </p>
          </div>

          {/* Kategori Filtre Butonları */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-xs mr-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase tracking-wider">{lang === 'en' ? 'Filter:' : 'Filtrele:'}</span>
            </div>

            <button
              type="button"
              onClick={() => handleCategoryChange('ALL')}
              className={`px-3 py-1 rounded-xs font-mono text-xs tracking-wider uppercase transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'All (Total ' : 'Tümü ('}{artworksList.length})
            </button>

            {categories.map((cat) => {
              const count = artworksList.filter((item) => {
                const c = lang === 'en' ? (item.categoryEn || item.category) : item.category;
                return c === cat;
              }).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1 rounded-xs font-mono text-xs tracking-wider uppercase transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. ANA GÖVDE: SOLDA TİPOGRAFİK LİSTE, SAĞDA DİNAMİK HOVER GÖRSELİ */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 py-8 items-start">
        
        {/* SOL: TİPOGRAFİK İNDEKS LİSTESİ (7 Kolon) */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            <span>NO / ESER BAŞLIĞI</span>
            <span>KATEGORİ // EDİSYON</span>
          </div>

          <div className="divide-y divide-neutral-900/40">
            {filteredArtworks.map((artwork, idx) => (
              <IndexListItem
                key={artwork.id}
                artwork={artwork}
                index={idx}
                isActive={activeArtwork?.id === artwork.id}
                onHover={handleItemHover}
                lang={lang}
              />
            ))}
          </div>

          {filteredArtworks.length === 0 && (
            <div className="py-16 text-center text-neutral-500 font-mono text-sm">
              {lang === 'en' ? 'No artworks found in this category.' : 'Bu kategoride eser bulunamadı.'}
            </div>
          )}
        </div>

        {/* SAĞ: SABİT DİNAMİK HOVER GÖRSELİ & ESER KARTI (5 Kolon) */}
        {/* Görsel referansındaki gibi sağ blokta pürüzsüz Framer Motion geçişi */}
        <div className="hidden lg:block lg:col-span-5 sticky top-28">
          <div className="relative w-full border border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md p-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
            
            {/* Dinamik Görsel Çerçevesi */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 border border-neutral-800">
              <AnimatePresence mode="wait">
                {activeArtwork && (
                  <motion.div
                    key={activeArtwork.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeArtwork.images[0] || '/artworks/4107f9b51db8c3dbac92156e1eebba6e.jpg'}
                      alt={activeArtwork.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 50vw, 40vw"
                      priority
                      referrerPolicy="no-referrer"
                    />

                    {/* Lüks Köşe Rozeti */}
                    <div className="absolute top-3 left-3 bg-neutral-950/90 border border-neutral-800 px-2.5 py-1 text-[10px] font-mono text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{activeArtwork.isUniquePiece ? '1/1 Unique' : 'Bespoke'}</span>
                    </div>

                    {/* Hover Yönlendirme İpucu */}
                    <div className="absolute bottom-3 right-3 bg-neutral-950/90 border border-neutral-700 px-3 py-1 text-[10px] font-mono text-neutral-200 uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                      <span>{lang === 'en' ? 'View Details' : 'Detayları Gör'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dinamik Eser Bilgi Kartı */}
            {activeArtwork && (
              <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-amber-400/90 uppercase tracking-widest block">
                      {activeArtwork.collectionName}
                    </span>
                    <h3 className="font-serif text-xl text-white uppercase font-light">
                      {activeArtwork.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-neutral-200 block">
                      {activeArtwork.price}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {activeArtwork.year}
                    </span>
                  </div>
                </div>

                <p className="font-sans text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {lang === 'en'
                    ? (activeArtwork.descriptionEn || activeArtwork.description)
                    : activeArtwork.description}
                </p>

                <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-500 border-t border-neutral-900">
                  <span>{lang === 'en' ? (activeArtwork.materialEn || activeArtwork.material) : activeArtwork.material}</span>
                  <Link
                    href={`${langPrefix}/koleksiyon/${activeArtwork.id}`}
                    onClick={() => soundFx.playClick()}
                    className="text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>{lang === 'en' ? 'Explore Page' : 'İncele'}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. ALT BİLGİ & SAYAÇ */}
      <footer className="w-full border-t border-neutral-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 gap-2">
        <div className="flex items-center gap-4">
          <span>NONVALUE MASTER REGISTER</span>
          <span>•</span>
          <span>{filteredArtworks.length} {lang === 'en' ? 'WORKS RECORDED' : 'ESER KAYITLI'}</span>
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
