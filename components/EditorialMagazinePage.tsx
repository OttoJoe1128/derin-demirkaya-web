'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowLeft,
  Flame,
  Layers,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';
import VerticalNavigation from '@/components/VerticalNavigation';
import type { Dictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export default function EditorialMagazinePage({ lang, dict }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const spreads = dict.magazine.spreads;
  const langPrefix = `/${lang}`;

  // Belirli bir sayfaya yumuşakça kaydırma
  const scrollToPage = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const clampedIndex = Math.max(0, Math.min(spreads.length - 1, index));
    const targetX = clampedIndex * window.innerWidth;
    scrollContainerRef.current.scrollTo({
      left: targetX,
      behavior: 'smooth',
    });
    setActivePageIndex(clampedIndex);
    soundFx.playClick();
  }, [spreads.length]);

  // Yatay Dergi Akışı (Fare Tekerleğini Dikeyden Yataya Çevirme)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollBy({
          left: e.deltaY * 1.3,
          behavior: 'auto',
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Klavye ok tuşları (A11y - Sol / Sağ oklar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToPage(activePageIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToPage(activePageIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePageIndex, scrollToPage]);

  // Kaydırma Pozisyonu ve Aktif Sayfa Takibi
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const page = Math.round(scrollLeft / clientWidth);
    setActivePageIndex(page);

    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  };

  const { spread1, spread2, spread3, spread4, spread5, controls } = dict.magazine;

  return (
    <main
      id="editorial-magazine-viewport"
      className="relative w-screen h-screen overflow-hidden bg-neutral-950 text-neutral-100 select-none font-sans"
    >
      {/* Sabit Sağ Kenar Dikey Navigasyonu (Dil ve Sözlük prop'ları ile) */}
      <VerticalNavigation lang={lang} dict={dict} />

      {/* YATAY DERGİ SARGISI (Horizontal Scroll Track) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-full flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
      >
        {/* ============================================================ */}
        {/* SAYFA 01 // DERGİ KAPAĞI (COVER & PROLOGUE) */}
        {/* ============================================================ */}
        <section
          id="spread-1"
          aria-label={spreads[0]?.title}
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between pt-20 sm:pt-24 pb-16 px-6 sm:px-10 lg:px-14 border-r border-neutral-800/80 bg-neutral-950"
        >
          {/* Dokulu & Granüllü Sanatsal Arka Plan Katmanı */}
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-luminosity">
            <Image
              src="/artworks/744a7950cff34beaff3f06e308a540a0.jpg"
              alt="Molten Texture Background"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center filter blur-[1px]"
            />
          </div>
          <div className="absolute inset-0 bg-radial-[circle_at_30%_30%,rgba(20,22,26,0.3)_0%,rgba(5,6,8,0.95)_80%]" />

          {/* Kapak Üst Bilgisi (Masthead Metadata) */}
          <header className="relative z-10 flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-amber-400 font-mono text-[10px] tracking-widest uppercase">
                {spread1.vol}
              </span>
              <span className="text-xs font-mono tracking-[0.2em] text-neutral-400 uppercase hidden sm:inline">
                {spread1.edition}
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                {spread1.location}
              </span>
            </div>
          </header>

          {/* Kapak Gövdesi: Tipografi ve Heykelsi Vitrin */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center my-auto">
            {/* Sol: Büyük Tipografik Başlık */}
            <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-neutral-400 font-mono text-xs tracking-widest uppercase">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{spread1.subtitle}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-light uppercase tracking-tight leading-[1.02] text-neutral-100">
                {spread1.headlinePart1} <br />
                <span className="italic font-serif font-normal text-amber-200/90">
                  {spread1.headlinePart2}
                </span>
              </h1>

              <p className="text-neutral-400 text-sm sm:text-base font-sans max-w-xl leading-relaxed border-l border-amber-400/50 pl-4 py-1">
                {spread1.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => scrollToPage(1)}
                  className="group px-5 py-3 bg-neutral-100 text-neutral-950 font-mono text-xs uppercase tracking-widest hover:bg-amber-300 transition-all flex items-center gap-2 shadow-[2px_2px_0px_#666] cursor-pointer"
                >
                  <span>{spread1.turnPage}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  href={`${langPrefix}/koleksiyon`}
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-3 border border-neutral-700 hover:border-neutral-300 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-all"
                >
                  {spread1.openArchive}
                </Link>
              </div>
            </div>

            {/* Sağ: Hero Specimen Heykel Kartı */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm h-[54vh] sm:h-[60vh] border border-neutral-800 bg-neutral-900/60 p-3 sm:p-4 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] shrink-0">
                <div className="relative w-full h-full overflow-hidden bg-neutral-950">
                  <Image
                    src="/artworks/4107f9b51db8c3dbac92156e1eebba6e.jpg"
                    alt={`${spread1.specimenTitle} — nonvalue jewel`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 460px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                    <div>
                      <span className="font-mono text-[9px] text-amber-400 tracking-widest uppercase block">
                        {spread1.specimenTag}
                      </span>
                      <h2 className="font-serif text-lg text-white font-light">
                        {spread1.specimenTitle}
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-neutral-400">{spread1.specimenWeight}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kapak Alt Bilgisi */}
          <footer className="relative z-10 flex items-center justify-between pt-4 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>{spread1.pageFooter}</span>
            <span className="hidden sm:inline">{spread1.scrollHint}</span>
          </footer>
        </section>

        {/* ============================================================ */}
        {/* SAYFA 02 // SEÇKİ VE HEYKELSİ KOLEKSİYON (SPECIMENS) */}
        {/* ============================================================ */}
        <section
          id="spread-2"
          aria-label={spreads[1]?.title}
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between pt-20 sm:pt-24 pb-16 px-6 sm:px-10 lg:px-14 border-r border-neutral-800/80 bg-neutral-900/95"
        >
          {/* Üst Başlık */}
          <header className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
                {spread2.subtitle}
              </span>
            </div>
            <Link
              href={`${langPrefix}/koleksiyon`}
              onClick={() => soundFx.playClick()}
              className="text-[11px] font-mono tracking-wider text-amber-300 hover:underline flex items-center gap-1 uppercase"
            >
              <span>{spread2.viewAll}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </header>

          {/* 3'lü Heykelsi Eser Grid Seçkisi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center my-auto">
            {/* Eser 1 */}
            <div className="border border-neutral-800 bg-neutral-950 p-4 space-y-3 group hover:border-amber-400/80 transition-all shadow-xl">
              <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
                <Image
                  src="/artworks/4107f9b51db8c3dbac92156e1eebba6e.jpg"
                  alt={spread2.card1.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-neutral-950/80 font-mono text-[9px] px-2 py-0.5 text-neutral-400 border border-neutral-800">
                  REF. {spread2.card1.num}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-white group-hover:text-amber-300 transition-colors">
                  {spread2.card1.title}
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1 line-clamp-2">
                  {spread2.card1.desc}
                </p>
              </div>
              <div className="pt-2.5 mt-2.5 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold">{spread2.card1.purity}</span>
                <span className="text-neutral-400">{spread2.card1.weight}</span>
              </div>
            </div>

            {/* Eser 2 */}
            <div className="border border-neutral-800 bg-neutral-950 p-4 space-y-3 group hover:border-amber-400/80 transition-all shadow-xl">
              <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
                <Image
                  src="/artworks/73b378038d10ce1b9338f05e324efaa2.jpg"
                  alt={spread2.card2.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-neutral-950/80 font-mono text-[9px] px-2 py-0.5 text-neutral-400 border border-neutral-800">
                  REF. {spread2.card2.num}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-white group-hover:text-amber-300 transition-colors">
                  {spread2.card2.title}
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1 line-clamp-2">
                  {spread2.card2.desc}
                </p>
              </div>
              <div className="pt-2.5 mt-2.5 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold">{spread2.card2.purity}</span>
                <span className="text-neutral-400">{spread2.card2.weight}</span>
              </div>
            </div>

            {/* Eser 3 */}
            <div className="border border-neutral-800 bg-neutral-950 p-4 space-y-3 group hover:border-amber-400/80 transition-all shadow-xl">
              <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
                <Image
                  src="/artworks/8d5dfd92ca8a252321fe4766ecad76bc.jpg"
                  alt={spread2.card3.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-neutral-950/80 font-mono text-[9px] px-2 py-0.5 text-neutral-400 border border-neutral-800">
                  REF. {spread2.card3.num}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-white group-hover:text-amber-300 transition-colors">
                  {spread2.card3.title}
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1 line-clamp-2">
                  {spread2.card3.desc}
                </p>
              </div>
              <div className="pt-2.5 mt-2.5 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold">{spread2.card3.purity}</span>
                <span className="text-neutral-400">{spread2.card3.weight}</span>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <footer className="flex items-center justify-between pt-4 border-t border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>{spread2.pageFooter}</span>
            <button
              type="button"
              onClick={() => scrollToPage(2)}
              className="text-neutral-300 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{spread2.nextAction}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </footer>
        </section>

        {/* ============================================================ */}
        {/* SAYFA 03 // SİNEMATİK ATÖLYE & OCAK (THE FORGE) */}
        {/* ============================================================ */}
        <section
          id="spread-3"
          aria-label={spreads[2]?.title}
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between pt-20 sm:pt-24 pb-16 px-6 sm:px-10 lg:px-14 border-r border-neutral-800/80 bg-neutral-950"
        >
          {/* Alev Atmosferi */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Üst Başlık */}
          <header className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
                {spread3.subtitle}
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
              {spread3.tag}
            </span>
          </header>

          {/* Orta Gövde: Atölye Hikayesi ve Büyük Sinematik Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto">
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="font-mono text-xs text-neutral-500 tracking-[0.25em] uppercase">
                {spread3.category}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-neutral-100 font-light leading-tight">
                {spread3.headlinePart1} <br />
                <span className="italic text-amber-400 font-normal">{spread3.headlinePart2}</span>
              </h2>
              <p className="text-neutral-400 text-sm font-sans leading-relaxed">
                {spread3.description}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`${langPrefix}/atolye`}
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-3 bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-amber-300 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{spread3.workshopBtn}</span>
                </Link>
                <Link
                  href={`${langPrefix}/arsiv`}
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-3 border border-neutral-800 hover:border-neutral-400 text-neutral-300 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <span>{spread3.videosBtn}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              <div className="relative h-[38vh] sm:h-[48vh] max-h-[440px] w-full aspect-[16/10] border border-neutral-800 bg-neutral-900 overflow-hidden shadow-2xl group shrink-0">
                <Image
                  src="/artworks/744a7950cff34beaff3f06e308a540a0.jpg"
                  alt="Atölye Döküm İşlemi"
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-110 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono pointer-events-none">
                  <span className="text-neutral-300">{spread3.caption}</span>
                  <span className="px-2 py-0.5 bg-black/60 border border-neutral-700 text-amber-400 text-[10px]">
                    {spread3.liveBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <footer className="flex items-center justify-between pt-4 border-t border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>{spread3.pageFooter}</span>
            <button
              type="button"
              onClick={() => scrollToPage(3)}
              className="text-neutral-300 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{spread3.nextAction}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </footer>
        </section>

        {/* ============================================================ */}
        {/* SAYFA 04 // SANATÇI MANİFESTOSU (MONOLOGUE) */}
        {/* ============================================================ */}
        <section
          id="spread-4"
          aria-label={spreads[3]?.title}
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between pt-20 sm:pt-24 pb-16 px-6 sm:px-10 lg:px-14 border-r border-neutral-800/80 bg-neutral-900/90"
        >
          {/* Üst Başlık */}
          <header className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
              {spread4.subtitle}
            </span>
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
              {spread4.tag}
            </span>
          </header>

          {/* Orta Gövde: Sanatsal İntro ve Alıntı */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto max-w-6xl mx-auto w-full">
            {/* Sol: Sanatçı Portresi */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[280px] h-[46vh] sm:h-[52vh] max-h-[460px] aspect-[3/4] border border-neutral-700 bg-neutral-950 p-2 shadow-xl shrink-0">
                <div className="relative w-full h-[88%] overflow-hidden bg-neutral-900">
                  <Image
                    src="/artworks/3fbff7e749e7081a72a2b949196c7ab1.jpg"
                    alt="Derin Buse Demirkaya — Sanatçı Portresi ve Atölye"
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    className="object-cover filter grayscale contrast-125"
                  />
                  <div className="absolute inset-0 bg-neutral-950/20 pointer-events-none" />
                </div>
                <div className="text-center pt-2 pointer-events-none">
                  <span className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase">
                    {spread4.artistName}
                  </span>
                </div>
              </div>
            </div>

            {/* Sağ: Manifestik Metin */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <blockquote className="font-serif text-2xl sm:text-4xl text-neutral-100 font-light leading-snug">
                {spread4.quote}
                <span className="text-amber-300 italic">{spread4.quoteHighlight}</span>
                {spread4.quoteEnd}
              </blockquote>

              <p className="text-neutral-400 text-sm sm:text-base font-sans leading-relaxed border-l-2 border-amber-400/60 pl-5">
                {spread4.manifesto}
              </p>

              <div className="pt-2 flex items-center gap-4 font-mono text-xs">
                <Link
                  href={`${langPrefix}/hakkinda`}
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2.5 bg-neutral-100 text-neutral-950 hover:bg-amber-300 transition-colors uppercase tracking-widest font-bold"
                >
                  {spread4.readBio}
                </Link>
                <Link
                  href={`${langPrefix}/iletisim`}
                  onClick={() => soundFx.playClick()}
                  className="text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>{spread4.visitStudio}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <footer className="flex items-center justify-between pt-4 border-t border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>{spread4.pageFooter}</span>
            <button
              type="button"
              onClick={() => scrollToPage(4)}
              className="text-neutral-300 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{spread4.nextAction}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </footer>
        </section>

        {/* ============================================================ */}
        {/* SAYFA 05 // DERGİ KOLOFONU VE ARŞİV (COLOPHON) */}
        {/* ============================================================ */}
        <section
          id="spread-5"
          aria-label={spreads[4]?.title}
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between pt-20 sm:pt-24 pb-16 px-6 sm:px-10 lg:px-14 border-r border-neutral-800/80 bg-neutral-950"
        >
          {/* Üst Başlık */}
          <header className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
              {spread5.subtitle}
            </span>
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
              {spread5.copyright}
            </span>
          </header>

          {/* Orta Gövde: Dergi Kolofon Tablosu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto max-w-5xl mx-auto w-full">
            {/* Sütun 1: Tipografi ve Tasarım */}
            <div className="border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
              <span className="font-mono text-xs text-amber-400 tracking-widest uppercase block">
                {spread5.col1Title}
              </span>
              <ul className="space-y-2 font-mono text-xs text-neutral-400">
                <li><strong className="text-neutral-200">{spread5.col1Items.headings}</strong> {spread5.col1Items.headingsVal}</li>
                <li><strong className="text-neutral-200">{spread5.col1Items.body}</strong> {spread5.col1Items.bodyVal}</li>
                <li><strong className="text-neutral-200">{spread5.col1Items.catalog}</strong> {spread5.col1Items.catalogVal}</li>
                <li><strong className="text-neutral-200">{spread5.col1Items.layout}</strong> {spread5.col1Items.layoutVal}</li>
              </ul>
            </div>

            {/* Sütun 2: Atölye ve İletişim */}
            <div className="border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
              <span className="font-mono text-xs text-amber-400 tracking-widest uppercase block">
                {spread5.col2Title}
              </span>
              <p className="font-mono text-xs text-neutral-400 leading-relaxed whitespace-pre-line">
                {spread5.col2Text}
              </p>
              <div className="pt-2">
                <Link
                  href={`${langPrefix}/iletisim`}
                  onClick={() => soundFx.playClick()}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-300 hover:underline uppercase"
                >
                  <span>{spread5.col2Btn}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Sütun 3: Hızlı Gezinme */}
            <div className="border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
              <span className="font-mono text-xs text-amber-400 tracking-widest uppercase block">
                {spread5.col3Title}
              </span>
              <div className="flex flex-col gap-2 font-mono text-xs">
                <Link
                  href={`${langPrefix}/koleksiyon`}
                  onClick={() => soundFx.playClick()}
                  className="text-neutral-300 hover:text-white hover:underline flex items-center justify-between"
                >
                  <span>{spread5.col3Items.collection}</span>
                  <span>{spread5.col3Items.collectionCount}</span>
                </Link>
                <Link
                  href={`${langPrefix}/arsiv`}
                  onClick={() => soundFx.playClick()}
                  className="text-neutral-300 hover:text-white hover:underline flex items-center justify-between"
                >
                  <span>{spread5.col3Items.archive}</span>
                  <span>{spread5.col3Items.archiveCount}</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => soundFx.playClick()}
                  className="text-amber-400 hover:underline flex items-center justify-between"
                >
                  <span>{spread5.col3Items.studio}</span>
                  <span>{spread5.col3Items.studioAction}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Kolofon Altı: Başa Sar Butonu */}
          <footer className="flex items-center justify-between pt-4 border-t border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>{spread5.pageFooter}</span>
            <button
              type="button"
              onClick={() => scrollToPage(0)}
              className="px-3 py-1 bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-amber-400 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{spread5.backToStart}</span>
            </button>
          </footer>
        </section>
      </div>

      {/* 
        ALT PANEL: EDİTORYAL DERGİ İNDİKATÖRÜ VE İLERLEME ÇUBUĞU
        - Sayfa numaraları (01 / 02 / 03 / 04 / 05)
        - Doğrudan sayfa tıklaması ve ses efekti
        - Sağ dikey menüden `pr-24` ile izole
      */}
      <div className="fixed bottom-0 left-0 right-20 sm:right-24 z-40 bg-neutral-950/80 backdrop-blur-md border-t border-neutral-800/80 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs font-mono select-none">
        {/* Sol: İleri / Geri Kontrolleri */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToPage(activePageIndex - 1)}
            disabled={activePageIndex === 0}
            title={controls.prev}
            aria-label={controls.pageLabel}
            className="p-1.5 border border-neutral-800 hover:border-neutral-500 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToPage(activePageIndex + 1)}
            disabled={activePageIndex === spreads.length - 1}
            title={controls.next}
            aria-label={controls.nextLabel}
            className="p-1.5 border border-neutral-800 hover:border-neutral-500 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-neutral-400 ml-2 hidden md:inline">
            {spreads[activePageIndex]?.title}
          </span>
        </div>

        {/* Orta: Sayfa Düğümleri */}
        <div className="flex items-center gap-1 sm:gap-2">
          {spreads.map((spread, index) => {
            const isActive = activePageIndex === index;
            return (
              <button
                key={spread.id}
                type="button"
                onClick={() => scrollToPage(index)}
                aria-label={`Sayfa ${spread.num}: ${spread.title}`}
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-mono tracking-wider transition-all rounded-xs cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {spread.num}
              </button>
            );
          })}
        </div>

        {/* Sağ: İlerleme Yüzdesi */}
        <div className="flex items-center gap-3">
          <div className="w-16 sm:w-24 h-1 bg-neutral-800 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-neutral-500 font-mono w-8 text-right">
            %{Math.round(scrollProgress)}
          </span>
        </div>
      </div>
    </main>
  );
}
