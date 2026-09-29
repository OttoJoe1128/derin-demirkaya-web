'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ARTWORKS_DATA, type ArtworkDetail } from '@/lib/artworks-data';
import { soundFx } from '@/lib/sound-fx';

interface FramelessShopGridProps {
  lang: string;
}

/**
 * KESİN SIFIR METİN (Zero Text Policy) Floating Gallery
 * - Metin, başlık, fiyat, etiket veya kart çerçevesi KESİNLİKLE YOK.
 * - Siyah boşlukta süzülen heykelsi fotoğraflardan oluşan sessiz bir sergi salonu.
 * - 4-Noktalı Navigasyon için güvenli kenar boşlukları (safe-area padding).
 * - Zarif, yavaş süzülme (scale-105 duration-700) ve hafif kararma (opacity-70).
 */
export default function FramelessShopGrid({ lang }: FramelessShopGridProps) {
  const [artworks, setArtworks] = useState<{ id: string; image: string }[]>(() =>
    ARTWORKS_DATA.map((item) => ({
      id: item.id,
      image: item.images[0] || '',
    }))
  );

  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        if (data.artworks && Array.isArray(data.artworks) && data.artworks.length > 0) {
          setArtworks(
            data.artworks.map((item: ArtworkDetail) => ({
              id: item.id,
              image: item.images?.[0] || '',
            }))
          );
        }
      })
      .catch((err) => console.warn('Could not fetch artworks:', err));
  }, []);

  return (
    <div className="min-h-screen w-full bg-black select-none">
      {/* 
        Güvenli Alan: Ekranın 4 kenarındaki sabit navigasyon elemanlarına
        (TOP, LEFT, RIGHT, BOTTOM) çarpmaması için genişletilmiş boşluklar.
      */}
      <div className="w-full max-w-[1700px] mx-auto px-8 sm:px-16 md:px-24 lg:px-32 py-28 sm:py-36 md:py-44">
        {/* Sınırları olmayan, serbest ve ferah Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 sm:gap-24 lg:gap-32 items-center justify-items-center">
          {artworks.map((artwork, idx) => (
            <Link
              key={artwork.id}
              href={`/${lang}/shop/${artwork.id}`}
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="group relative w-full aspect-[4/5] max-w-[420px] block cursor-pointer overflow-hidden"
              aria-label={`Artwork ${idx + 1}`}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={artwork.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-70 filter contrast-[1.03]"
                  priority={idx < 6}
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
