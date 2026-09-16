'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ARTWORKS_DATA } from '@/lib/artworks-data';

export default function ArchiveCanvas() {
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // derindemirkaya.xyz/nv arşivinden gerçek eserler ve uzamsal koordinatları
  const archiveItems = [
    {
      ...ARTWORKS_DATA[0], // selflove
      pos: 'left-[8vw] top-[6vh] md:left-[8vw] md:top-[12vh]',
      size: 'w-[75vw] h-[45vh] md:w-[320px] md:h-[420px]',
    },
    {
      ...ARTWORKS_DATA[1], // it's not a set
      pos: 'left-[95vw] top-[22vh] md:left-[42vw] md:top-[38vh]',
      size: 'w-[80vw] h-[40vh] md:w-[380px] md:h-[280px]',
    },
    {
      ...ARTWORKS_DATA[2], // non control
      pos: 'left-[15vw] top-[80vh] md:left-[72vw] md:top-[10vh]',
      size: 'w-[72vw] h-[48vh] md:w-[280px] md:h-[380px]',
    },
    {
      ...ARTWORKS_DATA[3], // farewellkiss
      pos: 'left-[110vw] top-[95vh] md:left-[18vw] md:top-[62vh]',
      size: 'w-[78vw] h-[46vh] md:w-[340px] md:h-[440px]',
    },
    {
      ...ARTWORKS_DATA[6], // not a jewelry
      pos: 'left-[50vw] top-[150vh] md:left-[60vw] md:top-[70vh]',
      size: 'w-[85vw] h-[40vh] md:w-[420px] md:h-[320px]',
    },
    {
      ...ARTWORKS_DATA[7], // zin
      pos: 'left-[105vw] top-[165vh] md:left-[88vw] md:top-[50vh]',
      size: 'w-[75vw] h-[45vh] md:w-[300px] md:h-[400px]',
    },
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-neutral-950 overflow-hidden" ref={constraintsRef}>
      
      {/* HUD (Heads Up Display) */}
      <div className="absolute top-20 left-6 md:left-12 z-50 pointer-events-none mix-blend-difference">
        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
          nonvalue • spatial constellation
        </span>
        <h1 className="font-serif text-5xl md:text-7xl text-white uppercase tracking-tighter">
          Arşiv
        </h1>
        <p className="font-sans text-neutral-400 text-xs tracking-[0.25em] uppercase mt-2">
          Uzayı Keşfetmek İçin Sürükleyin • Eserlere Tıklayın
        </p>
      </div>
      
      <div className="absolute bottom-12 right-6 md:right-12 z-50 mix-blend-difference flex items-center gap-6">
        <Link 
          href="/koleksiyon" 
          className="font-sans text-xs tracking-widest text-neutral-400 hover:text-white transition-colors uppercase"
        >
          Katalog Görünümü
        </Link>
        <Link 
          href="/" 
          className="font-sans text-xs tracking-widest text-white hover:text-neutral-300 transition-colors uppercase border-b border-white/40 pb-1 cursor-pointer"
        >
          Vitrine Dön →
        </Link>
      </div>

      {/* Tuval */}
      <motion.div 
        drag 
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={true}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
        className={`absolute top-0 left-0 w-[240vw] h-[240vh] md:w-[150vw] md:h-[150vh] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {archiveItems.map((item, idx) => (
          <motion.div 
            key={item.id}
            className={`absolute ${item.size} ${item.pos} group`}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/koleksiyon/${item.id}`}
              onClick={(e) => {
                if (isDragging) e.preventDefault();
              }}
              className="block w-full h-full relative overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl"
            >
              <Image
                src={item.images[0]}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 80vw, 400px"
                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              
              <div className="absolute top-4 left-4 z-10 text-[10px] font-mono text-white/70 uppercase tracking-widest">
                0{idx + 1} / {item.collectionName.replace('nonvalue — ', '')}
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10 font-sans">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-1">
                  <span>{item.year}</span>
                  <span className="text-white font-semibold">{item.price}</span>
                </div>
                <h3 className="text-white text-base md:text-lg uppercase font-serif tracking-tight group-hover:underline">
                  {item.title}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
