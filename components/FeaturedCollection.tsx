'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedCollection() {
  const artworks = [
    { 
      id: '1', 
      title: 'Ham Gümüş Yüzük', 
      subtitle: 'Koleksiyon 01', 
      type: 'Takı Tasarımı', 
      price: '₺1.250',
      align: 'items-start',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85',
    },
    { 
      id: '2', 
      title: 'Toprak ve Form Vazo', 
      subtitle: 'Koleksiyon 02', 
      type: 'Seramik & Heykel', 
      price: '₺2.400',
      align: 'items-end',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1400&q=85',
    },
    { 
      id: '4', 
      title: 'Bronz Dövme Küpe', 
      subtitle: 'Koleksiyon 02', 
      type: 'Takı Tasarımı', 
      price: '₺950',
      align: 'items-center',
      imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1400&q=85',
    },
  ];

  return (
    <section id="koleksiyon" className="w-full bg-neutral-50 py-32 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Brutalist Başlık */}
        <div className="mb-24 md:mb-32">
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-sans block mb-3">
            Editoryal Seçki / 2024–2025
          </span>
          <h2 className="font-serif text-6xl md:text-8xl text-neutral-950 uppercase tracking-tighter leading-none">
            Seçili <br/> <span className="ml-12 md:ml-32 italic font-light text-neutral-500">Eserler</span>
          </h2>
        </div>

        {/* Kırık Izgara (Broken Grid) Yapısı */}
        <div className="flex flex-col space-y-32 md:space-y-48">
          {artworks.map((art) => (
            <motion.div 
              key={art.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col ${art.align} w-full group`}
            >
              <Link href={`/koleksiyon/${art.id}`} className="block relative w-[92%] md:w-[48%] aspect-[3/4] bg-neutral-100 overflow-hidden border border-neutral-200/60 shadow-sm">
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/10 transition-colors duration-500" />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-sans uppercase tracking-widest text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity">
                  Eseri İncele →
                </div>
              </Link>
              
              <div className="mt-6 md:mt-8 max-w-sm">
                <p className="text-xs font-sans text-neutral-500 uppercase tracking-widest mb-2">
                  {art.type} — {art.subtitle} ({art.price})
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-neutral-950 group-hover:italic transition-all duration-300">
                  <Link href={`/koleksiyon/${art.id}`}>
                    {art.title}
                  </Link>
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tüm Koleksiyona Git CTA */}
        <div className="mt-28 text-center">
          <Link
            href="/koleksiyon"
            className="inline-flex items-center gap-3 px-8 py-4 border border-neutral-900 text-neutral-950 hover:bg-neutral-950 hover:text-white uppercase font-sans text-xs tracking-widest transition-all duration-300"
          >
            <span>Tüm Koleksiyonu Görüntüle</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
