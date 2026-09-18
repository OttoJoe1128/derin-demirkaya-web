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
    let rafId: number;

    // Linear Interpolation (Lerp) fonksiyonu - 144Hz akıcı takip
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    // Fare hareket dinleyicisi (Pasif ve hafif)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        targetOpacity = 1;
      }
    };

    const handleMouseEnter = () => {
      targetOpacity = 1;
    };

    const handleMouseLeave = () => {
      targetOpacity = 0;
    };

    // Event Delegation: Tek bir merkezi dinleyici ile hover ve form elemanı kontrolü
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Form ve metin giriş alanları: Özel imleci tamamen küçült ve gizle
      const isInput = target.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'
      );
      if (isInput) {
        targetScale = 0;
        targetOpacity = 0;
        cursor.classList.remove('is-hovering');
        return;
      }

      // 2. İnteraktif buton ve linkler: Manyetik büyüme
      const isInteractive = target.closest(
        'a, button, [role="button"], .cursor-pointer, summary, input[type="submit"], input[type="button"]'
      );
      if (isInteractive) {
        targetScale = 2.4;
        targetOpacity = 0.9;
        cursor.classList.add('is-hovering');
        return;
      }

      // 3. Varsayılan durum
      targetScale = 1;
      targetOpacity = 1;
      cursor.classList.remove('is-hovering');
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      // Pencereden dışarı çıkıldıysa gizle
      if (!relatedTarget || relatedTarget.nodeName === 'HTML') {
        targetOpacity = 0;
        cursor.classList.remove('is-hovering');
        return;
      }

      const isInput = relatedTarget.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'
      );
      if (isInput) {
        targetScale = 0;
        targetOpacity = 0;
        cursor.classList.remove('is-hovering');
        return;
      }

      const isInteractive = relatedTarget.closest(
        'a, button, [role="button"], .cursor-pointer, summary'
      );
      if (isInteractive) {
        targetScale = 2.4;
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
      // Lerp matematiği ile kusursuz süzülme (0.22 yumuşak ama anlık tepki faktörü)
      cursorX = lerp(cursorX, mouseX, 0.22);
      cursorY = lerp(cursorY, mouseY, 0.22);
      currentScale = lerp(currentScale, targetScale, 0.2);
      currentOpacity = lerp(currentOpacity, targetOpacity, 0.22);

      // Doğrudan GPU donanım hızlandırmalı transformasyonu güncelle (React bypass)
      cursor.style.transform = `translate3d(${cursorX - 12}px, ${cursorY - 12}px, 0) scale(${currentScale})`;
      cursor.style.opacity = currentOpacity.toFixed(3);

      rafId = requestAnimationFrame(render);
    };

    // Event listener'ları bağla
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    // rAF döngüsünü başlat
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[999999] mix-blend-difference bg-white opacity-0 will-change-transform transition-colors"
      style={{
        transform: 'translate3d(-100px, -100px, 0) scale(1)',
      }}
    />
  );
}
