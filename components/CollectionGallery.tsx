'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, List, ArrowUpRight, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { ArtworkDetail } from '@/lib/artworks-data';

interface CollectionGalleryProps {
  artworks: ArtworkDetail[];
}

export default function CollectionGallery({ artworks }: CollectionGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'slide' | 'grid' | 'table'>('slide');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<boolean>(false);

  const categories = [
    { id: 'ALL', label: 'TÜM ENVANTER', count: artworks.length, code: 'NV-ALL' },
    { id: 'OBJECT', label: 'OBJECT', count: artworks.filter((a) => a.collectionName.includes('object')).length, code: 'AXIS-01' },
    { id: 'SPACE', label: 'SPACE', count: artworks.filter((a) => a.collectionName.includes('space')).length, code: 'AXIS-02' },
    { id: 'LINE', label: 'LINE', count: artworks.filter((a) => a.collectionName.includes('line')).length, code: 'AXIS-03' },
  ];

  const filteredArtworks =
    activeCategory === 'ALL'
      ? artworks
      : artworks.filter((a) => a.collectionName.toUpperCase().includes(activeCategory));

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    setCurrentSlideIndex(0);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // Belirli bir slide'a kaydırma
  const scrollToSlide = useCallback((index: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const cards = container.children;
    if (cards[index]) {
      const targetCard = cards[index] as HTMLElement;
      isScrollingRef.current = true;
      container.scrollTo({
        left: targetCard.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });
      setCurrentSlideIndex(index);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 450);
    }
  }, []);

  const handleNextSlide = () => {
    if (filteredArtworks.length === 0) return;
    const next = (currentSlideIndex + 1) % filteredArtworks.length;
    scrollToSlide(next);
  };

  const handlePrevSlide = () => {
    if (filteredArtworks.length === 0) return;
    const prev = (currentSlideIndex - 1 + filteredArtworks.length) % filteredArtworks.length;
    scrollToSlide(prev);
  };

  // Scroll listener for synchronizing active indicator
  useEffect(() => {
    const container = sliderRef.current;
    if (!container || displayMode !== 'slide') return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.clientWidth * 0.7;
      const newIdx = Math.round(scrollLeft / cardWidth);
      if (newIdx >= 0 && newIdx < filteredArtworks.length && newIdx !== currentSlideIndex) {
        setCurrentSlideIndex(newIdx);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentSlideIndex, displayMode, filteredArtworks.length]);

  return (
    <div className="w-full font-sans text-neutral-950">
      
      {/* ========================================================================= */}
      {/* 📋 EDİTORYAL BRUTALİZM KONTROL VE ENVANTER ŞERİDİ */}
      {/* ========================================================================= */}
      <div className="border border-neutral-950 bg-white p-4 sm:p-6 mb-10 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Aks Filtreleme Butonları (Brutalist Chips) */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
            <span className="text-neutral-400 font-bold mr-2 text-[10px] hidden sm:inline">
              [FİLTRE // AKS]:
            </span>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2 border transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-[2px_2px_0px_#888]'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:border-neutral-950 hover:bg-white'
                  }`}
                >
                  <span className="font-semibold">{cat.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                    [{cat.count}]
                  </span>
                </button>
              );
            })}
          </div>

          {/* Görünüm Modu & Arşiv Telemetrisi */}
          <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-200">
            <span className="text-[11px] font-mono text-neutral-500 uppercase">
              GÖSTERİLEN: {filteredArtworks.length} / {artworks.length} ESER
            </span>

            {/* 3 Görünüm Formatı: Slide (Kayar), Izgara (Grid), Tablo (Table) */}
            <div className="flex items-center border border-neutral-950 bg-neutral-100 p-0.5">
              <button
                onClick={() => setDisplayMode('slide')}
                className={`px-3 py-1 text-xs font-mono uppercase flex items-center gap-1.5 transition-colors ${
                  displayMode === 'slide' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-600 hover:text-black'
                }`}
                title="Slide (Kayar) Sergi Görünümü"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Slide</span>
              </button>
              <button
                onClick={() => setDisplayMode('grid')}
                className={`p-1.5 transition-colors ${
                  displayMode === 'grid' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-600 hover:text-black'
                }`}
                title="Editoryal Izgara Görünümü"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDisplayMode('table')}
                className={`p-1.5 transition-colors ${
                  displayMode === 'table' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-600 hover:text-black'
                }`}
                title="Teknik Envanter Tablosu"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Aks Açıklama Şeridi */}
        <div className="mt-4 pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-600 flex flex-col sm:flex-row justify-between gap-2">
          <span>
            {activeCategory === 'ALL' && 'TÜM ARŞİV: 2018–2025 Tarihleri Arasında Üretilen Tüm Eser Kayıtları'}
            {activeCategory === 'OBJECT' && 'OBJECT: Doğrudan bedenle temas eden heykelsi takı ve maden araştırmaları'}
            {activeCategory === 'SPACE' && 'SPACE: Takının bedenden mekana taştığı mekansal heykeller ve enstalasyonlar'}
            {activeCategory === 'LINE' && 'LINE: Kağıt, ateş ve malzeme karşılaşmalarına ait eskiz ve süreç izleri'}
          </span>
          <span className="text-neutral-500 text-right uppercase">
            AKTİF DÜZEN: {displayMode === 'slide' ? 'SLİDE (KAYAR)' : displayMode === 'grid' ? 'IZGARA' : 'TABLO'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎞️ GÖRÜNÜM 1: PROFESYONEL STANDARTTA SLİDE KAYAR SERGİ (PRIMARY SLIDER) */}
      {/* ========================================================================= */}
      {displayMode === 'slide' && (
        <div className="w-full">
          
          {/* Slide Gezinme & İlerleme Başlığı */}
          <div className="flex items-center justify-between border-b-2 border-neutral-950 pb-3 mb-6 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="bg-neutral-950 text-white px-2 py-0.5 font-bold">
                SLİDE {String(currentSlideIndex + 1).padStart(2, '0')} / {String(filteredArtworks.length).padStart(2, '0')}
              </span>
              <span className="text-neutral-700 hidden sm:inline">
                [{filteredArtworks[currentSlideIndex]?.title || ''}]
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                aria-label="Önceki Eser"
                className="border border-neutral-950 bg-white hover:bg-neutral-950 hover:text-white px-3 py-1.5 transition-colors shadow-[2px_2px_0px_#000] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Önceki</span>
              </button>
              <button
                onClick={handleNextSlide}
                aria-label="Sonraki Eser"
                className="border border-neutral-950 bg-white hover:bg-neutral-950 hover:text-white px-3 py-1.5 transition-colors shadow-[2px_2px_0px_#000] flex items-center gap-1"
              >
                <span className="hidden sm:inline">Sonraki</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Kartları Kayar Parkuru (Horizontal Reel) */}
          <div
            ref={sliderRef}
            className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory flex gap-6 sm:gap-8 pb-8 pt-2 scroll-smooth cursor-grab active:cursor-grabbing"
          >
            {filteredArtworks.map((item, idx) => {
              const isActive = currentSlideIndex === idx;

              return (
                <motion.article
                  key={item.id}
                  className={`w-[85vw] sm:w-[65vw] md:w-[48vw] lg:w-[40vw] max-w-[560px] shrink-0 snap-center bg-white border-2 border-neutral-950 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 ${
                    isActive
                      ? 'shadow-[8px_8px_0px_#000] border-neutral-950'
                      : 'shadow-[4px_4px_0px_#777] opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Kart Başlık Şeridi */}
                  <div className="flex items-center justify-between border-b border-neutral-950 pb-2.5 mb-3 text-xs font-mono uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-950">[+]</span>
                      <span className="font-bold">NV-24-{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <div>
                      {item.isUniquePiece ? (
                        <span className="bg-neutral-950 text-amber-300 px-2 py-0.5 text-[9px] font-bold">
                          1/1 EŞSİZ
                        </span>
                      ) : (
                        <span className="border border-neutral-400 px-1.5 py-0.5 text-[9px] text-neutral-700">
                          EDİSYON
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fotoğraf Alanı */}
                  <Link
                    href={`/koleksiyon/${item.id}`}
                    className="block relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden border border-neutral-950 group cursor-pointer"
                  >
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 85vw, 500px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.03]"
                      priority={idx < 2}
                    />

                    <div className="absolute bottom-0 right-0 bg-neutral-950 text-white px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-transform duration-300 translate-y-full group-hover:translate-y-0 flex items-center gap-1.5">
                      <span>3D Parallax</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>

                  {/* Eser Bilgileri */}
                  <div className="mt-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
                        <span>{item.category} • {item.year}</span>
                        <span className="font-serif text-base font-bold text-neutral-950">{item.price}</span>
                      </div>

                      <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-tight text-neutral-950 hover:underline">
                        <Link href={`/koleksiyon/${item.id}`}>
                          {item.title}
                        </Link>
                      </h3>

                      <p className="mt-2 text-xs font-sans text-neutral-700 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Teknik Matris */}
                    <div className="mt-4 pt-3 border-t border-neutral-950 grid grid-cols-2 gap-2 text-[11px] font-mono uppercase">
                      <div>
                        <span className="text-neutral-400 block text-[8px]">MATERYAL</span>
                        <span className="text-neutral-950 font-semibold truncate block">{item.material}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-400 block text-[8px]">TEKNİK // AĞIRLIK</span>
                        <span className="text-neutral-950 font-semibold truncate block">{item.weight}</span>
                      </div>
                    </div>

                    {/* Detay Butonu */}
                    <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">
                        {item.collectionName}
                      </span>
                      <Link
                        href={`/koleksiyon/${item.id}`}
                        className="inline-flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all shadow-[2px_2px_0px_#666]"
                      >
                        <span>Parallax İncele</span>
                        <span>→</span>
                      </Link>
                    </div>

                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Alt Hızlı İndikatör Şeridi */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {filteredArtworks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSlide(idx)}
                className={`h-2 transition-all ${
                  currentSlideIndex === idx
                    ? 'w-8 bg-neutral-950'
                    : 'w-2 bg-neutral-300 hover:bg-neutral-600'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🖼️ GÖRÜNÜM 2: EDİTORYAL BRUTALİST IZGARA (CONTACT SHEET DOSSIER) */}
      {/* ========================================================================= */}
      {displayMode === 'grid' && (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence>
            {filteredArtworks.map((item, idx) => (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-neutral-950 p-4 shadow-[5px_5px_0px_#000] flex flex-col justify-between group"
              >
                {/* Üst Brutalist Künye Şeridi */}
                <div className="flex items-center justify-between border-b border-neutral-950 pb-2 mb-3 text-[10px] font-mono tracking-widest uppercase">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>[+]</span>
                    <span>NV-24-{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span>{item.year}</span>
                    {item.isUniquePiece ? (
                      <span className="bg-neutral-950 text-white px-1.5 py-0.2 text-[8px] font-bold">
                        1/1 UNIQUE
                      </span>
                    ) : (
                      <span className="border border-neutral-400 px-1 text-[8px]">
                        EDİSYON
                      </span>
                    )}
                  </div>
                </div>

                {/* Görsel Alanı (1px Hairline Bordered Archival Photo) */}
                <Link
                  href={`/koleksiyon/${item.id}`}
                  className="block relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-950 group cursor-pointer"
                >
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.02]"
                  />

                  {/* Film İndeks Numarası */}
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] font-mono text-white/90 uppercase tracking-widest border border-white/10">
                    FRAME 0{idx + 1}
                  </div>

                  {/* Uzamsal Parallax Rozeti */}
                  <div className="absolute bottom-2 right-2 bg-neutral-950 text-white px-3 py-1 text-[9px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span>3D Parallax İncele</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>

                {/* Alt Detay Alanı & Teknik Tablo */}
                <div className="pt-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-950">
                        {item.price}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl uppercase tracking-tight text-neutral-950 group-hover:underline">
                      <Link href={`/koleksiyon/${item.id}`}>
                        {item.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-xs font-sans text-neutral-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Brutalist Alt Matris */}
                  <div className="mt-4 pt-3 border-t border-neutral-200 grid grid-cols-2 gap-2 text-[9px] font-mono uppercase text-neutral-500">
                    <div>
                      <span className="text-neutral-400 block text-[8px]">MATERYAL</span>
                      <span className="text-neutral-900 truncate block font-medium">{item.material}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-400 block text-[8px]">AĞIRLIK</span>
                      <span className="text-neutral-900 block font-medium">{item.weight}</span>
                    </div>
                  </div>

                  {/* Aksiyona Çağrı */}
                  <div className="mt-4 pt-2 border-t border-neutral-950 flex justify-between items-center text-[10px] font-mono uppercase">
                    <span className="text-neutral-500">{item.collectionName.replace('nonvalue — ', '')}</span>
                    <Link
                      href={`/koleksiyon/${item.id}`}
                      className="font-bold text-neutral-950 hover:underline flex items-center gap-1"
                    >
                      <span>Uzamsal Detay</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 📊 GÖRÜNÜM 3: BRUTALİST TEKNİK ENVANTER TABLOSU (ARCHIVAL TABLE) */}
      {/* ========================================================================= */}
      {displayMode === 'table' && (
        <div className="w-full overflow-x-auto border border-neutral-950 bg-white shadow-[6px_6px_0px_#000]">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-neutral-950 text-white uppercase text-[10px] tracking-widest border-b border-neutral-950">
                <th className="py-3 px-4 border-r border-neutral-800">REF NO</th>
                <th className="py-3 px-4 border-r border-neutral-800">MİNYATÜR</th>
                <th className="py-3 px-4 border-r border-neutral-800">ESER ADI</th>
                <th className="py-3 px-4 border-r border-neutral-800">AKS / KATEGORİ</th>
                <th className="py-3 px-4 border-r border-neutral-800">MADEN / MATERYAL</th>
                <th className="py-3 px-4 border-r border-neutral-800">TEKNİK</th>
                <th className="py-3 px-4 border-r border-neutral-800">YIL</th>
                <th className="py-3 px-4 border-r border-neutral-800">EDİSYON</th>
                <th className="py-3 px-4 border-r border-neutral-800">DEĞER</th>
                <th className="py-3 px-4 text-center">İŞLEM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {filteredArtworks.map((item, idx) => (
                <tr key={item.id} className="hover:bg-neutral-100 transition-colors">
                  <td className="py-3 px-4 font-bold border-r border-neutral-200">
                    NV-24-{String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-2 px-4 border-r border-neutral-200 w-16">
                    <div className="relative w-12 h-12 bg-neutral-200 border border-neutral-950">
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-serif text-base border-r border-neutral-200 font-bold uppercase">
                    <Link href={`/koleksiyon/${item.id}`} className="hover:underline">
                      {item.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 border-r border-neutral-200 text-neutral-600">
                    {item.collectionName.replace('nonvalue — ', '').toUpperCase()}
                  </td>
                  <td className="py-3 px-4 border-r border-neutral-200 max-w-[180px] truncate text-neutral-800">
                    {item.material}
                  </td>
                  <td className="py-3 px-4 border-r border-neutral-200 max-w-[150px] truncate text-neutral-600">
                    {item.technique}
                  </td>
                  <td className="py-3 px-4 border-r border-neutral-200 text-neutral-600">
                    {item.year}
                  </td>
                  <td className="py-3 px-4 border-r border-neutral-200">
                    {item.isUniquePiece ? (
                      <span className="bg-neutral-950 text-white px-2 py-0.5 text-[9px] font-bold">
                        1/1
                      </span>
                    ) : (
                      <span className="text-neutral-500">LTD</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold border-r border-neutral-200 text-neutral-950">
                    {item.price}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href={`/koleksiyon/${item.id}`}
                      className="inline-block bg-neutral-950 hover:bg-neutral-800 text-white px-3 py-1.5 text-[10px] uppercase tracking-wider"
                    >
                      3D Parallax →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
