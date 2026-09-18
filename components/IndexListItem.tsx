'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { soundFx } from '@/lib/sound-fx';
import type { ArtworkDetail } from '@/lib/artworks-data';

interface IndexListItemProps {
  artwork: ArtworkDetail;
  index: number;
  isActive: boolean;
  onHover: (artwork: ArtworkDetail) => void;
  lang: string;
}

export default function IndexListItem({
  artwork,
  index,
  isActive,
  onHover,
  lang,
}: IndexListItemProps) {
  // İki haneli sıra numarası ('01', '02', ...)
  const formattedIndex = String(index + 1).padStart(2, '0');
  const langPrefix = lang === 'en' ? '/en' : '/tr';
  const categoryText = lang === 'en' ? (artwork.categoryEn || artwork.category) : artwork.category;

  return (
    <Link
      href={`${langPrefix}/koleksiyon/${artwork.id}`}
      onMouseEnter={() => {
        onHover(artwork);
        soundFx.playHover();
      }}
      onClick={() => soundFx.playClick()}
      className="group relative block w-full py-4 sm:py-5 lg:py-6 border-b border-neutral-800/60 transition-colors duration-300 select-none cursor-pointer"
    >
      {/* Hafif satır arka plan parlaması (hover durumunda) */}
      <div
        className={`absolute inset-0 -mx-3 px-3 transition-opacity duration-300 pointer-events-none rounded-xs ${
          isActive ? 'bg-neutral-900/40 opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />

      <div className="relative z-10 flex items-center justify-between gap-4 sm:gap-6">
        {/* Sol Blok: İki haneli sıra no ve Eser Adı */}
        <div className="flex items-baseline gap-4 sm:gap-8 lg:gap-12 min-w-0">
          {/* 01, 02 gibi iki haneli sıra no */}
          <span
            className={`font-mono text-xs sm:text-sm tracking-widest transition-colors duration-300 shrink-0 ${
              isActive
                ? 'text-amber-400 font-bold'
                : 'text-neutral-500 group-hover:text-amber-400/90'
            }`}
          >
            {formattedIndex}
          </span>

          {/* Eser Adı (Görsel referansındaki gibi serbest, minimalist, yüksek kaliteli tipografi) */}
          <h2
            className={`font-serif text-lg sm:text-2xl md:text-3xl tracking-tight transition-all duration-300 truncate uppercase ${
              isActive
                ? 'text-white translate-x-1.5 sm:translate-x-2'
                : 'text-neutral-300 group-hover:text-white group-hover:translate-x-1 sm:group-hover:translate-x-2'
            }`}
          >
            {artwork.title}
          </h2>
        </div>

        {/* Sağ Blok: Sağa yaslanmış kategori (İtalik serif/zarif sans stilinde) */}
        <div className="shrink-0 flex items-center gap-3 text-right">
          <span
            className={`font-serif italic text-xs sm:text-sm md:text-base transition-colors duration-300 ${
              isActive
                ? 'text-neutral-200'
                : 'text-neutral-500 group-hover:text-neutral-300'
            }`}
          >
            {categoryText}
          </span>

          {/* Aktif / Hover Ok İşareti */}
          <motion.span
            animate={{
              opacity: isActive ? 1 : 0,
              x: isActive ? 0 : -6,
            }}
            transition={{ duration: 0.2 }}
            className="text-amber-400 font-mono text-xs hidden sm:inline-block"
          >
            →
          </motion.span>
        </div>
      </div>
    </Link>
  );
}
