'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isInverted, setIsInverted] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        // Tıklanabilir öğe tespiti
        const interactive = Boolean(
          target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer')
        );
        setIsPointer(interactive);

        // Koyu veya renkli zemin tespiti:
        // Eğer fare koyu arka planlı bir alanın (örneğin siyah buton, koyu kart, arsiv vs.) üzerindeyse
        // imleç zıt renge (beyaz / ters) döner.
        const darkElement = target.closest(
          '.bg-primary, .bg-neutral-800, .bg-neutral-900, .bg-black, [data-theme="dark"], .dark'
        );
        
        let darkBg = Boolean(darkElement);
        if (!darkBg) {
          // Doğrudan arka plan rengi kontrolü
          let el: HTMLElement | null = target;
          while (el && el !== document.body && el !== document.documentElement) {
            const bg = window.getComputedStyle(el).backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              // RGB parsing
              const rgb = bg.match(/\d+/g);
              if (rgb && rgb.length >= 3) {
                const r = parseInt(rgb[0], 10);
                const g = parseInt(rgb[1], 10);
                const b = parseInt(rgb[2], 10);
                // Parlaklık (Luminance) hesabı
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                if (brightness < 128) {
                  darkBg = true;
                  break;
                }
              }
            }
            el = el.parentElement;
          }
        }
        setIsInverted(darkBg);
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
      className="pointer-events-none fixed top-0 left-0 z-[9999999] will-change-transform"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      {/* 
        Ödüllü Minimalist Siyah Küre İmleç:
        - Standart durumda net, kusursuz SİYAH (#000000) bir küredir.
        - Koyu/siyah bir nesnenin ya da farklı renkli bir zeminin üzerine geldiğinde
          kendi rengini zıt (beyaz/açık) hale getirir.
        - Link veya buton üzerine geldiğinde genişler (hover), tıklamada küçülür.
      */}
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ease-out border ${
          isInverted
            ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
            : 'bg-black text-white border-black/20 shadow-[0_2px_8px_rgba(0,0,0,0.25)]'
        } ${
          isPointer
            ? 'w-9 h-9 opacity-90 scale-100'
            : isClicking
            ? 'w-4 h-4 opacity-100 scale-90'
            : 'w-5 h-5 opacity-100 scale-100'
        }`}
      />
    </div>
  );
}



