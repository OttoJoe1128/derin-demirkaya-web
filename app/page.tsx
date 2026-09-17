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
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';
import VerticalNavigation from '@/components/VerticalNavigation';

interface EditorialSpread {
  id: string;
  num: string;
  title: string;
  category: string;
}

const SPREADS: EditorialSpread[] = [
  { id: 'spread-1', num: '01', title: 'Kapak & Manifesto', category: 'Prologue' },
  { id: 'spread-2', num: '02', title: 'Heykelsi Seçki', category: 'Specimens' },
  { id: 'spread-3', num: '03', title: 'Ocak & Atölye', category: 'The Forge' },
  { id: 'spread-4', num: '04', title: 'Sanatçı Monoloğu', category: 'Monologue' },
  { id: 'spread-5', num: '05', title: 'Kolofon & Arşiv', category: 'Colophon' },
];

export default function EditorialMagazinePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Belirli bir sayfaya yumuşakça kaydırma
  const scrollToPage = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const clampedIndex = Math.max(0, Math.min(SPREADS.length - 1, index));
    const targetX = clampedIndex * window.innerWidth;
    scrollContainerRef.current.scrollTo({
      left: targetX,
      behavior: 'smooth',
    });
    setActivePageIndex(clampedIndex);
    soundFx.playClick();
  }, []);

  // KURAL 1: Yatay Dergi Akışı (Fare Tekerleğini Dikeyden Yataya Çevirme)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Dikey fare tekerleği hareketini yatay dergi kaydırmasına çevirir
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

  return (
    <main
      id="editorial-magazine-viewport"
      className="relative w-screen h-screen overflow-hidden bg-neutral-950 text-neutral-100 select-none font-sans"
    >
      {/* 
        KURAL 2 & 4: Sabit Sağ Kenar Dikey Navigasyonu
        - Main içerik sağdan `pr-20 sm:pr-24` ile korunur, hiçbir metin bu sütunun altında ezilmez.
      */}
      <VerticalNavigation />

      {/* 
        KURAL 1: YATAY DERGİ SARGISI (Horizontal Scroll Track)
        - 100vh boyunda, overflow-y-hidden, snap-x snap-mandatory
        - Her bir sayfa tam 100vw genişliğinde
      */}
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
          aria-label="Sayfa 01: Dergi Kapağı ve Manifesto"
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-r border-neutral-800/80 bg-neutral-950"
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
                VOL. 08 // 2026
              </span>
              <span className="text-xs font-mono tracking-[0.2em] text-neutral-400 uppercase hidden sm:inline">
                EDITORIAL MAGAZINE EDITION
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                KARAKÖY • İSTANBUL // LAT 41.025° N
              </span>
            </div>
          </header>

          {/* Kapak Gövdesi: Tipografi ve Heykelsi Vitrin */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center my-auto">
            {/* Sol: Büyük Tipografik Başlık */}
            <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-neutral-400 font-mono text-xs tracking-widest uppercase">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>KAYIP MUM (CIRE-PERDUE) DÖKÜM ARŞİVİ</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-light uppercase tracking-tight leading-[1.02] text-neutral-100">
                Formun Ötesinde, <br />
                <span className="italic font-serif font-normal text-amber-200/90">
                  Ateşin İzinde.
                </span>
              </h1>

              <p className="text-neutral-400 text-sm sm:text-base font-sans max-w-xl leading-relaxed border-l border-amber-400/50 pl-4 py-1">
                Kusursuzluğun seri üretim tekdüzeliğine karşı; 1000°C ocak alevinde eriyen 925K ham gümüşün kontrolsüz organik heykeltıraşlığı.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => scrollToPage(1)}
                  className="group px-5 py-3 bg-neutral-100 text-neutral-950 font-mono text-xs uppercase tracking-widest hover:bg-amber-300 transition-all flex items-center gap-2 shadow-[2px_2px_0px_#666]"
                >
                  <span>Sayfayı Çevir</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  href="/koleksiyon"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-3 border border-neutral-700 hover:border-neutral-300 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-all"
                >
                  Tüm Arşivi Aç
                </Link>
              </div>
            </div>

            {/* Sağ: Hero Specimen Heykel Kartı */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm aspect-[4/5] border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="relative w-full h-full overflow-hidden bg-neutral-950">
                  <Image
                    src="/artworks/8d5dfd92ca8a252321fe4766ecad76bc.jpg"
                    alt="Derin Demirkaya — Girdap Yüzük"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="font-mono text-[9px] text-amber-400 tracking-widest uppercase block">
                        SPECIMEN 01 // 925K
                      </span>
                      <h2 className="font-serif text-lg text-white font-light">
                        Girdap Form Heykel Yüzük
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-neutral-400">18.4 gr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kapak Alt Bilgisi */}
          <footer className="relative z-10 flex items-center justify-between pt-4 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>SAYFA 01 // 05 — PROLOGUE</span>
            <span className="hidden sm:inline">KAYDIRIN VEYA TEKERLEĞİ ÇEVİRİN →</span>
          </footer>
        </section>

        {/* ============================================================ */}
        {/* SAYFA 02 // SEÇKİ VE HEYKELSİ KOLEKSİYON (SPECIMENS) */}
        {/* ============================================================ */}
        <section
          id="spread-2"
          aria-label="Sayfa 02: Heykelsi Takı Seçkisi"
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-r border-neutral-800/80 bg-neutral-900/95"
        >
          {/* Üst Başlık */}
          <header className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
                02 // CURATED SPECIMENS — HAM FORM KOLEKSİYONU
              </span>
            </div>
            <Link
              href="/koleksiyon"
              onClick={() => soundFx.playClick()}
              className="text-[11px] font-mono tracking-wider text-amber-300 hover:underline flex items-center gap-1 uppercase"
            >
              <span>Tümünü Gör (18 Eser)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </header>

          {/* Çift Sayfa Düzeni: Eser Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 my-auto">
            {/* Eser 1 */}
            <div className="group border border-neutral-800 bg-neutral-950 p-4 flex flex-col justify-between hover:border-amber-400/50 transition-colors">
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-900 mb-3">
                <Image
                  src="/artworks/8d5dfd92ca8a252321fe4766ecad76bc.jpg"
                  alt="Girdap Yüzük"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
                  NV-2024-001 // YÜZÜK
                </span>
                <h3 className="font-serif text-base text-neutral-100 group-hover:text-amber-300 transition-colors">
                  Girdap Organik Form
                </h3>
                <p className="text-neutral-400 text-xs line-clamp-2">
                  Kayıp mum tekniğinde serbest eriyen akışkan magma katmanları.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold">925 Ayar</span>
                <span className="text-neutral-400">18.40 gr</span>
              </div>
            </div>

            {/* Eser 2 */}
            <div className="group border border-neutral-800 bg-neutral-950 p-4 flex flex-col justify-between hover:border-amber-400/50 transition-colors">
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-900 mb-3">
                <Image
                  src="/artworks/e259e89d1469e0ee99ee51082531c3bf.jpg"
                  alt="Likit Krater Bileklik"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
                  NV-2024-003 // BİLEKLİK
                </span>
                <h3 className="font-serif text-base text-neutral-100 group-hover:text-amber-300 transition-colors">
                  Likit Krater Kelepçe
                </h3>
                <p className="text-neutral-400 text-xs line-clamp-2">
                  Ateş şoku ve asit karartmasıyla oluşan derin doğal gözenekler.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold">925 Ayar</span>
                <span className="text-neutral-400">42.10 gr</span>
              </div>
            </div>

            {/* Eser 3 */}
            <div className="group border border-neutral-800 bg-neutral-950 p-4 flex flex-col justify-between hover:border-amber-400/50 transition-colors">
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-900 mb-3">
                <Image
                  src="/artworks/744a7950cff34beaff3f06e308a540a0.jpg"
                  alt="Mekansal Sarkıt Kolye"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
                  NV-2023-012 // HEYKEL-KOLYE
                </span>
                <h3 className="font-serif text-base text-neutral-100 group-hover:text-amber-300 transition-colors">
                  Mekansal Sarkıt Kolye
                </h3>
                <p className="text-neutral-400 text-xs line-clamp-2">
                  Döküm artığı damlacıkların gövdede bilerek dondurulduğu anıt form.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold">925 Ayar</span>
                <span className="text-neutral-400">28.70 gr</span>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <footer className="flex items-center justify-between pt-4 border-t border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>SAYFA 02 // 05 — HEYKELSİ SEÇKİ</span>
            <button
              type="button"
              onClick={() => scrollToPage(2)}
              className="text-neutral-300 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Atölye Sayfasına Geç</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </footer>
        </section>

        {/* ============================================================ */}
        {/* SAYFA 03 // SİNEMATİK ATÖLYE & OCAK (THE FORGE) */}
        {/* ============================================================ */}
        <section
          id="spread-3"
          aria-label="Sayfa 03: Atölye ve Döküm Süreci"
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-r border-neutral-800/80 bg-neutral-950"
        >
          {/* Alev Atmosferi */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Üst Başlık */}
          <header className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
                03 // METALLURGICAL ATELIER — 1000°C DÖKÜM OCAĞI
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
              SES & VİDEO ARŞİVİ
            </span>
          </header>

          {/* Orta Gövde: Atölye Hikayesi ve Büyük Sinematik Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto">
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="font-mono text-xs text-neutral-500 tracking-[0.25em] uppercase">
                ZANAAT VE DEĞİŞİM
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-neutral-100 font-light leading-tight">
                Ateş, Balmumu <br />
                <span className="italic text-amber-400 font-normal">& Çekiç İzleri.</span>
              </h2>
              <p className="text-neutral-400 text-sm font-sans leading-relaxed">
                Her parça, Karaköy atölyesinde tek tek elle oyulan mum kalıpların ocakta eritilip yerine 925 ayar akkor gümüş akıtılmasıyla doğar. İki parçanın birbirinin aynı olması imkansızdır.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/atolye"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-3 bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-amber-300 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Atölye Seansları & Randevu</span>
                </Link>
                <Link
                  href="/arsiv"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-3 border border-neutral-800 hover:border-neutral-400 text-neutral-300 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <span>Süreç Videoları</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[16/9] w-full border border-neutral-800 bg-neutral-900 overflow-hidden shadow-2xl group">
                <Image
                  src="/artworks/744a7950cff34beaff3f06e308a540a0.jpg"
                  alt="Atölye Döküm İşlemi"
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-110 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-300">Karaköy Stüdyo Potası // 1000°C Akış</span>
                  <span className="px-2 py-0.5 bg-black/60 border border-neutral-700 text-amber-400 text-[10px]">
                    CANLI ARŞİV
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <footer className="flex items-center justify-between pt-4 border-t border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>SAYFA 03 // 05 — OCAK VE ATÖLYE</span>
            <button
              type="button"
              onClick={() => scrollToPage(3)}
              className="text-neutral-300 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Sanatçı Monoloğuna Geç</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </footer>
        </section>

        {/* ============================================================ */}
        {/* SAYFA 04 // SANATÇI MANİFESTOSU (MONOLOGUE) */}
        {/* ============================================================ */}
        <section
          id="spread-4"
          aria-label="Sayfa 04: Sanatçı Manifestosu ve Portre"
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-r border-neutral-800/80 bg-neutral-900/90"
        >
          {/* Üst Başlık */}
          <header className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
              04 // ARTIST MONOLOGUE — DERİN BUSE DEMİRKAYA
            </span>
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
              İZMİR DOKUZ EYLÜL GSF // 2018–2025
            </span>
          </header>

          {/* Orta Gövde: Sanatsal İntro ve Alıntı */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto max-w-6xl mx-auto w-full">
            {/* Sol: Portre veya Eskiz */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 sm:w-72 aspect-[3/4] border border-neutral-700 bg-neutral-950 p-2 shadow-xl">
                <div className="relative w-full h-full overflow-hidden bg-neutral-900">
                  <Image
                    src="/artworks/8d5dfd92ca8a252321fe4766ecad76bc.jpg"
                    alt="Sanatçı Portresi ve Dokusu"
                    fill
                    sizes="300px"
                    className="object-cover filter grayscale contrast-125"
                  />
                  <div className="absolute inset-0 bg-neutral-950/20" />
                </div>
                <div className="text-center pt-2">
                  <span className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase">
                    DERİN BUSE DEMİRKAYA
                  </span>
                </div>
              </div>
            </div>

            {/* Sağ: Manifestik Metin */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <blockquote className="font-serif text-2xl sm:text-4xl text-neutral-100 font-light leading-snug">
                &ldquo;Takı bir süs nesnesi değildir; tenin kıvrımlarına yerleşen, sahibinin hareketiyle soluk alıp veren taşınabilir bir <span className="text-amber-300 italic">mekansal heykeldir</span>.&rdquo;
              </blockquote>

              <p className="text-neutral-400 text-sm sm:text-base font-sans leading-relaxed border-l-2 border-amber-400/60 pl-5">
                <strong className="text-neutral-200">nonvalue</strong> ismi, değerin piyasa fiyatında veya kusursuz cilada değil; ateşin bıraktığı organik korozyonda, metalin ağırlığında ve zamanın ten üzerinde bıraktığı patinada gizli olduğuna duyulan inançtan doğmuştur.
              </p>

              <div className="pt-2 flex items-center gap-4 font-mono text-xs">
                <Link
                  href="/hakkinda"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2.5 bg-neutral-100 text-neutral-950 hover:bg-amber-300 transition-colors uppercase tracking-widest font-bold"
                >
                  Biyografiyi Oku
                </Link>
                <Link
                  href="/iletisim"
                  onClick={() => soundFx.playClick()}
                  className="text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>Atölyede Ziyaret Et</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <footer className="flex items-center justify-between pt-4 border-t border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>SAYFA 04 // 05 — SANATÇI MONOLOĞU</span>
            <button
              type="button"
              onClick={() => scrollToPage(4)}
              className="text-neutral-300 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Kolofona Geç</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </footer>
        </section>

        {/* ============================================================ */}
        {/* SAYFA 05 // DERGİ KOLOFONU VE ARŞİV (COLOPHON) */}
        {/* ============================================================ */}
        <section
          id="spread-5"
          aria-label="Sayfa 05: Dergi Kolofonu ve İletişim"
          className="w-screen h-screen flex-shrink-0 snap-start relative overflow-hidden pr-20 sm:pr-24 flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-r border-neutral-800/80 bg-neutral-950"
        >
          {/* Üst Başlık */}
          <header className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
              05 // COLOPHON & ARCHIVE INDEX — BASKI VE ERİŞİM
            </span>
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
              COPYRIGHT © 2018–2026
            </span>
          </header>

          {/* Orta Gövde: Dergi Kolofon Tablosu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto max-w-5xl mx-auto w-full">
            {/* Sütun 1: Tipografi ve Tasarım */}
            <div className="border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
              <span className="font-mono text-xs text-amber-400 tracking-widest uppercase block">
                [ 01 // TİPOGRAFİ & MİMARİ ]
              </span>
              <ul className="space-y-2 font-mono text-xs text-neutral-400">
                <li><strong className="text-neutral-200">Başlıklar:</strong> Playfair Display Editorial</li>
                <li><strong className="text-neutral-200">Gövde:</strong> Inter Display</li>
                <li><strong className="text-neutral-200">Katalog:</strong> JetBrains Mono</li>
                <li><strong className="text-neutral-200">Düzen:</strong> Yatay Dijital Dergi</li>
              </ul>
            </div>

            {/* Sütun 2: Atölye ve İletişim */}
            <div className="border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
              <span className="font-mono text-xs text-amber-400 tracking-widest uppercase block">
                [ 02 // ATÖLYE & TEMAS ]
              </span>
              <p className="font-mono text-xs text-neutral-400 leading-relaxed">
                Karaköy Studio // Kemankeş Mah. Beyoğlu, İstanbul.
                <br />
                Kişiye özel döküm ve koleksiyon randevuları için:
              </p>
              <div className="pt-2">
                <Link
                  href="/iletisim"
                  onClick={() => soundFx.playClick()}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-300 hover:underline uppercase"
                >
                  <span>Randevu Talep Formu</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Sütun 3: Hızlı Gezinme */}
            <div className="border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
              <span className="font-mono text-xs text-amber-400 tracking-widest uppercase block">
                [ 03 // DİJİTAL ARŞİV ]
              </span>
              <div className="flex flex-col gap-2 font-mono text-xs">
                <Link
                  href="/koleksiyon"
                  onClick={() => soundFx.playClick()}
                  className="text-neutral-300 hover:text-white hover:underline flex items-center justify-between"
                >
                  <span>Tüm Koleksiyon</span>
                  <span>18 Eser →</span>
                </Link>
                <Link
                  href="/arsiv"
                  onClick={() => soundFx.playClick()}
                  className="text-neutral-300 hover:text-white hover:underline flex items-center justify-between"
                >
                  <span>Döküm Video Arşivi</span>
                  <span>12 Kayıt →</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => soundFx.playClick()}
                  className="text-amber-400 hover:underline flex items-center justify-between"
                >
                  <span>Sanatçı Stüdyosu (CMS)</span>
                  <span>Giriş →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Kolofon Altı: Başa Sar Butonu */}
          <footer className="flex items-center justify-between pt-4 border-t border-neutral-800 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>SAYFA 05 // 05 — SON</span>
            <button
              type="button"
              onClick={() => scrollToPage(0)}
              className="px-3 py-1 bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-amber-400 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>En Başa Dön (Kapak)</span>
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
            title="Önceki Sayfa (Sol Ok)"
            aria-label="Önceki Dergi Sayfası"
            className="p-1.5 border border-neutral-800 hover:border-neutral-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToPage(activePageIndex + 1)}
            disabled={activePageIndex === SPREADS.length - 1}
            title="Sonraki Sayfa (Sağ Ok)"
            aria-label="Sonraki Dergi Sayfası"
            className="p-1.5 border border-neutral-800 hover:border-neutral-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-neutral-400 ml-2 hidden md:inline">
            {SPREADS[activePageIndex]?.title}
          </span>
        </div>

        {/* Orta: Sayfa Düğümleri */}
        <div className="flex items-center gap-1 sm:gap-2">
          {SPREADS.map((spread, index) => {
            const isActive = activePageIndex === index;
            return (
              <button
                key={spread.id}
                type="button"
                onClick={() => scrollToPage(index)}
                aria-label={`Sayfa ${spread.num}: ${spread.title}`}
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-mono tracking-wider transition-all rounded-xs ${
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
