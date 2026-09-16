import Link from 'next/link';
import Image from 'next/image';
import { Film } from 'lucide-react';
import { ARTWORKS_DATA } from '@/lib/artworks-data';

export default function CinematicCanvasPortal() {
  return (
    <section className="w-full bg-[#07080a] text-white py-24 px-6 border-t border-b border-neutral-800 relative overflow-hidden font-sans">
      {/* İnce Film Arka Planı */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Üst Başlık & Telemetri */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>SİNEMATİK TUVAL • CANLI SERGİ UZAYI</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl uppercase tracking-tighter text-white">
              Sonsuz Arşiv Tuvali
            </h2>
          </div>

          <p className="font-sans text-xs font-light text-neutral-400 max-w-md leading-relaxed">
            Karanlık oda atmosferinde, analog ses rezonansı, 2.39:1 Cinemascope çerçevesi ve serbest süzülme fiziği ile tüm üretim sürecini uzamsal olarak deneyimleyin.
          </p>
        </div>

        {/* Sinematik Tuval Önizleme Sahnesi */}
        <div className="relative w-full aspect-[16/8] sm:aspect-[21/9] bg-[#0c0e12] border border-neutral-700/80 overflow-hidden shadow-2xl group">
          {/* Arka Plan Görselleri (Süzülen Eserler) */}
          <div className="absolute inset-0 flex items-center justify-around opacity-40 group-hover:opacity-70 transition-opacity duration-700">
            <div className="relative w-[28%] aspect-[4/5] -rotate-6 scale-95 transition-transform duration-700 group-hover:scale-105">
              <Image
                src={ARTWORKS_DATA[0].images[0]}
                alt="Selflove"
                fill
                className="object-cover border border-white/20"
              />
            </div>
            <div className="relative w-[32%] aspect-[4/5] z-10 scale-105 transition-transform duration-700 group-hover:scale-110">
              <Image
                src={ARTWORKS_DATA[1].images[0]}
                alt="It's not a set"
                fill
                className="object-cover border border-white/30 shadow-2xl"
              />
            </div>
            <div className="relative w-[26%] aspect-[4/5] rotate-6 scale-95 transition-transform duration-700 group-hover:scale-105">
              <Image
                src={ARTWORKS_DATA[3].images[0]}
                alt="Farewellkiss"
                fill
                className="object-cover border border-white/20"
              />
            </div>
          </div>

          {/* Sinematik Vignette & Karartma */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Viewfinder Telemetri Katmanı */}
          <div className="absolute inset-4 sm:inset-8 border border-white/10 flex flex-col justify-between p-3 pointer-events-none font-mono text-[9px] text-neutral-400">
            <div className="flex justify-between uppercase tracking-widest">
              <span>[ + ] 24.00 FPS // REEL_NV_2025</span>
              <span>CINEMASCOPE 2.39:1</span>
            </div>
            <div className="flex justify-between uppercase tracking-widest">
              <span>SURFACE: INTERACTIVE 2D PAN/ZOOM</span>
              <span>[ + ] AUDIO: ANALOG SUB-SYNTH</span>
            </div>
          </div>

          {/* Merkez Buton */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Link
              href="/arsiv"
              className="bg-white hover:bg-neutral-200 text-black px-8 sm:px-10 py-4 font-mono text-xs uppercase tracking-[0.25em] font-semibold transition-all shadow-[0_0_35px_rgba(255,255,255,0.4)] flex items-center gap-3 group-hover:scale-105"
            >
              <Film className="w-4 h-4 text-black" />
              <span>Sinematik Tuvali Başlat</span>
              <span className="text-neutral-500">↗</span>
            </Link>
          </div>
        </div>

        {/* 3 Tasarım Aksı Bilgi Şeridi */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs font-mono">
          <div className="p-4 border border-white/10 bg-white/5">
            <span className="text-amber-400 font-bold block mb-1">01 // SİNEMATİK TUVAL</span>
            <p className="text-neutral-400 text-[11px] leading-relaxed font-sans font-light">
              Arşiv alanı; analog ses, dinamik spot ışığı ve sürükleme fiziğiyle çalışan karanlık oda sahnesidir.
            </p>
          </div>
          <div className="p-4 border border-white/10 bg-white/5">
            <span className="text-white font-bold block mb-1">02 // UZAMSAL PARALLAX</span>
            <p className="text-neutral-400 text-[11px] leading-relaxed font-sans font-light">
              Ürün detayları; 3D fare/jiroskop yörüngesi, katmanlı uzay ve maden koordinat iğneleriyle derinlik kazanır.
            </p>
          </div>
          <div className="p-4 border border-white/10 bg-white/5">
            <span className="text-neutral-300 font-bold block mb-1">03 // EDİTORYAL BRUTALİZM</span>
            <p className="text-neutral-400 text-[11px] leading-relaxed font-sans font-light">
              Tüm ürün görselleri; keskin 1px bordürler, çapraz hedef işaretleri ve envanter kartlarıyla arşivlenir.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
