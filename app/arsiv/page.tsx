'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ArchiveCanvas() {
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Eserlerin hem mobil (varsayılan) hem de masaüstü (md:) koordinat ve boyutları ayrıştırıldı
  const archiveItems = [
    { id: 1, title: 'Kökler Sergisi', year: '2023', pos: 'left-[10vw] top-[5vh] md:left-[10vw] md:top-[15vh]', size: 'w-[75vw] h-[40vh] md:w-[300px] md:h-[400px]' },
    { id: 2, title: 'Toprak ve Form', year: '2022', pos: 'left-[100vw] top-[30vh] md:left-[45vw] md:top-[40vh]', size: 'w-[85vw] h-[30vh] md:w-[400px] md:h-[250px]' },
    { id: 3, title: 'Gümüşün Halleri', year: '2021', pos: 'left-[20vw] top-[90vh] md:left-[75vw] md:top-[10vh]', size: 'w-[70vw] h-[45vh] md:w-[250px] md:h-[350px]' },
    { id: 4, title: 'Yeniden Doğuş', year: '2024', pos: 'left-[120vw] top-[100vh] md:left-[20vw] md:top-[65vh]', size: 'w-[80vw] h-[50vh] md:w-[350px] md:h-[450px]' },
    { id: 5, title: 'Sonsuz Döngü', year: '2023', pos: 'left-[60vw] top-[160vh] md:left-[65vw] md:top-[75vh]', size: 'w-[90vw] h-[35vh] md:w-[450px] md:h-[300px]' },
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-neutral-900 overflow-hidden" ref={constraintsRef}>
      
      {/* HUD (Heads Up Display) */}
      <div className="absolute top-20 left-6 md:left-12 z-50 pointer-events-none mix-blend-difference">
        <h1 className="font-serif text-5xl md:text-7xl text-white uppercase tracking-tighter">Arşiv</h1>
        <p className="font-sans text-neutral-400 text-xs tracking-[0.3em] uppercase mt-2">
          Uzayı Keşfetmek İçin Sürükle
        </p>
      </div>
      
      <div className="absolute bottom-12 right-6 md:right-12 z-50 mix-blend-difference">
         <Link href="/" className="font-sans text-xs tracking-widest text-white hover:text-accent transition-colors uppercase border-b border-white/30 pb-1 cursor-pointer">
           Vitrine Dön
         </Link>
      </div>

      {/* Tuval Mobilde 2.5 kat daha büyük (w-[250vw] h-[250vh]) yapıldı ki eserler üst üste binmesin */}
      <motion.div 
        drag 
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={true}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
        className="absolute top-0 left-0 w-[250vw] h-[250vh] md:w-[150vw] md:h-[150vh] cursor-grab active:cursor-grabbing"
      >
        {archiveItems.map((item) => (
          <motion.div 
            key={item.id}
            className={`absolute ${item.size} ${item.pos} group`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-full h-full bg-neutral-800 relative overflow-hidden flex items-center justify-center">
              <span className="font-serif text-[6rem] md:text-[10rem] text-neutral-900 opacity-50 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none select-none">
                0{item.id}
              </span>
            </div>
            
            <div className="absolute -bottom-12 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-sans pointer-events-none">
              <h3 className="text-white text-sm md:text-base uppercase tracking-widest">{item.title}</h3>
              <span className="text-neutral-500 text-xs tracking-[0.2em]">{item.year}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
