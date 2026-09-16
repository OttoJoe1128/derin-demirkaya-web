'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';

export default function Hero() {
  const { t, language } = useLanguage();

  return (
    <section className="relative w-full min-h-[88vh] flex items-center justify-center overflow-hidden border-b-2 border-neutral-950 bg-neutral-950 text-neutral-100">
      {/* 1. DOKULU & HEYKELSİ ARKA PLAN KATMANI (TEXTURED AMBIENT BACKDROP) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Arka Plan Heykelsi Eser Dokusu */}
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity scale-105 filter blur-[2px] transition-transform duration-1000 ease-out">
          <Image
            src="/artworks/744a7950cff34beaff3f06e308a540a0.jpg"
            alt="Sculptural Form Texture"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* İnce Radial Vignette & Müze Karartması */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(10,12,16,0.5)_0%,rgba(5,6,8,0.92)_75%,rgba(0,0,0,0.98)_100%]" />

        {/* İnce Galeri Izgara Deseni */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Dört Köşe Brutalist Referans Çaprazları */}
        <div className="absolute top-6 left-6 text-[10px] font-mono text-neutral-600 tracking-widest hidden sm:block">
          + LAT 38.4192° N // 2018–2025
        </div>
        <div className="absolute top-6 right-6 text-[10px] font-mono text-neutral-600 tracking-widest hidden sm:block">
          SPECIMEN NO. NV-ARCHIVE +
        </div>
        <div className="absolute bottom-6 left-6 text-[10px] font-mono text-neutral-600 tracking-widest hidden sm:block">
          + DERIN BUSE DEMIRKAYA
        </div>
        <div className="absolute bottom-6 right-6 text-[10px] font-mono text-neutral-600 tracking-widest hidden sm:block">
          NONVALUE JEWEL // STUDIO +
        </div>
      </div>

      {/* 2. EDİTORYAL VİTRİN VE İSİM VURGUSU */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Sol Kolon: Marka ve Sanatçı İsim Vurgusu */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
          
          {/* MARKA İSMİ VURGUSU (NONVALUE JEWEL) */}
          <div className="inline-flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="px-3 py-1 bg-white/10 border border-white/20 text-white font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] backdrop-blur-xs">
              {t('hero.brand')}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase hidden sm:inline">
              {'// '}{t('hero.brandSubtitle')}
            </span>
          </div>

          {/* MÜŞTERİNİN / SANATÇININ KENDİ İSMİ VURGUSU (DERİN BUSE DEMİRKAYA) */}
          <div className="space-y-2">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.92]">
              Derin Buse <br />
              <span className="italic font-light text-neutral-300">Demirkaya</span>
            </h1>
          </div>

          {/* İnce Ayırıcı Çizgi */}
          <div className="w-28 h-[2px] bg-gradient-to-r from-amber-400 via-neutral-500 to-transparent" />

          {/* Kısa Sanatçı İmzası / Konsept */}
          <p className="font-sans text-sm sm:text-base text-neutral-300 font-light max-w-xl leading-relaxed tracking-wide">
            {t('hero.manifestoTag')}
          </p>

          {/* Eylem Butonları (Call To Action) */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/#koleksiyon"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="px-8 py-4 bg-white text-neutral-950 font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-neutral-200 transition-all duration-300 shadow-[4px_4px_0px_#f59e0b] active:translate-x-0.5 active:translate-y-0.5 text-center flex items-center justify-center gap-2 group"
            >
              <span>{t('hero.explore')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/arsiv"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="px-7 py-4 border-2 border-white/40 hover:border-white text-white font-mono text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-300 text-center flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{t('hero.archive')}</span>
            </Link>

            <Link
              href="/atolye"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="px-5 py-4 text-neutral-400 hover:text-white font-mono text-xs uppercase tracking-[0.15em] transition-colors text-center"
            >
              {t('hero.workshops')}
            </Link>
          </div>

          {/* Alt Galeri Belirteçleri */}
          <div className="pt-6 flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {language === 'TR' ? 'El Dökümü 925 Gümüş & Bronz' : 'Hand-Cast 925 Silver & Bronze'}
            </span>
            <span>•</span>
            <span>{language === 'TR' ? '1/1 Eşsiz & Limitli Seriler' : '1/1 Unique & Limited Editions'}</span>
          </div>

        </div>

        {/* Sağ Kolon: Sanatsal Dokulu Eser Çerçevesi (Featured Master Artwork Display) */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-sm sm:max-w-md aspect-[4/5] bg-neutral-900 border-2 border-neutral-700/80 p-3 shadow-[12px_12px_0px_rgba(0,0,0,0.8)] group transition-transform duration-500 hover:-translate-y-1">
            
            {/* Eser Görseli */}
            <div className="relative w-full h-full overflow-hidden bg-black">
              <Image
                src="/artworks/744a7950cff34beaff3f06e308a540a0.jpg"
                alt="Selflove - Derin Buse Demirkaya"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 450px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-80" />

              {/* Sol Üst Eser Rozeti */}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs border border-white/15 px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase text-white">
                NV-OBJECT // 2024
              </div>

              {/* Sağ Üst 1/1 Rozeti */}
              <div className="absolute top-3 right-3 bg-amber-400 text-black font-mono font-bold text-[9px] px-2 py-0.5 uppercase tracking-widest">
                1/1 UNIQUE
              </div>

              {/* Alt Eser Bilgi Şeridi */}
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/85 backdrop-blur-xs border border-white/10 font-mono text-[10px] text-neutral-300">
                <div className="flex justify-between items-center text-white font-serif text-sm uppercase">
                  <span>Selflove</span>
                  <span className="text-amber-400 font-mono text-xs">₺3.200</span>
                </div>
                <div className="text-neutral-400 text-[9px] mt-0.5 uppercase tracking-wider">
                  {language === 'TR' ? '925 Gümüş & Altın Kaplama • Ateş Dökümü' : '925 Silver & Gold Vermeil • Fire Cast'}
                </div>
              </div>
            </div>

            {/* Çerçeve Altı Teknik İndeks */}
            <div className="mt-2 flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-neutral-400 px-1">
              <span>{t('hero.artworkLabel')}</span>
              <span>REF: SL-01</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
