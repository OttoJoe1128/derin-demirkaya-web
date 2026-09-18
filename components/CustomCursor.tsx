'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dokunmatik ve mobil cihazlarda imleci tamamen devre dışı bırak
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
    let isVisible = false;

    // 1. Sıfır Gecikme (No Spring, No Lerp):
    // Donanımsal fare koordinatına (clientX, clientY) anında 1:1 ışıma (0ms lag)
    const handleMouseMove = (e: MouseEvent) => {
      // Taşıyıcı div'i farenin merkezine doğrudan konumlandır
      cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;

      if (!isVisible && !isOverInput) {
        isVisible = true;
        cursor.style.opacity = '1';
      }
    };

    const handleMouseEnter = () => {
      if (!isOverInput) {
        cursor.style.opacity = '1';
        cursor.style.display = 'block';
      }
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
    };

    // Form alanı tespiti (input, textarea, select, contenteditable)
    const checkIsInput = (element: HTMLElement | null): boolean => {
      if (!element) return false;
      return !!element.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'
      );
    };

    // Tıklanabilir interaktif eleman tespiti (link, button, role=button)
    const checkIsInteractive = (element: HTMLElement | null): boolean => {
      if (!element) return false;
      return !!element.closest(
        'a, button, [role="button"], .cursor-pointer, summary, input[type="submit"], input[type="button"]'
      );
    };

    // 4. Hover Durumlarında Hızlı Tepki (Event Delegation):
    // Konum (X/Y) asla transition almaz; sadece iç nokta (dot) scale animasyonu yapar.
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Form elemanlarında özel imleci anında yok et (OS imlecine bırak)
      if (checkIsInput(target)) {
        isOverInput = true;
        cursor.style.display = 'none';
        return;
      }

      if (isOverInput) {
        isOverInput = false;
        cursor.style.display = 'block';
        cursor.style.opacity = '1';
      }

      if (checkIsInteractive(target)) {
        dot.style.transform = 'scale(2)';
      } else {
        dot.style.transform = 'scale(1)';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      // Pencere sınırlarından çıkıldıysa
      if (!relatedTarget || relatedTarget.nodeName === 'HTML') {
        cursor.style.opacity = '0';
        dot.style.transform = 'scale(1)';
        return;
      }

      if (checkIsInput(relatedTarget)) {
        isOverInput = true;
        cursor.style.display = 'none';
        return;
      }

      if (isOverInput) {
        isOverInput = false;
        cursor.style.display = 'block';
        cursor.style.opacity = '1';
      }

      if (checkIsInteractive(relatedTarget)) {
        dot.style.transform = 'scale(2)';
      } else {
        dot.style.transform = 'scale(1)';
      }
    };

    // Event listener'ları bağla (Passive: true ile tarayıcı kaydırma performansını kilitlemez)
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    // Temizleme fonksiyonu (Memory Leak engeli)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    // 2. Pointer Events Kesinliği: pointer-events-none ve z-[999999] (Tamamen hayalet eleman)
    // Konum taşıyıcısında KESİNLİKLE CSS transition YOKTUR (1:1 anında ışınlanma)
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[999999] opacity-0 will-change-transform"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* 3. Katı ve Basit CSS: mix-blend-mode, box-shadow, backdrop-filter tamamen SİLİNDİ.
          Sadece scale için hafif bir CSS transition uygulanır; konum asla gecikmez. */}
      <div
        ref={dotRef}
        className="w-5 h-5 rounded-full bg-amber-400 pointer-events-none transition-transform duration-150 ease-out"
        style={{
          transform: 'scale(1)',
        }}
      />
    </div>
  );
}
