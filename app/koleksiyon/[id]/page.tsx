'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function ProductDetail() {
  const containerRef = useRef(null);
  
  // Sayfa kaydırma oranını dinliyoruz
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax Matematik Motoru (Farklı hızlarda hareket)
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div ref={containerRef} className="relative bg-neutral-900 min-h-[200vh]">
      
      {/* Sabit (Sticky) Parallax Sinematik Ekranı */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center -mt-20">
        
        {/* Arka Plan Görsel Katmanı */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-neutral-800 flex items-center justify-center"
          style={{ y: yBackground }}
        >
          <span className="text-neutral-700 font-sans tracking-[0.5em] text-sm border border-neutral-700 px-8 py-4 rounded-full">
            3D ESER GÖRSELİ (PARALLAX)
          </span>
        </motion.div>

        {/* Ön Plan Devasa Tipografi Katmanı */}
        <motion.div 
          className="relative z-10 flex flex-col items-center text-center px-6"
          style={{ y: yText, opacity: opacityText }}
        >
          <p className="text-accent-light font-sans text-sm tracking-[0.4em] uppercase mb-8 border-b border-accent-light/30 pb-4">
            Takı Tasarımı — Koleksiyon 01
          </p>
          <h1 className="font-serif text-7xl md:text-[10rem] text-white uppercase tracking-tighter leading-none mix-blend-difference">
            Ham Gümüş
          </h1>
        </motion.div>
      </div>

      {/* İçerik Bölümü (Aşağıdan yüzeye çıkan metin alanı) */}
      <div className="relative z-20 bg-neutral-50 w-full rounded-t-[3rem] px-6 py-32 shadow-2xl">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
          
          {/* Hikaye Alanı */}
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-12">Eserin Anatomisi</h2>
            <p className="font-sans text-neutral-800 leading-relaxed font-light text-lg md:text-xl">
              Doğanın kusurlu simetrisinden ilham alan bu parça, geleneksel kuyumculuk teknikleri ile modern brutalizmin kesiştiği noktada doğdu. Her bir çekiç darbesi, malzemenin kendi karakterini bulmasına izin veriyor.
            </p>
          </div>

          {/* Satın Alma / Rezarvasyon Paneli */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="flex justify-between items-end border-b border-neutral-200 pb-6">
              <span className="block text-sm font-sans text-accent uppercase tracking-widest">Materyal</span>
              <span className="font-serif text-2xl text-primary">925 Ayar Gümüş</span>
            </div>
            <div className="flex justify-between items-end border-b border-neutral-200 pb-6">
              <span className="block text-sm font-sans text-accent uppercase tracking-widest">Fiyat</span>
              <span className="font-serif text-3xl text-primary">₺1.250</span>
            </div>
            
            <button className="w-full bg-primary text-white py-6 font-sans text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-500">
              Koleksiyona Ekle
            </button>
            
            <Link href="/" className="text-center font-sans text-xs uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors mt-4 block">
              Geri Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
