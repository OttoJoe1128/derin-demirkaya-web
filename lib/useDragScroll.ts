import { useRef, useState, useCallback } from 'react';

interface UseDragScrollOptions {
  onSnapToClosest?: () => void;
  dragSpeed?: number;
}

export function useDragScroll(options?: UseDragScrollOptions) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const hasDraggedRef = useRef(false);

  const dragSpeed = options?.dragSpeed || 1.4;

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Yalnızca sol tık (button === 0)
    if (e.button !== 0) return;

    isDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - slider.offsetLeft;
    scrollLeftRef.current = slider.scrollLeft;

    slider.style.scrollBehavior = 'auto';
    slider.style.scrollSnapType = 'none';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;
    const slider = sliderRef.current;
    if (!slider) return;

    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startXRef.current) * dragSpeed;

    if (Math.abs(walk) > 6) {
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }
    }

    slider.scrollLeft = scrollLeftRef.current - walk;
  }, [dragSpeed]);

  const endDrag = useCallback(() => {
    if (!isDownRef.current) return;
    isDownRef.current = false;
    const slider = sliderRef.current;

    if (slider) {
      slider.style.removeProperty('scroll-behavior');
      slider.style.removeProperty('scroll-snap-type');
    }

    // Kısa süre sonra sürükleme durumunu sıfırla (tıklama yakalansın diye)
    setTimeout(() => {
      hasDraggedRef.current = false;
      setIsDragging(false);
    }, 50);

    if (options?.onSnapToClosest) {
      options.onSnapToClosest();
    }
  }, [options]);

  const onMouseUp = endDrag;
  const onMouseLeave = endDrag;

  // Sürükleme yapıldıysa kart tıklamalarını engelle (yanlışlıkla detay sayfasına gitmesin)
  const preventClickIfDragged = useCallback((e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return {
    sliderRef,
    isDragging,
    hasDraggedRef,
    dragHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
    preventClickIfDragged,
  };
}
