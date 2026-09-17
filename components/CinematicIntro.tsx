'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicIntro() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Sayfa açıldığında daha önce izlenip izlenmediğini kontrol et
    const hasSeen = typeof window !== 'undefined' ? sessionStorage.getItem('nonvalue_intro_played') : 'true';
    if (!hasSeen) {
      const showTimer = setTimeout(() => {
        setShouldRender(true);
      }, 20);

      // 0.8 saniye sonra yukarı kayma ve küçülme animasyonunu başlat
      const timer = setTimeout(() => {
        setIsAnimatingOut(true);
      }, 750);

      // 2.0 saniye sonra perdeyi ve bileşeni tamamen DOM'dan kaldır
      const removeTimer = setTimeout(() => {
        sessionStorage.setItem('nonvalue_intro_played', 'true');
        setShouldRender(false);
      }, 2100);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem('nonvalue_intro_played', 'true');
    setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="cinematic-intro-overlay"
        onClick={handleSkip}
        initial={{ opacity: 1 }}
        animate={{ opacity: isAnimatingOut ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] bg-[#07080a] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      >
        {/* Arka Plan Sanatsal Işık ve Dokusu */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.95)_75%)] pointer-events-none" />

        {/* Sinematik Sürtünme Efektli Logo Kapsayıcısı */}
        <motion.div
          initial={{ scale: 1.6, y: 0, opacity: 0 }}
          animate={
            isAnimatingOut
              ? {
                  scale: 0.38,
                  y: '-42vh',
                  opacity: 0.85,
                }
              : {
                  scale: 1.6,
                  y: 0,
                  opacity: 1,
                }
          }
          transition={{
            duration: 1.25,
            ease: [0.16, 1, 0.3, 1], // Akıcı sürtünme (friction deceleration)
          }}
          className="relative z-10 flex flex-col items-center pointer-events-none"
        >
          {/* Ham Döküm Gümüş Yüzük ve nonvalue Markası */}
          <div className="relative w-64 h-36 sm:w-80 sm:h-44 flex items-center justify-center">
            <Image
              src="/nonvalue-logo.png"
              alt="nonvalue emblem"
              fill
              priority
              className="object-contain filter drop-shadow-[0_4px_24px_rgba(255,255,255,0.25)] brightness-110"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isAnimatingOut ? 0 : 0.7, y: isAnimatingOut ? -10 : 0 }}
            transition={{ duration: 0.4 }}
            className="mt-4 flex flex-col items-center text-center"
          >
            <span className="font-mono text-[9px] tracking-[0.35em] text-neutral-400 uppercase">
              DERİN BUSE DEMİRKAYA
            </span>
            <span className="font-mono text-[8px] tracking-[0.25em] text-amber-300/80 uppercase mt-0.5">
              HAM GÜMÜŞ HEYKEL & MÜCEVHER ARŞİVİ
            </span>
          </motion.div>
        </motion.div>

        {/* Atla İpucu */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neutral-500 font-mono text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
          [ Geçmek İçin Dokunun ]
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
