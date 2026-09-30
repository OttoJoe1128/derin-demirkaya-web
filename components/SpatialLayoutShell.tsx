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
          {/* 1. MÜHÜR LOGO: Ana Sayfaya (/[lang]) Gider */}
          <Link
            href={`/${lang}`}
            onClick={(e) => handleNavigate(e, `/${lang}`, 'none')}
            onMouseEnter={() => soundFx.playHover()}
            className="group flex items-center justify-center tracking-widest transition-opacity duration-300 hover:opacity-100 p-1"
            title="nonvalue — Home"
          >
            <div
              style={{
                WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 65%)',
                maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 65%)',
              }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden mix-blend-lighten contrast-[1.1]"
            >
              <Image
                src="/websites.jpg"
                alt="nonvalue"
                width={80}
                height={80}
                quality={100}
                unoptimized={true}
                priority
                className="w-full h-full object-cover object-center"
              />
            </div>
          </Link>

          {/* 2. MANİFESTO BUTONU (nvlogotext.png) & EN ALTTA YEŞİL NOKTA: Hakkında Rotasına (/[lang]/hakkinda) Gider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7, duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <Link
              href={`/${lang}/hakkinda`}
              onClick={(e) => handleNavigate(e, `/${lang}/hakkinda`, 'up')}
              onMouseEnter={() => soundFx.playHover()}
              className="group flex flex-col items-center cursor-pointer"
              title="nonvalue — Manifesto & About"
            >
              <Image
                src="/nvlogotext.png"
                alt="Manifesto"
                width={120}
                height={30}
                className="object-contain opacity-70 hover:opacity-100 transition-opacity my-2"
                unoptimized={true}
              />
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#00FF66] shrink-0 transition-transform duration-300 group-hover:scale-110" />
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* LANGUAGE TOGGLE (EN / TR) - mix-blend-difference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.8, ease: 'easeOut' }}
        className="fixed top-4 sm:top-6 right-4 sm:right-8 z-50 pointer-events-auto select-none bg-transparent mix-blend-difference"
      >
        <Link
          href={pathname.replace(`/${lang}`, `/${lang === 'tr' ? 'en' : 'tr'}`) || `/${lang === 'tr' ? 'en' : 'tr'}`}
          onClick={() => soundFx.playClick()}
          className="mix-blend-difference text-white font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase hover:opacity-75 transition-opacity py-1 px-1.5 font-medium"
          title={lang === 'tr' ? 'Switch to English' : 'Türkçe Dil Seçeneği'}
        >
          {lang === 'tr' ? 'EN' : 'TR'}
        </Link>
      </motion.div>

      {/* LEFT (Sol Orta): WORKSHOP -> '/[lang]/atolye' (Kayma Yönü: SOL) */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.8, ease: 'easeOut' }}
        aria-label="Workshop Navigation"
        className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto select-none bg-transparent mix-blend-difference"
      >
        <Link
          href={`/${lang}/atolye`}
          onClick={(e) => handleNavigate(e, `/${lang}/atolye`, 'left')}
          onMouseEnter={() => soundFx.playHover()}
          className="group flex flex-row items-center gap-2 sm:gap-2.5 text-[9px] sm:text-[10px] font-mono tracking-[0.34em] uppercase transition-all duration-300 whitespace-nowrap py-4 px-1.5 mix-blend-difference text-white"
        >
          <span className="[writing-mode:vertical-rl]">WORKSHOP</span>
          <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#00FF66] shrink-0 transition-transform duration-300 group-hover:scale-110" />
        </Link>
      </motion.aside>

      {/* RIGHT (Sağ Orta): SHOP -> '/[lang]/shop' (Kayma Yönü: SAĞ) */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.8, ease: 'easeOut' }}
        aria-label="Shop Navigation"
        className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto select-none bg-transparent mix-blend-difference"
      >
        <Link
          href={`/${lang}/shop`}
          onClick={(e) => handleNavigate(e, `/${lang}/shop`, 'right')}
          onMouseEnter={() => soundFx.playHover()}
          className="group flex flex-row items-center gap-2 sm:gap-2.5 text-[9px] sm:text-[10px] font-mono tracking-[0.34em] uppercase transition-all duration-300 whitespace-nowrap py-4 px-1.5 mix-blend-difference text-white"
        >
          <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#00FF66] shrink-0 transition-transform duration-300 group-hover:scale-110" />
          <span className="[writing-mode:vertical-rl] rotate-180">SHOP</span>
        </Link>
      </motion.aside>

      {/* BOTTOM (Alt Orta): ARCHIVE -> '/[lang]/arsiv' (Kayma Yönü: AŞAĞI) */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.8, ease: 'easeOut' }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none bg-transparent mix-blend-difference"
      >
        <Link
          href={`/${lang}/arsiv`}
          onClick={(e) => handleNavigate(e, `/${lang}/arsiv`, 'down')}
          onMouseEnter={() => soundFx.playHover()}
          className="group flex flex-col items-center gap-2 sm:gap-2.5 text-[9px] sm:text-[10px] font-mono tracking-[0.34em] uppercase transition-all duration-300 py-1.5 px-4 mix-blend-difference text-white"
        >
          <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#00FF66] shrink-0 transition-transform duration-300 group-hover:scale-110" />
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
