'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '@/lib/sound-fx';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/lib/get-dictionary';

interface SpatialLayoutShellProps {
  children: React.ReactNode;
  lang: Locale;
  dict?: Dictionary;
}

type Direction = 'left' | 'right' | 'up' | 'down' | 'none';

/**
 * Awwwards Standartlarında Spatial Layout Shell
 * 
 * 1. SIFIR SAĞ MENÜ: Ekran %100 genişliğinde, sağ kenar boşlukları ve dikey sidebar tamamen yok.
 * 2. KUSURSUZ AÇILIŞ FRAGMANI (SPLASH):
 *    - sessionStorage KESİNLİKLE YOK. Her sayfa girişinde/yenilemede çalışır.
 *    - Logo başlangıçta ekranın tam ortasında devasa başlar (scale: 2.5, y: '40vh').
 *    - 1.5 saniye sonra ekranın en üstüne (top-4) süzülüp küçülür (scale: 1, y: 0).
 *    - "MANIFESTO // ABOUT" yazısı başlangıçta tamamen görünmezdir (opacity-0).
 *      Yalnızca logo yerine oturduktan sonra (2.7s delay ile) yavaşça görünür (opacity-100).
 * 3. YÖNLÜ LUMA INVERT GEÇİŞLERİ:
 *    - WORKSHOP (Sol): Sola kayar + Beyaz patlama (Flash Luma Invert)
 *    - SHOP (Sağ): Sağa kayar + Beyaz patlama
 *    - ARCHIVE (Alt): Aşağı kayar + Beyaz patlama
 *    - LOGO / ABOUT (Üst): Yukarı kayar + Beyaz patlama
 */
