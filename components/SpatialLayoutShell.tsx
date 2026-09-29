'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '@/lib/sound-fx';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/lib/get-dictionary';

interface SpatialLayoutShellProps {
  children: React.ReactNode;
  lang: Locale;
  dict?: Dictionary;
}

/**
 * 4-Point Spatial Navigation & Flash/Luma Invert Page Transition
 * Awwwards standard clean architecture:
 * - 4 pinned corner/edge coordinates: TOP, LEFT, RIGHT, BOTTOM
 * - Background is completely transparent (bg-transparent, zero pill, pure negative space)
 * - AnimatePresence mode="wait" with high-contrast Fade-to-White / Luma Flash transition
 */
export default function SpatialLayoutShell({
  children,
  lang = 'tr',
}: SpatialLayoutShellProps) {
  const pathname = usePathname();

  // Active route checks
  const isWorkshopActive = pathname.includes('/atolye');
  const isShopActive = pathname.includes('/shop');
  const isArchiveActive = pathname.includes('/arsiv');

  return (
    <div className="relative min-h-screen w-full bg-black text-neutral-200 overflow-x-hidden selection:bg-white selection:text-black">
      {/* ========================================================================= */}
      {/* 4-POINT SPATIAL NAVIGATION (Fixed, z-50, Transparent, Architectural)      */}
      {/* ========================================================================= */}

      {/* 1. TOP (Üst Orta): Marka Logosu (Link -> '/') */}
      <header className="fixed top-4 sm:top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
        <Link
          href="/"
          onClick={() => soundFx.playClick()}
          onMouseEnter={() => soundFx.playHover()}
          className="group flex flex-col items-center tracking-widest transition-opacity duration-300 hover:opacity-100"
          title="nonvalue — Home"
        >
          <span className="font-serif text-xs sm:text-sm tracking-[0.35em] uppercase text-neutral-100 group-hover:text-white font-medium">
            NONVALUE
          </span>
          <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.45em] text-neutral-500 uppercase mt-0.5 group-hover:text-amber-400/90 transition-colors">
            STUDIO & ARCHIVE
          </span>
        </Link>
      </header>

      {/* 2. LEFT (Sol Orta, dikey yazılı): WORKSHOP (Link -> '/[lang]/atolye') */}
      <aside
        aria-label="Workshop Navigation"
        className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto select-none"
      >
        <Link
          href={`/${lang}/atolye`}
          onClick={() => soundFx.playClick()}
          onMouseEnter={() => soundFx.playHover()}
          className={`group flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.32em] uppercase transition-all duration-300 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap py-3 px-1 ${
            isWorkshopActive
              ? 'text-white font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              isWorkshopActive
                ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'bg-neutral-600 group-hover:bg-amber-400/90'
            }`}
          />
          <span>WORKSHOP</span>
        </Link>
      </aside>

      {/* 3. RIGHT (Sağ Orta, dikey yazılı): SHOP (Link -> '/[lang]/shop') */}
      <aside
        aria-label="Shop Navigation"
        className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto select-none"
      >
        <Link
          href={`/${lang}/shop`}
          onClick={() => soundFx.playClick()}
          onMouseEnter={() => soundFx.playHover()}
          className={`group flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.32em] uppercase transition-all duration-300 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap py-3 px-1 ${
            isShopActive
              ? 'text-white font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              isShopActive
                ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'bg-neutral-600 group-hover:bg-amber-400/90'
            }`}
          />
          <span>SHOP</span>
        </Link>
      </aside>

      {/* 4. BOTTOM (Alt Orta): ARCHIVE (Link -> '/[lang]/arsiv') */}
      <footer className="fixed bottom-4 sm:bottom-7 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
        <Link
          href={`/${lang}/arsiv`}
          onClick={() => soundFx.playClick()}
          onMouseEnter={() => soundFx.playHover()}
          className={`group flex flex-col items-center gap-1.5 text-[9px] sm:text-[10px] font-mono tracking-[0.32em] uppercase transition-all duration-300 py-1.5 px-3 ${
            isArchiveActive
              ? 'text-white font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              isArchiveActive
                ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'bg-neutral-600 group-hover:bg-amber-400/90'
            }`}
          />
          <span>ARCHIVE</span>
        </Link>
      </footer>

      {/* ========================================================================= */}
      {/* PAGE TRANSITION FOUNDATION (Fade to White / Flash Luma Invert)            */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full min-h-screen relative"
        >
          {/* Flash / Luma Invert Effect:
              Sayfa değişiminde kısaca beyaz renkte (bg-white) parlayıp siyaha döner */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.32, ease: [0.19, 1, 0.22, 1] }}
            className="pointer-events-none fixed inset-0 z-40 bg-white"
          />

          <main className="w-full min-h-screen">{children}</main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
