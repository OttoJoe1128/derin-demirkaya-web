'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer')
        );
        setIsPointer(interactive);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (!pos) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[999999] transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      {/* 
        Siyah küre / renk değiştiren dinamik küre:
        - Beyaz/açık zeminde siyah (#000) görünür
        - Siyah veya koyu zemin üzerine geldiğinde beyaz/açık renge terslenir (mix-blend-difference)
        - Tıklanabilir öğelerde (link/buton) zarifçe genişler
        - Tıklama esnasında hafifçe sıkışır
      */}
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-out ${
          isPointer
            ? 'w-10 h-10 bg-white shadow-sm'
            : isClicking
            ? 'w-4 h-4 bg-white'
            : 'w-5 h-5 bg-white'
        }`}
        style={{
          mixBlendMode: 'difference',
          boxShadow: '0 0 1px 1px rgba(255,255,255,0.2)',
        }}
      />
    </div>
  );
}



