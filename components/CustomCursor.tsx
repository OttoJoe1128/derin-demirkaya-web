'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Dokunmatik ve mobil cihaz kontrolü (Sadece masaüstü / hassas imleçlerde çalışır)
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      if (cursorRef.current) {
        cursorRef.current.style.display = 'none';
      }
      return;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let isOverInput = false;
    let isInteracting = false;
    let isPressed = false;
    let isVisible = false;
    let lastX = -100;
    let lastY = -100;

    // Etkileşim ve tıklama durumuna göre ölçekleme (Transition yalnızca scale üzerindedir)
    const updateScale = () => {
      if (isPressed) {
        dot.style.transform = isInteracting ? 'scale(1.8)' : 'scale(0.8)';
      } else if (isInteracting) {
        dot.style.transform = 'scale(2.4)';
      } else {
        dot.style.transform = 'scale(1)';
      }
    };

    // Form alanı kontrolü (Metin girişinde doğal işletim sistemi metin imleci serbest bırakılır)
    const checkIsInput = (element: HTMLElement | null): boolean => {
      if (!element) return false;
      return !!element.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"], [contenteditable=""]'
      );
    };

    // Tıklanabilir / interaktif eleman tespiti (Linkler, butonlar, tıklanabilir kartlar)
    const checkIsInteractive = (element: HTMLElement | null): boolean => {
      if (!element) return false;
      return !!element.closest(
        'a, button, [role="button"], .cursor-pointer, summary, input[type="button"], input[type="submit"], [data-cursor-interactive], .cursor-zoom-in, .cursor-zoom-out'
      );
    };

    // Yüksek Frame Hızı (High Refresh Rate / 0ms Latency):
    // Donanım frekansında (60Hz, 120Hz, 144Hz, 240Hz) doğrudan GPU translate3d uygular.
    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      if ('pointerType' in e && e.pointerType === 'touch') return;

      lastX = e.clientX;
      lastY = e.clientY;

      // İmleci farenin merkezine anında konumlandır (20px çap / 10px merkez)
      cursor.style.transform = `translate3d(${lastX - 10}px, ${lastY - 10}px, 0)`;

      // Pencere sınırları kontrolü
      const inBounds =
        e.clientX >= 0 &&
        e.clientY >= 0 &&
        e.clientX <= window.innerWidth &&
        e.clientY <= window.innerHeight;

      if (!inBounds) {
        cursor.style.opacity = '0';
        isVisible = false;
        return;
      }

      // Fare altındaki elemanın tespiti
      const target =
        (e.target as HTMLElement | null) ||
        (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null);

      if (checkIsInput(target)) {
        isOverInput = true;
        cursor.style.opacity = '0';
        return;
      }

      // KESİNTİSİZ GÖRÜNÜRLÜK GARANTİSİ:
      // İmlecin masaüstünde bir süre sonra kaybolma sorununu kalıcı çözer.
      // Her geçerli hareket algılandığında görünürlük anında tazelenir.
      isOverInput = false;
      cursor.style.display = 'block';
      cursor.style.opacity = '1';
      isVisible = true;

      // Etkileşim durumu kontrolü
      const nowInteracting = checkIsInteractive(target);
      if (nowInteracting !== isInteracting) {
        isInteracting = nowInteracting;
        updateScale();
      }
    };

    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      if ('pointerType' in e && e.pointerType === 'touch') return;
      isPressed = true;
      updateScale();
    };

    const handlePointerUp = () => {
      isPressed = false;
      updateScale();
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      isVisible = false;
      isPressed = false;
    };

    const handleMouseEnter = () => {
      if (!isOverInput) {
        cursor.style.display = 'block';
        cursor.style.opacity = '1';
        isVisible = true;
      }
    };

    // Sayfa kaydırma sırasında imleç altındaki elemanın dinamik güncellenmesi
    const handleScroll = () => {
      if (lastX < 0 || lastY < 0 || !isVisible) return;
      const target = document.elementFromPoint(lastX, lastY) as HTMLElement | null;
      if (checkIsInput(target)) {
        isOverInput = true;
        cursor.style.opacity = '0';
      } else if (isOverInput) {
        isOverInput = false;
        cursor.style.display = 'block';
        cursor.style.opacity = '1';
        isInteracting = checkIsInteractive(target);
        updateScale();
      } else {
        const nowInteracting = checkIsInteractive(target);
        if (nowInteracting !== isInteracting) {
          isInteracting = nowInteracting;
          updateScale();
        }
      }
    };

    // Pencere odak kaybı veya sekme değişimi durumları
    const handleWindowBlur = () => {
      cursor.style.opacity = '0';
      isVisible = false;
      isPressed = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cursor.style.opacity = '0';
        isVisible = false;
        isPressed = false;
      }
    };

    // Hem pointermove hem mousemove dinleyerek tüm tarayıcı ve ekran yenileme hızlarında pürüzsüz çalışma
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[999999] opacity-0 will-change-transform mix-blend-difference select-none hidden md:block"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        transition: 'opacity 0.15s ease-out',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* 
        Siyah zemin üzerinde saf beyaz, beyaz zemin üzerinde saf siyah maskeleme (mix-blend-mode: difference).
        Konum (X/Y) donanım frekansında anında güncellenir; yalnızca scale geçişi akıcıdır.
      */}
      <div
        ref={dotRef}
        className="w-5 h-5 rounded-full bg-white pointer-events-none transition-transform duration-150 ease-out"
        style={{
          transform: 'scale(1)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
}
