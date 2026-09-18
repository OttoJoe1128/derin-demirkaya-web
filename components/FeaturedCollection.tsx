'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowUpRight, Film, Sparkles } from 'lucide-react';
import { ARTWORKS_DATA, getLocalizedArtwork } from '@/lib/artworks-data';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';

export default function FeaturedCollection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const { t, language } = useLanguage();

  // 10 Eserin Tamamı (All 10 Artworks in Editorial Brutalism Format with full bilingual localization)
  const specimens = useMemo(() => {
    return ARTWORKS_DATA.map((art, idx) => {
      const localized = getLocalizedArtwork(art, language);
      return {
        ...localized,
        specimenIndex: idx + 1,
        specimenCode: `NV-24-${String(idx + 1).padStart(2, '0')}`,
        filmCode: idx % 3 === 0 ? 'ILFORD_HP5_36A' : idx % 3 === 1 ? 'KODAK_TRI_X_12' : 'FUJI_NEOPAN_08',
      };
    });
  }, [language]);

  // Masaüstü Fare ile Sol Tık Tutup Sağa Sola Kaydırma (Desktop Mouse Drag-to-Scroll)
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !sliderRef.current) return;
    isMouseDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.scrollBehavior = 'auto';
    sliderRef.current.style.scrollSnapType = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current || !sliderRef.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 12) {
      e.preventDefault();
      hasMovedRef.current = true;
      setIsMouseDragging(true);
    }
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.removeProperty('scroll-behavior');
      sliderRef.current.style.removeProperty('scroll-snap-type');
    }
    setTimeout(() => {
      hasMovedRef.current = false;
      setIsMouseDragging(false);
    }, 80);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Belirli bir slide indeksine yumuşak geçiş (Smooth Scroll)
  const scrollToSlide = useCallback((index: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const cards = container.children;
    if (cards[index]) {
      const targetCard = cards[index] as HTMLElement;
      isUserScrollingRef.current = true;
      container.scrollTo({
        left: targetCard.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
      setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 500);
    }
  }, []);

  const handleNext = () => {
    soundFx.playClick();
    const nextIndex = (currentIndex + 1) % specimens.length;
    scrollToSlide(nextIndex);
  };

  const handlePrev = () => {
    soundFx.playClick();
    const prevIndex = (currentIndex - 1 + specimens.length) % specimens.length;
    scrollToSlide(prevIndex);
  };

  // Kullanıcı yatay kaydırdıkça aktif slide indeksini senkronize et
  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isUserScrollingRef.current) return;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.clientWidth * 0.75;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex >= 0 && newIndex < specimens.length && newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, specimens.length]);

  // Klavye ok tuşları ile gezinti
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <section
      id="koleksiyon"
      className="w-full bg-[#f4f2ee] text-neutral-950 py-8 sm:py-16 md:py-28 lg:py-32 border-t border-b border-neutral-950 scroll-mt-14 sm:scroll-mt-20 font-sans select-none"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 mb-3 sm:mb-8 md:mb-12">
        
        {/* ========================================================================= */}
        {/* 📰 EDİTORYAL BRUTALİZM MANİFESTO VE SLIDE YÖNETİM ŞERİDİ */}
        {/* ========================================================================= */}
        <div className="border-b-2 border-neutral-950 pb-3 sm:pb-6 md:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 md:gap-8">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[11px] font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase text-neutral-600 mb-1 sm:mb-2.5">
              <span className="bg-neutral-950 text-white px-2 py-0.5 font-bold">
                {language === 'TR' ? 'EDİTORYAL BRUTALİZM' : 'EDITORIAL BRUTALISM'}
              </span>
              <span>{'//'}</span>
              <span>{language === 'TR' ? 'SLİDE SERGİ' : 'SLIDE EXHIBITION'}</span>
              <span>{'//'}</span>
              <span>{specimens.length} {language === 'TR' ? 'ESER' : 'PIECES'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.92] text-neutral-950">
              {t('collection.title')}{' '}
              <span className="italic font-light text-neutral-700 ml-1 sm:ml-4 md:ml-12 block sm:inline">
                {t('collection.archive')}
              </span>
            </h2>
          </div>

          {/* Slide Kontrol & Sayaç Bloğu (Brutalist HUD Controls - Mobilde Kompakt Tek Satır) */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full md:w-auto">
            
            {/* Canlı İndeks Sayacı */}
            <div className="border border-neutral-950 bg-white px-3 py-1.5 sm:px-5 sm:py-3 font-mono text-[11px] sm:text-xs shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000] flex-1 sm:flex-none">
              <span className="text-neutral-400 block text-[8px] sm:text-[9px] uppercase tracking-widest hidden sm:block">
                {t('collection.activeSpecimen')}
              </span>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="font-serif text-base sm:text-2xl font-bold text-neutral-950">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-neutral-400 font-mono text-[10px] sm:text-xs">
                  / {String(specimens.length).padStart(2, '0')}
                </span>
                <span className="text-neutral-600 uppercase text-[9px] sm:text-[10px] ml-1 font-semibold truncate max-w-[110px] sm:max-w-[180px]">
                  [{specimens[currentIndex].title}]
                </span>
              </div>
            </div>

            {/* İleri / Geri Butonları */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={handlePrev}
                aria-label="Önceki Eser Slide"
                className="border-2 border-neutral-950 bg-white hover:bg-neutral-950 hover:text-white p-2 sm:p-4 transition-colors shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1 font-mono text-xs uppercase cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{t('collection.prev')}</span>
              </button>
              <button
                onClick={handleNext}
                aria-label="Sonraki Eser Slide"
                className="border-2 border-neutral-950 bg-white hover:bg-neutral-950 hover:text-white p-2 sm:p-4 transition-colors shadow-[2px_2px_0px_#000] sm:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1 font-mono text-xs uppercase cursor-pointer"
              >
                <span className="hidden sm:inline">{t('collection.next')}</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Eser İlerleme Çubuğu & Slide Tıklama İndikatörleri */}
        <div className="mt-2 sm:mt-4 flex items-center justify-between gap-2 overflow-x-auto py-1 sm:py-2 scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-1.5 w-full">
            {specimens.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => scrollToSlide(idx)}
                className={`h-1.5 sm:h-2 transition-all rounded-none cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 sm:w-10 bg-neutral-950 border border-neutral-950'
                    : 'w-2 sm:w-4 bg-neutral-300 hover:bg-neutral-600 border border-neutral-400'
                }`}
                title={`${item.title} (0${idx + 1})`}
              />
            ))}
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase text-neutral-500 shrink-0 hidden sm:inline">
            {t('collection.dragHint')}
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🎞️ PROFESYONEL STANDARTTA SLİDE KAYAR İZİ (HORIZONTAL SLIDER TRACK) */}
      {/* ========================================================================= */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full overflow-x-auto scrollbar-none snap-x snap-mandatory flex gap-4 sm:gap-8 md:gap-12 px-3.5 sm:px-12 md:px-20 py-2 sm:py-6 scroll-smooth touch-pan-x overscroll-x-contain ${
          isMouseDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
      >
        {specimens.map((art, idx) => {
          const isActive = currentIndex === idx;

          return (
            <motion.article
              key={art.id}
              className={`w-[88vw] sm:w-[70vw] md:w-[56vw] lg:w-[48vw] max-w-[650px] shrink-0 snap-center bg-white border-2 border-neutral-950 p-3.5 sm:p-6 md:p-8 flex flex-col justify-between transition-all duration-300 ${
                isActive
                  ? 'shadow-[6px_6px_0px_#000] sm:shadow-[10px_10px_0px_#000] scale-[1.01]'
                  : 'shadow-[3px_3px_0px_#888] sm:shadow-[5px_5px_0px_#888] opacity-85 hover:opacity-100'
              }`}
            >
              {/* Üst Teknik Çapraz Çizgiler ve Eser Kodu */}
              <div className="flex items-center justify-between border-b sm:border-b-2 border-neutral-950 pb-2 mb-2.5 sm:pb-3 sm:mb-5 text-[10px] sm:text-xs font-mono tracking-widest uppercase">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-neutral-950">[+]</span>
                  <span className="font-bold text-neutral-950">{art.specimenCode}</span>
                  <span className="text-neutral-400">{'//'}</span>
                  <span className="text-neutral-600 hidden sm:inline">{art.filmCode}</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {art.isUniquePiece ? (
                    <span className="inline-flex items-center gap-1 bg-neutral-950 text-amber-300 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      {language === 'TR' ? '1/1 EŞSİZ' : '1/1 UNIQUE'}
                    </span>
                  ) : (
                    <span className="border border-neutral-950 px-1.5 py-0.5 text-[9px] sm:text-[10px] text-neutral-700 font-semibold">
                      {language === 'TR' ? 'LİMİTLİ SERİ' : 'LIMITED EDITION'}
                    </span>
                  )}
                  <span className="font-bold text-neutral-950">[+]</span>
                </div>
              </div>

              {/* Görsel Alanı (Contact Sheet Format with Film Borders) */}
              <Link
                href={`/koleksiyon/${art.id}`}
                onClick={handleCardClick}
                className="block relative aspect-[16/10] sm:aspect-[16/11] w-full bg-neutral-100 overflow-hidden border border-neutral-950 group cursor-pointer"
              >
                <Image
                  src={art.images[0]}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 88vw, 650px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.03]"
                  priority={idx < 2}
                  draggable={false}
                />

                {/* Film Şeridi Kenar Çentikleri */}
                <div className="absolute top-0 bottom-0 left-2 pointer-events-none hidden sm:flex flex-col justify-around text-[9px] font-mono text-white/50 z-10">
                  <span>▮ 35A</span>
                  <span>▮ 36</span>
                  <span>▮ 36A</span>
                </div>

                {/* Sağ Alt Hover Çağrısı */}
                <div className="absolute bottom-0 right-0 bg-neutral-950 text-white px-3 sm:px-4 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] transition-transform duration-300 translate-y-full group-hover:translate-y-0 flex items-center gap-2">
                  <span>{language === 'TR' ? '3D Uzamsal Parallax' : '3D Spatial Parallax'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {/* Başlık ve Eser Bilgileri */}
              <div className="mt-3 sm:mt-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
                    <span>{art.category} • {art.year}</span>
                    <span className="font-serif text-sm sm:text-lg font-bold text-neutral-950">
                      {art.price}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-4xl md:text-5xl uppercase tracking-tight text-neutral-950 group-hover:underline leading-snug">
                    <Link href={`/koleksiyon/${art.id}`} onClick={handleCardClick}>
                      {art.title}
                    </Link>
                  </h3>

                  <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs font-sans text-neutral-700 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                </div>

                {/* Brutalist Teknik Veri Matrisi (Maden, Teknik, Ağırlık) */}
                <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t sm:border-t-2 border-neutral-950 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-[9px] sm:text-xs font-mono uppercase">
                  <div>
                    <span className="text-neutral-400 block text-[8px] sm:text-[9px]">
                      {language === 'TR' ? 'MATERYAL & MADEN' : 'MATERIAL & METALS'}
                    </span>
                    <span className="text-neutral-950 font-semibold truncate block">
                      {art.material}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[8px] sm:text-[9px]">
                      {language === 'TR' ? 'ZANAAT TEKNİĞİ' : 'TECHNIQUE'}
                    </span>
                    <span className="text-neutral-950 font-semibold truncate block">
                      {art.technique}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 text-left sm:text-right">
                    <span className="text-neutral-400 block text-[8px] sm:text-[9px]">
                      {language === 'TR' ? 'GRAMAJ' : 'WEIGHT'}
                    </span>
                    <span className="text-neutral-950 font-bold block">
                      {art.weight}
                    </span>
                  </div>
                </div>

                {/* Aksiyona Çağrı Butonu */}
                <div className="mt-3 sm:mt-6 pt-2 sm:pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase truncate max-w-[150px] sm:max-w-none">
                    {art.collectionName}
                  </span>

                  <Link
                    href={`/koleksiyon/${art.id}`}
                    onClick={handleCardClick}
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-3.5 py-1.5 sm:px-5 sm:py-2.5 font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-[2px_2px_0px_#666]"
                  >
                    <span>{language === 'TR' ? '3D Parallax' : '3D Parallax'}</span>
                    <span>→</span>
                  </Link>
                </div>

              </div>

            </motion.article>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 🏛️ TÜM ARŞİV VE SİNEMATİK TUVAL GEÇİŞ BÖLÜMÜ */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 mt-8 sm:mt-16">
        <div className="border-2 border-neutral-950 bg-white p-4 sm:p-10 shadow-[4px_4px_0px_#000] sm:shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
              <Film className="w-3.5 h-3.5 text-neutral-950" />
              <span>{language === 'TR' ? 'DİĞER DENEYİM FORMATLARI' : 'ALTERNATIVE FORMATS'}</span>
            </div>
            <h4 className="font-serif text-xl sm:text-3xl uppercase tracking-tight text-neutral-950">
              {language === 'TR'
                ? 'Koleksiyonu Farklı Perspektiflerle Keşfedin'
                : 'Explore Collection Through Multiple Perspectives'}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-[11px] sm:text-xs uppercase tracking-widest">
            <Link
              href="/koleksiyon"
              className="bg-neutral-950 text-white px-4 py-2.5 sm:px-6 sm:py-3.5 hover:bg-neutral-800 transition-colors shadow-[2px_2px_0px_#666] sm:shadow-[3px_3px_0px_#666] text-center flex-1 sm:flex-none"
            >
              {language === 'TR' ? 'Tam Envanter (10 Eser)' : 'Full Catalog (10 Pieces)'}
            </Link>
            <Link
              href="/arsiv"
              className="border-2 border-neutral-950 bg-white text-neutral-950 px-4 py-2.5 sm:px-6 sm:py-3.5 hover:bg-neutral-100 transition-colors shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000] text-center flex-1 sm:flex-none"
            >
              {language === 'TR' ? 'Sinematik Tuval ↗' : 'Cinematic Canvas ↗'}
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
