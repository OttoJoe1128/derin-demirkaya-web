'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { ARTWORKS_DATA, getLocalizedArtwork } from '@/lib/artworks-data';
import { WORKSHOPS_DATA } from '@/lib/workshops-data';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'ALL' | 'ARTWORKS' | 'WORKSHOPS';

export default function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === 'EN';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setSearchQuery('');
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  // Localized Artworks
  const localizedArtworks = useMemo(() => {
    return ARTWORKS_DATA.map((art) => getLocalizedArtwork(art, language));
  }, [language]);

  // Filtered Results
  const results = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const matchedArtworks = localizedArtworks
      .filter((art) => {
        if (!q) return true;
        return (
          art.title.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          art.material.toLowerCase().includes(q) ||
          art.technique.toLowerCase().includes(q) ||
          art.description.toLowerCase().includes(q) ||
          art.year.includes(q)
        );
      })
      .map((art, idx) => ({
        type: 'artwork' as const,
        id: `art-${art.id}`,
        title: art.title,
        subtitle: `${art.category} • ${art.year}`,
        badge: art.isUniquePiece ? (isEn ? '1/1 UNIQUE' : '1/1 EŞSİZ') : (isEn ? 'EDITION' : 'EDİSYON'),
        badgeColor: art.isUniquePiece ? 'bg-neutral-950 text-amber-300' : 'border border-neutral-300 text-neutral-600',
        price: art.price,
        image: art.images[0],
        href: `/koleksiyon/${art.id}`,
        extra: art.material,
        rawIndex: idx,
      }));

    const matchedWorkshops = WORKSHOPS_DATA
      .filter((ws) => {
        if (!q) return true;
        const title = isEn ? ws.titleEn : ws.title;
        const desc = isEn ? ws.descriptionEn : ws.description;
        const location = isEn ? ws.locationEn : ws.location;
        const cat = isEn ? ws.categoryTitleEn : ws.categoryTitle;
        return (
          title.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q) ||
          location.toLowerCase().includes(q) ||
          cat.toLowerCase().includes(q) ||
          ws.instructor.toLowerCase().includes(q)
        );
      })
      .map((ws, idx) => ({
        type: 'workshop' as const,
        id: `ws-${ws.id}`,
        title: isEn ? ws.titleEn : ws.title,
        subtitle: `${isEn ? ws.categoryTitleEn : ws.categoryTitle} • ${ws.instructor}`,
        badge: ws.enrolledCount >= ws.capacity
          ? (isEn ? 'FULLY BOOKED' : 'KONTENJAN DOLDU')
          : (isEn ? `${ws.capacity - ws.enrolledCount} SEATS LEFT` : `${ws.capacity - ws.enrolledCount} KOLTUK`),
        badgeColor: ws.enrolledCount >= ws.capacity
          ? 'bg-neutral-200 text-neutral-600'
          : 'bg-neutral-950 text-white',
        price: ws.price,
        image: ws.imageUrl,
        href: `/atolye#${ws.slug}`,
        extra: isEn ? ws.locationEn : ws.location,
        rawIndex: idx,
      }));

    if (activeFilter === 'ARTWORKS') return matchedArtworks;
    if (activeFilter === 'WORKSHOPS') return matchedWorkshops;

    return [...matchedArtworks, ...matchedWorkshops];
  }, [searchQuery, localizedArtworks, isEn, activeFilter]);

  const safeSelectedIndex = results.length === 0 ? 0 : Math.min(selectedIndex, results.length - 1);

  const handleSelectResult = useCallback((href: string) => {
    soundFx.playClick();
    handleClose();
    router.push(href);
  }, [handleClose, router]);

  // Keyboard Navigation inside Modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        soundFx.playHover();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        soundFx.playHover();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, results.length - 1)));
      } else if (e.key === 'Enter') {
        if (results[safeSelectedIndex]) {
          e.preventDefault();
          handleSelectResult(results[safeSelectedIndex].href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, safeSelectedIndex, handleClose, handleSelectResult]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(`[data-result-index="${safeSelectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [safeSelectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window (Brutalist Dossier Search) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-[#faf8f5] border-2 border-neutral-950 shadow-[10px_10px_0px_#000] z-10 flex flex-col max-h-[85vh] overflow-hidden font-sans"
        >
          {/* Header Bar */}
          <div className="border-b-2 border-neutral-950 bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={
                  isEn
                    ? 'Search specimens, materials, techniques, workshops...'
                    : 'Eser, materyal, döküm tekniği veya atölye ara...'
                }
                className="w-full bg-transparent text-sm sm:text-base font-sans text-neutral-950 placeholder-neutral-400 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-400 hover:text-neutral-950 p-1 font-mono text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 border border-neutral-300 bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
                <span>ESC</span>
              </div>
            </div>

            {/* Filter Chips Bar */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveFilter('ALL');
                  }}
                  className={`px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors ${
                    activeFilter === 'ALL'
                      ? 'bg-neutral-950 text-white'
                      : 'border border-neutral-300 text-neutral-600 hover:border-neutral-950'
                  }`}
                >
                  {isEn ? 'All' : 'Tümü'} ({localizedArtworks.length + WORKSHOPS_DATA.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveFilter('ARTWORKS');
                  }}
                  className={`px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors ${
                    activeFilter === 'ARTWORKS'
                      ? 'bg-neutral-950 text-white'
                      : 'border border-neutral-300 text-neutral-600 hover:border-neutral-950'
                  }`}
                >
                  <span className="hidden sm:inline">{isEn ? 'Artworks' : 'Eserler'}</span>
                  <span className="sm:hidden">{isEn ? 'Works' : 'Eser'}</span> ({localizedArtworks.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveFilter('WORKSHOPS');
                  }}
                  className={`px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors ${
                    activeFilter === 'WORKSHOPS'
                      ? 'bg-neutral-950 text-white'
                      : 'border border-neutral-300 text-neutral-600 hover:border-neutral-950'
                  }`}
                >
                  <span className="hidden sm:inline">{isEn ? 'Workshops' : 'Atölyeler'}</span>
                  <span className="sm:hidden">{isEn ? 'Workshops' : 'Atölye'}</span> ({WORKSHOPS_DATA.length})
                </button>
              </div>

              <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                {results.length} {isEn ? 'records found' : 'kayıt'}
              </span>
            </div>
          </div>

          {/* Results List */}
          <div
            ref={resultsContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-neutral-200/60 max-h-[55vh]"
          >
            {results.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-neutral-500">
                <p className="uppercase tracking-widest text-neutral-400 mb-2">
                  [ {isEn ? 'NO MATCHING ARCHIVE RECORD' : 'EŞLEŞEN KAYIT BULUNAMADI'} ]
                </p>
                <p className="font-sans text-neutral-600">
                  {isEn
                    ? 'Try searching with different materials (silver, obsidian, brass) or techniques.'
                    : 'Farklı bir maden, taş (gümüş, obsidyen, pirinç) veya döküm terimiyle deneyin.'}
                </p>
              </div>
            ) : (
              results.map((item, idx) => {
                const isSelected = selectedIndex === idx;

                return (
                  <div
                    key={item.id}
                    data-result-index={idx}
                    onClick={() => handleSelectResult(item.href)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`pt-2 first:pt-0 p-3 transition-all cursor-pointer flex items-center justify-between gap-4 border ${
                      isSelected
                        ? 'bg-white border-neutral-950 shadow-[3px_3px_0px_#000]'
                        : 'bg-transparent border-transparent hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Thumbnail */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-neutral-200 border border-neutral-950 shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold tracking-wider ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase truncate">
                            {item.subtitle}
                          </span>
                        </div>
                        <h4 className="font-serif text-base sm:text-lg text-neutral-950 uppercase tracking-tight truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] font-sans text-neutral-600 truncate max-w-md">
                          {item.extra}
                        </p>
                      </div>
                    </div>

                    {/* Right Price / Action */}
                    <div className="text-right shrink-0 flex flex-col items-end justify-between">
                      <span className="font-mono text-xs sm:text-sm font-bold text-neutral-950">
                        {item.price}
                      </span>
                      <span className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1 transition-opacity ${
                        isSelected ? 'opacity-100 text-neutral-950 font-bold' : 'opacity-0'
                      }`}>
                        <span>{isEn ? 'OPEN' : 'AÇ'}</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Guide Bar */}
          <div className="border-t-2 border-neutral-950 bg-neutral-100 px-4 py-2.5 flex items-center justify-between text-[11px] font-mono text-neutral-600">
            <div className="hidden sm:flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="border border-neutral-400 bg-white px-1.5 py-0.5 text-[9px]">↑</kbd>
                <kbd className="border border-neutral-400 bg-white px-1.5 py-0.5 text-[9px]">↓</kbd>
                <span>{isEn ? 'Navigate' : 'Gezin'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="border border-neutral-400 bg-white px-1.5 py-0.5 text-[9px]">↵</kbd>
                <span>{isEn ? 'Select' : 'Seç'}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-neutral-400">nonvalue // quick telemetry search</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
