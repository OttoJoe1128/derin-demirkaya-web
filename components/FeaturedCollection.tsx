'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeaturedCollection() {
  const artworks = [
    { id: '1', title: 'Ham Gümüş Yüzük', subtitle: 'Koleksiyon 01', type: 'Takı', align: 'items-start' },
    { id: '3', title: 'Seramik Obje', subtitle: 'Toprak Serisi', type: 'Heykel', align: 'items-end' },
    { id: '4', title: 'Bronz Küpe', subtitle: 'Koleksiyon 02', type: 'Takı', align: 'items-center' },
  ];

  return (
    <section className="w-full bg-neutral-50 py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Brutalist Başlık */}
        <div className="mb-32">
          <h2 className="font-serif text-6xl md:text-8xl text-primary uppercase tracking-tighter leading-none">
            Seçili <br/> <span className="ml-12 md:ml-32 italic font-light text-accent">Eserler</span>
          </h2>
        </div>

        {/* Kırık Izgara (Broken Grid) Yapısı */}
        <div className="flex flex-col space-y-40 md:space-y-64">
          {artworks.map((art, index) => (
            <motion.div 
              key={art.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col ${art.align} w-full group`}
            >
              <Link href={`/koleksiyon/${art.id}`} className="block relative w-[90%] md:w-[45%] aspect-[3/4] bg-neutral-100 overflow-hidden">
                {/* Gelecekte gerçek görsel burada olacak */}
                <div className="absolute inset-0 bg-neutral-200 transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-sans text-xs tracking-[0.3em] uppercase text-accent/50 rotate-90">
                    Görsel Alanı
                  </span>
                </div>
              </Link>
              
              {/* Asimetrik Metin */}
              <div className="mt-8 md:mt-12 max-w-sm">
                <p className="text-xs font-sans text-accent uppercase tracking-widest mb-4">
                  {art.type} — {art.subtitle}
                </p>
                <h3 className="font-serif text-3xl md:text-5xl text-neutral-900 group-hover:italic transition-all duration-500">
                  {art.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
