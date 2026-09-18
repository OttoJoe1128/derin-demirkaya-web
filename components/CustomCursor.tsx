'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// 5. Mobil ve Dokunmatik Cihaz Koruması (React 19 / Next.js 16 useSyncExternalStore)
function subscribeToHoverMedia(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getHoverSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function getServerSnapshot() {
  return false;
}

export default function CustomCursor() {
  const isFinePointer = useSyncExternalStore(
    subscribeToHoverMedia,
    getHoverSnapshot,
    getServerSnapshot
  );

  // 1. Sıfır Render (Zero-Lag Physics) - React state yerine doğrudan MotionValue'lar
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorScale = useMotionValue(1);
  const cursorOpacity = useMotionValue(0);

  // Ultra akıcı ve tepkisel yay fiziği (GPU Transform Senkronu)
  const springConfig = { stiffness: 420, damping: 28, mass: 0.15 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const smoothScale = useSpring(cursorScale, { stiffness: 450, damping: 30 });
  const smoothOpacity = useSpring(cursorOpacity, { stiffness: 500, damping: 35 });

  // Fare hareket ve olay temsilcisi (Event Delegation)
  useEffect(() => {
    if (!isFinePointer) return;

    let hasMoved = false;

    // Koordinatları React re-render döngüsüne girmeden doğrudan GPU katmanına aktarır
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);

      if (!hasMoved) {
        hasMoved = true;
        cursorOpacity.set(1);
      }
    };

    // 3. Tarayıcı Kenarı (Mouse Leave / Enter) Güvenliği
    const handleMouseEnter = () => {
      cursorOpacity.set(1);
    };

    const handleMouseLeave = () => {
      cursorOpacity.set(0);
    };

    // 4. Event Delegation ile Hover/Manyetik Mod ve Form Algılama
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Form elemanlarında (input, textarea vb.) özel imleci gizle
      const isInput = target.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'
      );
      if (isInput) {
        cursorScale.set(0);
        cursorOpacity.set(0);
        return;
      }

      // Tıklanabilir interaktif elemanlarda imleci büyüt ve parlat
      const isInteractive = target.closest(
        'a, button, [role="button"], .cursor-pointer, summary, input[type="submit"], input[type="button"]'
      );
      if (isInteractive) {
        cursorScale.set(2.2);
        cursorOpacity.set(0.9);
        return;
      }

      // Normal durum
      cursorScale.set(1);
      cursorOpacity.set(1);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      // Pencereden tamamen çıkış yapıldıysa
      if (!relatedTarget || relatedTarget.nodeName === 'HTML') {
        cursorOpacity.set(0);
        return;
      }

      const isInput = relatedTarget.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'
      );
      if (isInput) {
        cursorScale.set(0);
        cursorOpacity.set(0);
        return;
      }

      const isInteractive = relatedTarget.closest(
        'a, button, [role="button"], .cursor-pointer, summary'
      );
      if (isInteractive) {
        cursorScale.set(2.2);
        cursorOpacity.set(0.9);
      } else {
        cursorScale.set(1);
        cursorOpacity.set(1);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isFinePointer, cursorX, cursorY, cursorScale, cursorOpacity]);

  // Cihaz dokunmatikse veya SSR sırasında bileşeni hiç render etme
  if (!isFinePointer) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[999999] mix-blend-difference bg-white will-change-transform"
      style={{
        x: smoothX,
        y: smoothY,
        scale: smoothScale,
        opacity: smoothOpacity,
      }}
    />
  );
}
