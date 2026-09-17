'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { soundFx } from '@/lib/sound-fx';

/**
 * 1. Siyah Ekranda Kaybolan Logo (Z-Index Hatası):
 *    - Perde: z-[100] (fixed inset-0 bg-black)
 *    - Logo: KESİNLİKLE z-[101]
 *    - Logo hem /nonvalue-wordmark-white.svg hem bembeyaz metin fallback ile %100 görünür.
 * 2. Eski Yatay Üst Barı (Header) Tamamen Yok Et:
 *    - Eski arama, dil, ses, linkler vb. içeren yatay bar tamamen kaldırılmıştır.
 *    - Üst-orta alanda YALNIZCA "nonvalue" logosu tek başına yer alır.
 * 3. Logonun Final Boyutunu Büyüt (Daha Görkemli Yerleşim):
 *    - Animasyon sonunda scale: 1 yerine scale: 1.35 (ihtişamlı, net ve okunaklı).
 */
export default function CinematicLogoIntro() {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/tr' || pathname === '/en';
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Mevcut dile göre ana sayfa rotasını belirle (/tr veya /en)
  const currentLang = pathname?.startsWith('/en') ? 'en' : 'tr';
  const homeHref = `/${currentLang}`;

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
        - Eski yatay menü çöpe atılmış, sadece bu logo tek başına kalmıştır
        - Açılışta 3 saniye ekran merkezinde (y: 38vh, scale: 3.6) beyaz olarak parlar
        - 6 saniyede üst-ortadaki yuvasına süzülür (y: 0vh, scale: 1.35)
      */}
      <div
        id="cinematic-logo-anchor"
        className="fixed top-5 sm:top-7 left-1/2 -translate-x-1/2 z-[101] flex items-center justify-center pointer-events-auto select-none"
      >
        <motion.div
          initial={isHomePage ? { y: '38vh', scale: 3.6 } : { y: '0vh', scale: 1.35 }}
          animate={{ y: '0vh', scale: 1.35 }}
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
          className="origin-center relative flex items-center justify-center"
        >
          <Link
            href={homeHref}
            onClick={() => soundFx.playClick()}
            className="relative flex items-center justify-center group focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50"
            title={currentLang === 'en' ? "nonvalue — Home" : "nonvalue — Ana Sayfa"}
          >
            <div className="relative flex items-center justify-center px-4 py-2">
              {/* Garanti Bembeyaz Tipografik Karşılık (Görsel gecikse veya hata verse dahi siyah ekranda asla kaybolmaz) */}
              <span
                className={`font-serif text-2xl sm:text-3xl tracking-[0.25em] text-white lowercase select-none drop-shadow-[0_2px_16px_rgba(255,255,255,0.7)] ${
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
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain filter drop-shadow-[0_2px_20px_rgba(255,255,255,0.6)] group-hover:opacity-85 transition-opacity"
                />
              )}
            </div>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
