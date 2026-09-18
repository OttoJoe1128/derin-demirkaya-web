'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobil veya dokunmatik cihazlarda çalıştırma
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
    if (!cursor) return;

    // Koordinat ve durum değişkenleri (React state'ten tamamen bağımsız)
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let targetScale = 1;
    let currentScale = 1;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let isVisible = false;
    let isOverInput = false;
    let rafId: number;

    // Linear Interpolation (Lerp) fonksiyonu
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    // Fare hareket dinleyicisi
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible && !isOverInput) {
        isVisible = true;
        targetOpacity = 1;
      }
    };

    const handleMouseEnter = () => {
      if (!isOverInput) {
        targetOpacity = 1;
        cursor.style.display = 'block';
      }
    };

    const handleMouseLeave = () => {
      targetOpacity = 0;
    };

    // Form ve metin giriş elemanı tespiti (input, textarea, select, contenteditable)
    const checkIsInput = (element: HTMLElement | null): boolean => {
      if (!element) return false;
      return !!element.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'
      );
    };

    // Tıklanabilir interaktif eleman tespiti (link, button vb.)
    const checkIsInteractive = (element: HTMLElement | null): boolean => {
      if (!element) return false;
      return !!element.closest(
        'a, button, [role="button"], .cursor-pointer, summary, input[type="submit"], input[type="button"]'
      );
    };

    // 3. Form Elemanlarında Özel İmleci Anında Gizle (Savaşma)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (checkIsInput(target)) {
        isOverInput = true;
        cursor.style.display = 'none';
        targetOpacity = 0;
        currentOpacity = 0;
        return;
      }

      // Form alanından çıkıldıysa görünürlüğü anında geri getir
      if (isOverInput) {
        isOverInput = false;
        cursor.style.display = 'block';
      }

      if (checkIsInteractive(target)) {
        targetScale = 2.2;
        targetOpacity = 0.9;
        cursor.classList.add('is-hovering');
      } else {
        targetScale = 1;
        targetOpacity = 1;
        cursor.classList.remove('is-hovering');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      // Pencereden dışarı çıkıldıysa
      if (!relatedTarget || relatedTarget.nodeName === 'HTML') {
        targetOpacity = 0;
        cursor.classList.remove('is-hovering');
        return;
      }

      if (checkIsInput(relatedTarget)) {
        isOverInput = true;
        cursor.style.display = 'none';
        targetOpacity = 0;
        currentOpacity = 0;
        return;
      }

      if (isOverInput) {
        isOverInput = false;
        cursor.style.display = 'block';
      }

      if (checkIsInteractive(relatedTarget)) {
        targetScale = 2.2;
        targetOpacity = 0.9;
        cursor.classList.add('is-hovering');
      } else {
        targetScale = 1;
        targetOpacity = 1;
        cursor.classList.remove('is-hovering');
      }
    };

    // 60-144Hz requestAnimationFrame Render Döngüsü
    const render = () => {
      if (!isOverInput) {
        cursorX = lerp(cursorX, mouseX, 0.25);
        cursorY = lerp(cursorY, mouseY, 0.25);
        currentScale = lerp(currentScale, targetScale, 0.25);
        currentOpacity = lerp(currentOpacity, targetOpacity, 0.25);

        // 2. Bağımsız GPU Katmanı: translate3d + translateZ(0) ile Hardware Compositing
        cursor.style.transform = `translate3d(${cursorX - 10}px, ${cursorY - 10}px, 0) translateZ(0) scale(${currentScale})`;
        cursor.style.opacity = currentOpacity.toFixed(3);
      }

      rafId = requestAnimationFrame(render);
    };

    // Event dinleyicilerini bağla
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    // rAF döngüsünü başlat
    rafId = requestAnimationFrame(render);

    // 4. Event Listener Cleanup (Hafıza Kaçağı / Memory Leak Önlemi)
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // 1. CSS Render Darboğazlarını Sil: mix-blend-mode ve backdrop-filter kaldırıldı.
  // Katı (solid) amber rengi, bağımsız GPU katmanı (translateZ(0), isolation: isolate, backfaceVisibility: hidden)
  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[999999] bg-amber-400 opacity-0 will-change-transform shadow-[0_0_12px_rgba(251,191,36,0.4)] border border-amber-300/70"
      style={{
        transform: 'translate3d(-100px, -100px, 0) translateZ(0) scale(1)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        isolation: 'isolate',
      }}
    />
  );
}
