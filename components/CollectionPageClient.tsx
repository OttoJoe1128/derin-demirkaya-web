'use client';

import Link from 'next/link';
import { ARTWORKS_DATA } from '@/lib/artworks-data';
import CollectionGallery from '@/components/CollectionGallery';
import { useLanguage } from '@/lib/language-context';

export default function CollectionPageClient() {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6">
        {/* Üst Başlık & Editoryal Giriş */}
        <div className="mb-8 sm:mb-14 md:mb-18">
          <Link
            href="/"
            className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 transition-colors mb-3 sm:mb-4 inline-block"
          >
            {isEn ? '← Home' : '← Ana Sayfa'}
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-8 border-b border-neutral-200/80 pb-6 sm:pb-10">
            <div>
              <span className="text-[10px] sm:text-xs font-sans text-neutral-400 uppercase tracking-[0.25em] block mb-1.5 sm:mb-2">
                Derin Buse Demirkaya / nonvalue jewel
              </span>
              <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl lg:text-8xl text-neutral-950 uppercase tracking-tighter leading-tight">
                {isEn ? 'Archive & Collection' : 'Arşiv & Koleksiyon'}
              </h1>
              <p className="font-sans text-neutral-600 text-[11px] sm:text-xs tracking-wider uppercase mt-2.5 sm:mt-4 max-w-2xl leading-relaxed">
                {isEn
                  ? 'the works presented here emerge from process-based making, shaped by movement, material encounters and situational production. each piece reflects a moment, a place or a condition rather than a fixed outcome.'
                  : 'burada sunulan eserler, hareket, malzeme karşılaşmaları ve durumsal üretimle biçimlenen süreç odaklı üretimden doğar. her parça sabit bir sonuçtan ziyade bir anı, mekanı veya koşulu yansıtır.'}
              </p>
            </div>
            
            <div className="grid grid-cols-3 sm:flex sm:flex-row gap-2 sm:gap-6 text-neutral-500 text-[10px] sm:text-xs font-mono uppercase tracking-wider bg-white p-3 sm:p-4 border border-neutral-200/60 shadow-xs">
              <div>
                <span className="text-neutral-400 block text-[9px] sm:text-[10px]">{isEn ? 'Archive' : 'Arşiv'}</span>
                <span className="text-neutral-950 font-bold">{ARTWORKS_DATA.length} {isEn ? 'Pcs' : 'Eser'}</span>
              </div>
              <div className="border-l border-neutral-200 pl-2 sm:pl-6">
                <span className="text-neutral-400 block text-[9px] sm:text-[10px]">{isEn ? 'Period' : 'Dönem'}</span>
                <span className="text-neutral-950 font-bold">2018–25</span>
              </div>
              <div className="border-l border-neutral-200 pl-2 sm:pl-6">
                <span className="text-neutral-400 block text-[9px] sm:text-[10px]">{isEn ? 'Axes' : 'Akslar'}</span>
                <span className="text-neutral-950 font-bold truncate block">Object/Space</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dinamik Filtreli Galeri */}
        <CollectionGallery artworks={ARTWORKS_DATA} />

        {/* Alt Bilgi & Sanatçı Beyanı */}
        <div className="mt-16 sm:mt-24 md:mt-32 pt-10 sm:pt-16 border-t border-neutral-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 block mb-2">
              {isEn ? 'Craft & Atelier' : 'Zanaat & Atölye'}
            </span>
            <p className="text-xs font-sans text-neutral-600 leading-relaxed">
              {isEn
                ? 'Experimental metal and silver studies blending academic jewelry design education at Marmara University with traditional Grand Bazaar apprenticeship.'
                : 'Marmara Üniversitesi Takı Tasarımı ve Grand Bazaar geleneksel çıraklık eğitimiyle harmanlanan deneysel metal ve gümüş çalışmaları.'}
            </p>
          </div>
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 block mb-2">
              {isEn ? 'Condition & Certificate' : 'Kondisyon & Sertifika'}
            </span>
            <p className="text-xs font-sans text-neutral-600 leading-relaxed">
              {isEn
                ? 'Each piece is delivered in an archival wooden box with an artist-signed certificate of authenticity. 1/1 pieces are individually numbered.'
                : 'Her eser sanatçı imzalı orijinallik belgesiyle özel korumalı ahşap kutusunda teslim edilir. 1/1 parçalar tekil olarak numaralandırılmıştır.'}
            </p>
          </div>
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 block mb-2">
              {isEn ? 'Contact & Bespoke Commissions' : 'İletişim & Özel Eser'}
            </span>
            <p className="text-xs font-sans text-neutral-600 leading-relaxed">
              {isEn
                ? 'For solo exhibitions, gallery partnerships, or bespoke design commissions, reach out directly:'
                : 'Özel sergi, galeri veya sipariş talepleri için doğrudan sanatçı ile temas kurabilirsiniz:'}{' '}
              <a href="mailto:nonvaluejewel@gmail.com" className="text-neutral-950 underline font-medium">
                nonvaluejewel@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
