'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArtworkDetail } from '@/lib/artworks-data';

interface CollectionGalleryProps {
  artworks: ArtworkDetail[];
}

export default function CollectionGallery({ artworks }: CollectionGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'TÜMÜ', count: artworks.length, sub: '2018–2025 Arşivi' },
    { id: 'OBJECT', label: 'OBJECT', count: artworks.filter(a => a.collectionName.includes('object')).length, sub: 'Beden Nesneleri & Takı' },
    { id: 'SPACE', label: 'SPACE', count: artworks.filter(a => a.collectionName.includes('space')).length, sub: 'Mekansal Enstalasyon & Heykel' },
    { id: 'LINE', label: 'LINE', count: artworks.filter(a => a.collectionName.includes('line')).length, sub: 'Eskizler & Süreç İzi' },
  ];

  const filteredArtworks = activeCategory === 'ALL'
    ? artworks
    : artworks.filter(a => a.collectionName.toUpperCase().includes(activeCategory));

  return (
    <div className="w-full">
      {/* Kategori Filtre Butonları */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-14 border-b border-neutral-200/80 pb-6">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs font-sans uppercase tracking-[0.2em] transition-all duration-300 border flex items-center gap-2 ${
                isActive
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                ({cat.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Kategori Açıklaması */}
      <div className="mb-10 text-xs font-sans text-neutral-500 uppercase tracking-widest flex items-center justify-between">
        <span>
          {activeCategory === 'ALL' && 'Tüm Arşiv: Süreç odaklı üretim, hareket ve malzeme karşılaşmaları'}
          {activeCategory === 'OBJECT' && 'Object: Bedenle temas ederek anlam kazanan çağdaş takı ve yüzeyler'}
          {activeCategory === 'SPACE' && 'Space: Takının bedenden mekana taştığı heykelsi enstalasyonlar'}
          {activeCategory === 'LINE' && 'Line: Gözlem, test ve materyal düşüncesi için eskiz alanı'}
        </span>
        <span className="font-mono text-neutral-400">
          {filteredArtworks.length} Eser Listeleniyor
        </span>
      </div>

      {/* Eser Izgarası */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14"
      >
        <AnimatePresence>
          {filteredArtworks.map((item) => (
            <motion.article
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Görsel Alanı */}
              <Link 
                href={`/koleksiyon/${item.id}`} 
                className="block relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-200/80 shadow-sm"
              >
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/15 transition-colors duration-500 z-10" />
                
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Rozetler */}
                <div className="absolute top-3 left-3 z-20 flex gap-2">
                  <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-white/90 uppercase tracking-widest">
                    {item.collectionName.replace('nonvalue — ', '')}
                  </span>
                  {item.isUniquePiece && (
                    <span className="bg-neutral-800/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-neutral-200 uppercase tracking-widest">
                      1/1
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-sans uppercase tracking-widest text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Uzamsal İncele →
                </div>
              </Link>
              
              {/* Detay Bilgileri */}
              <div className="flex flex-col pt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-sans text-neutral-400 uppercase tracking-widest">
                  <span>{item.category} • {item.year}</span>
                  <span className="font-mono text-neutral-800 font-medium">{item.price}</span>
                </div>
                
                <h3 className="font-serif text-xl text-neutral-950 group-hover:italic transition-all duration-200">
                  <Link href={`/koleksiyon/${item.id}`}>
                    {item.title}
                  </Link>
                </h3>
                
                <p className="text-xs font-sans text-neutral-500 line-clamp-2 pt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
