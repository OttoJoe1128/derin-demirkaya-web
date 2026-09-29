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
 * Awwwards "Site of the Day" Spatial Layout Shell
 * 
 * 1. ZERO SIDEBAR: Eski dikey sağ menü ve sağ boşluklar tamamen imha edildi.
 * 2. SPLASH INTRO: İlk açılışta kapkaranlık ekranda devasa NONVALUE logosu merkezde belirir,
 *    1.5s sonra küçülerek süzülür ve en tepeye (TOP - top-4) yerleşip navigasyonun parçası olur.
 * 3. YÖNLÜ LUMA INVERT GEÇİŞLERİ:
 *    - WORKSHOP (Sol) -> Sola kayar + Beyaz patlama (Luma Invert)
 *    - SHOP (Sağ) -> Sağa kayar + Beyaz patlama
 *    - ARCHIVE (Alt) -> Aşağı kayar + Beyaz patlama
 *    - LOGO/ABOUT (Üst) -> Yukarı kayar + Beyaz patlama
 * 4. 4-POINT SPATIAL: Ekranın 4 kenarına çivilenmiş, tamamen şeffaf, heykelsi tipografi.
 */
export default function SpatialLayoutShell({
  children,
  lang = 'tr',
}: SpatialLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Splash Screen Durumu
  const [hasPlayedSplash, setHasPlayedSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem('nv_splash_played');
  });
  const [splashFinished, setSplashFinished] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem('nv_splash_played');
  });
  const [isMobile, setIsMobile] = useState(false);

  // Yönlü geçiş takibi ('left' | 'right' | 'up' | 'down')
  const [direction, setDirection] = useState<Direction>('none');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem('nv_splash_played');
    if (!seen) {
      sessionStorage.setItem('nv_splash_played', '1');
      const timer = setTimeout(() => {
        setHasPlayedSplash(true);
      }, 1500);
      const finishTimer = setTimeout(() => {
        setSplashFinished(true);
      }, 2700);
      return () => {
        clearTimeout(timer);
        clearTimeout(finishTimer);
      };
    }
  }, []);

  // Aktif Rotalar
  const isWorkshopActive = pathname.includes('/atolye');
  const isShopActive = pathname.includes('/shop');
  const isArchiveActive = pathname.includes('/arsiv');
  const isAboutActive = pathname.includes('/hakkinda') || pathname.includes('/about');

  // Yönlü Navigasyon İşleyicisi
  const handleNavigate = (e: React.MouseEvent, href: string, dir: Direction) => {
    if (pathname === href) return;
    e.preventDefault();
    soundFx.playClick();
    setDirection(dir);
    router.push(href);
  };

  // Yönlü Framer Motion Varyantları (Directional Motion + Luma Invert)
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
  const startScale = isMobile ? 1.7 : 2.5;

  return (
    <div className="relative min-h-screen w-full bg-black text-neutral-200 overflow-x-hidden selection:bg-white selection:text-black">
      {/* ========================================================================= */}
      {/* 1. KURAL 2: AÇILIŞ FRAGMANI (SPLASH INTRO VE MERKEZDEN TEPENİN YUVASINA SÜZÜLME) */}
      {/* ========================================================================= */}
      {!splashFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: hasPlayedSplash ? 0 : 1 }}
          transition={{ duration: 1.1, ease: [0.45, 0, 0.15, 1] as const }}
          className="fixed inset-0 bg-black z-[90] pointer-events-none"
        />
      )}

      {/* ========================================================================= */}
      {/* 2. KURAL 3: 4-POINT SPATIAL NAVIGATION (FIXED, Z-50, ŞEFFAF ARKA PLAN)     */}
      {/* ========================================================================= */}

      {/* TOP (Üst Orta): Marka Logosu -> Hakkında / Künye / Manifesto ('/[lang]/hakkinda') */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto select-none bg-transparent">
        <motion.div
          initial={
            !splashFinished && !hasPlayedSplash
              ? { y: startY, scale: startScale }
              : { y: '0vh', scale: 1 }
          }
          animate={{
            y: '0vh',
            scale: 1,
          }}
          transition={{
            delay: !hasPlayedSplash ? 1.5 : 0,
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
            <div className="relative flex items-center justify-center">
              <Image
                src="/nonvalue-wordmark-white.svg"
                alt="nonvalue"
                width={160}
                height={32}
                priority
                className="h-5 sm:h-6 md:h-7 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all"
              />
            </div>
            <span
              className={`font-mono text-[7px] sm:text-[8px] tracking-[0.45em] uppercase mt-1 transition-colors ${
                isAboutActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-500 group-hover:text-neutral-300'
              }`}
            >
              MANIFESTO // ABOUT
            </span>
          </Link>
        </motion.div>
      </header>

      {/* LEFT (Sol Orta, Dikey): WORKSHOP -> '/[lang]/atolye' (Kayma Yönü: SOL) */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: hasPlayedSplash ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
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

      {/* RIGHT (Sağ Orta, Dikey): SHOP -> '/[lang]/shop' (Kayma Yönü: SAĞ) */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: hasPlayedSplash ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
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

      {/* BOTTOM (Alt Orta, Yatay): ARCHIVE -> '/[lang]/arsiv' (Kayma Yönü: AŞAĞI) */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: hasPlayedSplash ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
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
      {/* 3. KURAL 3: YÖNLÜ LUMA INVERT SAYFA GEÇİŞİ (DIRECTIONAL FLASH TRANSITION) */}
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
          {/* Luma Invert / Flash Overlay: Her geçişte bembeyaz parlayıp (bg-white) siyaha döner */}
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
