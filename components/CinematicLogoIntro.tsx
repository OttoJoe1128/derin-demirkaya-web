'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { soundFx } from '@/lib/sound-fx';

/**
 * 1. Siyah Ekranda Kaybolan Logo (Z-Index Hatası):
 *    - Perde: z-[100] (fixed inset-0 bg-black)
 *    - Logo: KESİNLİKLE z-[101]
 * 2. Responsive Sinematik Açılış:
 *    - Mobilde ekran genişliğini aşmayacak şekilde optimize edilmiş dinamik scale (1.6x)
 *    - Masaüstünde görkemli ve lüks sinematik ölçek (2.8x)
 *    - Hiçbir cihazda ekran dışına taşma yaşanmaz (max-w-[85vw] güvencesi)
 */
export default function CinematicLogoIntro() {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/tr' || pathname === '/en';
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobil ekran kontrolü (ekran taşmasını engellemek için)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mevcut dile göre ana sayfa rotasını belirle (/tr veya /en)
  const currentLang = pathname?.startsWith('/en') ? 'en' : 'tr';
  const homeHref = `/${currentLang}`;

  const startScale = isMobile ? 1.6 : 2.8;
  const finalScale = isMobile ? 1.05 : 1.25;
  const startY = isMobile ? '36vh' : '38vh';

  return (
    <>
      {/* 
        KURAL 1: 9 Saniyelik Sinematik Siyah Perde (z-[100])
        Sadece ana sayfada gösterilir.
        - İlk 3 saniye tamamen hareketsiz & simsiyah (delay: 3)
        - Sonraki 6 saniyede erir (duration: 6, ease: [0.45, 0, 0.15, 1])
        - Tamamlanınca pointer-events-none ve gizlenir
      */}
      {isHomePage && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{
            delay: 3,
            duration: 6,
            ease: [0.45, 0, 0.15, 1],
          }}
          style={{ willChange: 'opacity' }}
          onAnimationComplete={() => setIsAnimationFinished(true)}
          className={`fixed inset-0 bg-black z-[100] ${
            isAnimationFinished ? 'pointer-events-none hidden' : 'pointer-events-auto'
          }`}
        />
      )}

      {/* 
        KURAL 1 & 2 & 3: Ekranın Üst-Ortasındaki Bağımsız nonvalue Logosu (z-[101])
        - Kesinlikle perdenin önündedir (z-[101])
        - Mobilde ekran genişliğini aşmayacak şekilde güvenli max-w-[85vw]
        - Açılışta 3 saniye ekran merkezinde beyaz olarak parlar
        - 6 saniyede üst-ortadaki yuvasına süzülür
      */}
      <div
        id="cinematic-logo-anchor"
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[101] flex items-center justify-center pointer-events-auto select-none max-w-[90vw]"
      >
        <motion.div
          initial={isHomePage ? { y: startY, scale: startScale } : { y: '0vh', scale: finalScale }}
          animate={{ y: '0vh', scale: finalScale }}
          transition={
            isHomePage
              ? {
                  delay: 3,
                  duration: 6,
                  ease: [0.45, 0, 0.15, 1],
                }
              : { duration: 0.3 }
          }
          style={{ willChange: 'transform' }}
          className="origin-center relative flex items-center justify-center max-w-[85vw]"
        >
          <Link
            href={homeHref}
            onClick={() => soundFx.playClick()}
            className="relative flex items-center justify-center group focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50"
            title={currentLang === 'en' ? 'nonvalue — Home' : 'nonvalue — Ana Sayfa'}
          >
            <div className="relative flex items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 max-w-[85vw]">
              {/* Garanti Bembeyaz Tipografik Karşılık (Görsel gecikse veya hata verse dahi siyah ekranda asla kaybolmaz) */}
              <span
                className={`font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.25em] text-white lowercase select-none drop-shadow-[0_2px_16px_rgba(255,255,255,0.7)] ${
                  !imgError ? 'sr-only' : 'block'
                }`}
              >
                nonvalue
              </span>

              {/* Vektörel / Görsel Beyaz Logo */}
              {!imgError && (
                <Image
                  src="/nonvalue-wordmark-white.svg"
                  alt="nonvalue"
                  width={240}
                  height={48}
                  priority
                  onError={() => setImgError(true)}
                  className="h-7 sm:h-8 md:h-10 w-auto max-w-[75vw] sm:max-w-none object-contain filter drop-shadow-[0_2px_20px_rgba(255,255,255,0.6)] group-hover:opacity-85 transition-opacity"
                />
              )}
            </div>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
