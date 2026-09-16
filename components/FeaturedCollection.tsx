'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ARTWORKS_DATA } from '@/lib/artworks-data';

export default function FeaturedCollection() {
  // Seçili Eserler (Öne Çıkan Brutalist Arşiv)
  const featured = [
    {
      ...ARTWORKS_DATA[0], // selflove
      specimenRef: 'SPECIMEN_01 // 2024',
      filmCode: 'ILFORD_HP5_36A',
      colSpan: 'md:col-span-7',
      align: 'left',
    },
    {
      ...ARTWORKS_DATA[1], // it's not a set
      specimenRef: 'SPECIMEN_02 // 2024',
      filmCode: 'KODAK_TRI_X_12',
      colSpan: 'md:col-span-5',
      align: 'right',
    },
    {
      ...ARTWORKS_DATA[3], // farewellkiss
      specimenRef: 'SPECIMEN_04 // 2024',
      filmCode: 'FUJI_NEOPAN_08',
      colSpan: 'md:col-span-5',
      align: 'left',
    },
    {
      ...ARTWORKS_DATA[5], // uncut
      specimenRef: 'SPECIMEN_06 // 2023',
      filmCode: 'AGFA_APX_24',
      colSpan: 'md:col-span-7',
      align: 'right',
    },
  ];

  return (
    <section
      id="koleksiyon"
      className="w-full bg-[#f4f2ee] text-neutral-950 py-24 md:py-36 border-t border-b border-neutral-950 scroll-mt-20 font-sans"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ========================================================================= */}
        {/* 📰 EDİTORYAL BRUTALİZM MANİFESTO VE ARŞİV BAŞLIĞI */}
        {/* ========================================================================= */}
        <div className="border-b-2 border-neutral-950 pb-8 mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-600 mb-4">
                <span className="bg-neutral-950 text-white px-2 py-0.5 font-bold">EDİTORYAL BRUTALİZM</span>
                <span>{'//'}</span>
                <span>NONVALUE ARCHIVE DOSSIER</span>
                <span>{'//'}</span>
                <span>REF: 2018–2025</span>
              </div>
              <h2 className="font-serif text-6xl sm:text-8xl md:text-9xl uppercase tracking-tighter leading-[0.88] text-neutral-950">
                Seçili <br />
                <span className="italic font-light text-neutral-700 ml-4 sm:ml-16">Eserler</span>
              </h2>
            </div>

            {/* Brutalist Teknik Kartelası */}
            <div className="border border-neutral-950 bg-white p-5 max-w-sm text-xs font-mono">
              <div className="flex justify-between border-b border-neutral-300 pb-2 mb-2 font-bold uppercase">
                <span>INDEX RAISONNÉ</span>
                <span>VOL. 01</span>
              </div>
              <p className="font-sans text-xs text-neutral-700 leading-relaxed normal-case">
                Ateşin, erimiş metalin ve jeolojik buluntuların kontrolsüz akışıyla üretilen çağdaş takı ve mekansal nesne arşivi.
              </p>
              <div className="mt-3 pt-2 border-t border-neutral-200 flex justify-between text-[10px] text-neutral-500 uppercase">
                <span>DOKÜMANTASYON: 4/10 ESER</span>
                <span>SANATÇI: D. DEMİRKAYA</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📐 EDİTORYAL BRUTALİZM ASİMETRİK GÖRSEL DÜZENİ */}
        {/* ========================================================================= */}
        <div className="space-y-24 md:space-y-36">
          {featured.map((art, idx) => (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col ${
                art.align === 'right' ? 'items-end md:pl-20' : 'items-start md:pr-20'
              } w-full`}
            >
              {/* BRUTALİST FOTOĞRAF PLAKASI (HAIRLINE BORDERS + TECHNICAL CROSSHAIRS) */}
              <div className="w-full max-w-2xl bg-white border border-neutral-950 p-4 sm:p-6 shadow-[6px_6px_0px_#000]">
                
                {/* Üst Teknik Çapraz Çizgiler ve Eser Kodu */}
                <div className="flex items-center justify-between border-b border-neutral-950 pb-3 mb-4 text-[11px] font-mono tracking-widest uppercase">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-950">[+]</span>
                    <span className="font-bold text-neutral-950">{art.specimenRef}</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-600">
                    <span className="hidden sm:inline">{art.filmCode}</span>
                    {art.isUniquePiece && (
                      <span className="bg-neutral-950 text-white px-2 py-0.5 text-[9px] font-bold">
                        1/1 EŞSİZ
                      </span>
                    )}
                    <span className="font-bold text-neutral-950">[+]</span>
                  </div>
                </div>

                {/* Görsel Alanı (Contact Sheet Crop) */}
                <Link
                  href={`/koleksiyon/${art.id}`}
                  className="block relative aspect-[4/5] sm:aspect-[16/11] w-full bg-neutral-100 overflow-hidden border border-neutral-950 group cursor-pointer"
                >
                  <Image
                    src={art.images[0]}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 95vw, 650px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.03]"
                    priority={idx === 0}
                  />

                  {/* Sol Film Şeridi Çentikleri */}
                  <div className="absolute top-0 bottom-0 left-2 pointer-events-none hidden sm:flex flex-col justify-around text-[8px] font-mono text-white/50 z-10">
                    <span>▮ 35A</span>
                    <span>▮ 36</span>
                    <span>▮ 36A</span>
                  </div>

                  {/* Sağ Alt Hover Çağrısı */}
                  <div className="absolute bottom-0 right-0 bg-neutral-950 text-white px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    3D Uzamsal İncele →
                  </div>
                </Link>

                {/* Alt Teknik Veri Tablosu (Editoryal Brutalist Metadata Strip) */}
                <div className="mt-4 pt-3 border-t border-neutral-950 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono uppercase text-neutral-600">
                  <div>
                    <span className="text-neutral-400 block text-[8px]">MADEN & MATERYAL</span>
                    <span className="text-neutral-950 font-medium truncate block">{art.material}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[8px]">TEKNİK</span>
                    <span className="text-neutral-950 font-medium truncate block">{art.technique}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[8px]">AĞIRLIK</span>
                    <span className="text-neutral-950 font-medium block">{art.weight}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-400 block text-[8px]">DEĞER</span>
                    <span className="text-neutral-950 font-bold block text-xs">{art.price}</span>
                  </div>
                </div>

              </div>

              {/* Başlık ve Eser Açıklaması */}
              <div className="mt-6 max-w-2xl w-full flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-serif text-3xl sm:text-5xl text-neutral-950 uppercase tracking-tight hover:underline">
                    <Link href={`/koleksiyon/${art.id}`}>
                      {art.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs font-sans text-neutral-700 max-w-lg leading-relaxed">
                    {art.description}
                  </p>
                </div>
                <div className="shrink-0">
                  <Link
                    href={`/koleksiyon/${art.id}`}
                    className="inline-flex items-center gap-2 border border-neutral-950 px-4 py-2 text-xs font-mono uppercase tracking-widest bg-white hover:bg-neutral-950 hover:text-white transition-all shadow-[2px_2px_0px_#000]"
                  >
                    <span>Detay / Parallax</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

            </motion.article>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 🏛️ BRUTALİST TÜM ARŞİVE GEÇİŞ ŞERİDİ */}
        {/* ========================================================================= */}
        <div className="mt-32 border-2 border-neutral-950 bg-white p-8 md:p-12 shadow-[8px_8px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
              <span>CATALOGUE STATUS: VERIFIED</span>
              <span>•</span>
              <span>10 SPECIMENS DOCUMENTED</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl uppercase tracking-tight text-neutral-950">
              Tüm Koleksiyonu & Arşivi İnceleyin
            </h3>
            <p className="text-xs font-sans text-neutral-600 mt-2 max-w-xl leading-relaxed">
              Object (beden nesneleri), Space (mekansal heykeller) ve Line (süreç eskizleri) akslarının tamamına ait teknik çizelgeler ve katalog kayıtları.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-4 shrink-0 font-mono text-xs uppercase tracking-widest">
            <Link
              href="/koleksiyon"
              className="bg-neutral-950 text-white px-8 py-4 text-center hover:bg-neutral-800 transition-colors shadow-[4px_4px_0px_#666]"
            >
              Editoryal Katalog ({ARTWORKS_DATA.length})
            </Link>
            <Link
              href="/arsiv"
              className="border border-neutral-950 text-neutral-950 bg-white px-8 py-4 text-center hover:bg-neutral-100 transition-colors shadow-[4px_4px_0px_#000]"
            >
              Sinematik Tuval ↗
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
