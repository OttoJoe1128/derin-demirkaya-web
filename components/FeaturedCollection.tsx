'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ARTWORKS_DATA } from '@/lib/artworks-data';

export default function FeaturedCollection() {
  // derindemirkaya.xyz/nv sitesinden öne çıkan asıl eserler
  const featuredArtworks = [
    {
      ...ARTWORKS_DATA[0], // selflove
      align: 'items-start',
    },
    {
      ...ARTWORKS_DATA[1], // it's not a set
      align: 'items-end',
    },
    {
      ...ARTWORKS_DATA[3], // farewellkiss
      align: 'items-start',
    },
    {
      ...ARTWORKS_DATA[7], // zin
      align: 'items-end',
    },
  ];

  return (
    <section id="koleksiyon" className="w-full bg-neutral-50 py-28 md:py-36 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Brutalist Başlık ve Sanatçı Manifestosu */}
        <div className="mb-20 md:mb-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/80">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-sans block mb-3">
                nonvalue • archive / 2018–2025
              </span>
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-neutral-950 uppercase tracking-tighter leading-none">
                Seçili <br/> <span className="ml-8 md:ml-24 italic font-light text-neutral-500">Eserler</span>
              </h2>
            </div>
            <div className="max-w-md text-xs font-sans text-neutral-600 leading-relaxed tracking-wide">
              <span className="font-semibold text-neutral-900 uppercase">nonvalue</span>; henüz değer atanmamış olanı açığa çıkarmayı araştıran çağdaş bir takı ve mekansal nesne pratiğidir. Üretim yaklaşımı ateşin ve rastlantısal temasın dönüştürücü gücüne dayanır.
            </div>
          </div>
        </div>

        {/* Kırık Izgara (Broken Grid) Yapısı */}
        <div className="flex flex-col space-y-28 md:space-y-44">
          {featuredArtworks.map((art, idx) => (
            <motion.div 
              key={art.id}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col ${art.align} w-full group`}
            >
              <Link 
                href={`/koleksiyon/${art.id}`} 
                className="block relative w-[94%] md:w-[50%] lg:w-[46%] aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-200/80 shadow-sm"
              >
                <Image
                  src={art.images[0]}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 94vw, 50vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/10 transition-colors duration-500" />
                
                {/* Sol üst edisyon etiketi */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-white/90 uppercase tracking-widest">
                  {art.collectionName}
                </div>

                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-sans uppercase tracking-widest text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Uzamsal İncele →
                </div>
              </Link>
              
              <div className="mt-5 md:mt-7 max-w-md">
                <div className="flex items-center justify-between text-xs font-sans text-neutral-500 uppercase tracking-widest mb-1.5">
                  <span>{art.category} • {art.year}</span>
                  <span className="font-mono text-neutral-800 font-normal">{art.price}</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-neutral-950 group-hover:italic transition-all duration-300">
                  <Link href={`/koleksiyon/${art.id}`}>
                    {art.title}
                  </Link>
                </h3>
                <p className="mt-2 text-xs font-sans text-neutral-600 line-clamp-2 leading-relaxed">
                  {art.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tüm Koleksiyona Git CTA */}
        <div className="mt-28 text-center border-t border-neutral-200/80 pt-16">
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 mb-6">
            object • space • line / Toplam {ARTWORKS_DATA.length} Özgün Eser
          </p>
          <Link
            href="/koleksiyon"
            className="inline-flex items-center gap-3 px-9 py-4 border border-neutral-900 bg-neutral-950 text-white hover:bg-transparent hover:text-neutral-950 uppercase font-sans text-xs tracking-[0.2em] transition-all duration-300"
          >
            <span>Tüm Arşivi & Koleksiyonu Keşfet</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