export default function SpatialLayoutShell({
  children,
  lang = 'tr',
}: SpatialLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState<Direction>('none');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isWorkshopActive = pathname.includes('/atolye');
  const isShopActive = pathname.includes('/shop');
  const isArchiveActive = pathname.includes('/arsiv');
  const isAboutActive = pathname.includes('/hakkinda') || pathname.includes('/about');

  const handleNavigate = (e: React.MouseEvent, href: string, dir: Direction) => {
    if (pathname === href) return;
    e.preventDefault();
    soundFx.playClick();
    setDirection(dir);
    router.push(href);
  };

  // Yönlü Sayfa Geçiş Varyantları
  const pageVariants = {
    initial: (dir: Direction) => {
      switch (dir) {
        case 'left':
          return { x: '25vw', opacity: 0, filter: 'brightness(2)' };
        case 'right':
          return { x: '-25vw', opacity: 0, filter: 'brightness(2)' };
        case 'down':
          return { y: '-25vh', opacity: 0, filter: 'brightness(2)' };
        case 'up':
          return { y: '25vh', opacity: 0, filter: 'brightness(2)' };
        default:
          return { opacity: 0, filter: 'brightness(1.5)' };
      }
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      filter: 'brightness(1)',
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: Direction) => {
      switch (dir) {
        case 'left':
          return {
            x: '-30vw',
            opacity: 0,
            filter: 'brightness(3)',
            transition: { duration: 0.32, ease: [0.7, 0, 0.84, 0] as const },
          };
        case 'right':
          return {
            x: '30vw',
            opacity: 0,
            filter: 'brightness(3)',
            transition: { duration: 0.32, ease: [0.7, 0, 0.84, 0] as const },
          };
        case 'down':
          return {
            y: '30vh',
            opacity: 0,
            filter: 'brightness(3)',
            transition: { duration: 0.32, ease: [0.7, 0, 0.84, 0] as const },
          };
        case 'up':
          return {
            y: '-30vh',
            opacity: 0,
            filter: 'brightness(3)',
            transition: { duration: 0.32, ease: [0.7, 0, 0.84, 0] as const },
          };
        default:
          return {
            opacity: 0,
            filter: 'brightness(2)',
            transition: { duration: 0.28 },
          };
      }
    },
  };

  const startY = isMobile ? '38vh' : '40vh';

  return (
    <div className="relative min-h-screen w-full bg-black text-neutral-200 overflow-x-hidden selection:bg-white selection:text-black">
      {/* 
        AÇILIŞ FRAGMANI PERDESİ:
        Site her açıldığında 1.5s tam siyah kalır, ardından eriyerek açılır.
      */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.5, duration: 1.0, ease: [0.45, 0, 0.15, 1] as const }}
        className="fixed inset-0 bg-black z-[90] pointer-events-none"
      />

      {/* ========================================================================= */}
      {/* 4-POINT SPATIAL NAVIGATION                                                */}
      {/* ========================================================================= */}

      {/* TOP (Üst Orta): Marka Logosu (Merkezden Başlar -> 1.5s Sonra Üste Süzülür) */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto select-none bg-transparent">
        <motion.div
          initial={{ y: startY, scale: 2.5 }}
          animate={{ y: '0vh', scale: 1 }}
          transition={{
            delay: 1.5,
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="origin-center flex flex-col items-center justify-center"
        >
          <Link
            href={`/${lang}/hakkinda`}
            onClick={(e) => handleNavigate(e, `/${lang}/hakkinda`, 'up')}
            onMouseEnter={() => soundFx.playHover()}
            className="group flex flex-col items-center tracking-widest transition-opacity duration-300 hover:opacity-100 p-2"
            title="nonvalue — Hakkında & Manifesto"
          >
            <div className="relative w-14 h-14 flex items-center justify-center mix-blend-screen">
              <Image
                src="/nvdarklogo.jpg"
                alt="nonvalue"
                width={56}
                height={56}
                priority
                className="w-14 h-14 object-contain mix-blend-screen filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all"
              />
            </div>

            {/* 
              KURAL 2: MANIFESTO // ABOUT YAZISI
              Başlangıçta TAMAMEN GÖRÜNMEZ (opacity-0).
              Yalnızca logo yerine oturduktan sonra (2.7s delay) yavaşça görünür (opacity-100).
            */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7, duration: 0.8, ease: 'easeOut' }}
              className={`font-mono text-[7px] sm:text-[8px] tracking-[0.45em] uppercase mt-1 transition-colors ${
                isAboutActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-500 group-hover:text-neutral-300'
              }`}
            >
              MANIFESTO // ABOUT
            </motion.span>
          </Link>
        </motion.div>
      </header>

      {/* LEFT (Sol Orta): WORKSHOP -> '/[lang]/atolye' (Kayma Yönü: SOL) */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.8, ease: 'easeOut' }}
        aria-label="Workshop Navigation"
        className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto select-none bg-transparent"
      >
        <Link
          href={`/${lang}/atolye`}
          onClick={(e) => handleNavigate(e, `/${lang}/atolye`, 'left')}
          onMouseEnter={() => soundFx.playHover()}
          className={`group flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.34em] uppercase transition-all duration-300 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap py-4 px-1.5 ${
            isWorkshopActive
              ? 'text-white font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              isWorkshopActive
                ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                : 'bg-neutral-600 group-hover:bg-amber-400/90'
            }`}
          />
          <span>WORKSHOP</span>
        </Link>
      </motion.aside>

      {/* RIGHT (Sağ Orta): SHOP -> '/[lang]/shop' (Kayma Yönü: SAĞ) */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.8, ease: 'easeOut' }}
        aria-label="Shop Navigation"
        className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto select-none bg-transparent"
      >
        <Link
          href={`/${lang}/shop`}
          onClick={(e) => handleNavigate(e, `/${lang}/shop`, 'right')}
          onMouseEnter={() => soundFx.playHover()}
          className={`group flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.34em] uppercase transition-all duration-300 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap py-4 px-1.5 ${
            isShopActive
              ? 'text-white font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              isShopActive
                ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                : 'bg-neutral-600 group-hover:bg-amber-400/90'
            }`}
          />
          <span>SHOP</span>
        </Link>
      </motion.aside>

      {/* BOTTOM (Alt Orta): ARCHIVE -> '/[lang]/arsiv' (Kayma Yönü: AŞAĞI) */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.8, ease: 'easeOut' }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none bg-transparent"
      >
        <Link
          href={`/${lang}/arsiv`}
          onClick={(e) => handleNavigate(e, `/${lang}/arsiv`, 'down')}
          onMouseEnter={() => soundFx.playHover()}
          className={`group flex flex-col items-center gap-1.5 text-[9px] sm:text-[10px] font-mono tracking-[0.34em] uppercase transition-all duration-300 py-1.5 px-4 ${
            isArchiveActive
              ? 'text-white font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              isArchiveActive
                ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                : 'bg-neutral-600 group-hover:bg-amber-400/90'
            }`}
          />
          <span>ARCHIVE</span>
        </Link>
      </motion.footer>

      {/* ========================================================================= */}
      {/* YÖNLÜ LUMA INVERT SAYFA GEÇİŞİ                                            */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen relative"
        >
          {/* Luma Invert / Flash Overlay */}
          <motion.div
            key={`flash-${pathname}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] as const }}
            className="pointer-events-none fixed inset-0 z-40 bg-white"
          />

          <main className="w-full min-h-screen">{children}</main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
