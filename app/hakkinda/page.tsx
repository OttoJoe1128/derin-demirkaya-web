'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, Compass, Flame, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';

export default function HakkindaPage() {
  const { language } = useLanguage();
  const isEn = language === 'EN';
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Dikeyden Yataya Scroll Mapping (Framer Motion)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 144Hz pürüzsüz yay fiziği (Yatay eksende süzülme)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 36,
    restDelta: 0.001,
  });

  // 3 Panel: 0% -> -66.666% (300vw genişlikteki şeridi tam 2 ekran sola kaydırarak 3. paneli kilitler)
  const xTranslate = useTransform(smoothProgress, [0, 1], ['0%', '-66.666%']);
  const progressBarWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  const exhibitions = [
    { year: '2025', title: 'nonvalue', venue: 'bazaar shop | Hormoz Island', location: 'Iran' },
    { year: '2024', title: 'nonvalue', venue: 'pop-up bazaar | Chiskari Community', location: 'Tbilisi • Georgia' },
    { year: '2024', title: 'nonvalue', venue: 'art fair | Alan Pa', location: 'İzmir • Turkey' },
    { year: '2024', title: 'selflove', venue: 'solo exhibition | Tozman bazaar', location: 'Eskişehir • Turkey' },
    { year: '2022', title: 'not a jewelry', venue: 'exhibition ARA | Co-Operative Community', location: 'Eskişehir • Turkey' },
    { year: '2019', title: 'eat w what', venue: 'art gallery | Cumhuriyet Müzesi', location: 'İstanbul • Turkey' },
    { year: '2018', title: 'just jewel', venue: 'group exhibition | Hochschule Düsseldorf', location: 'Düsseldorf • Germany' },
    { year: '2017', title: 'amorph.', venue: 'group exhibition | Marmara University', location: 'İstanbul • Turkey' },
  ];

  const education = isEn
    ? [
        {
          period: '2015 – 2021',
          institution: 'Marmara University',
          degree: 'Bachelor in School of Jewelry Technology and Design | Silver & Metalworks',
          location: 'İstanbul | Turkey',
        },
        {
          period: '2018 – 2019',
          institution: 'HSD • Hochschule Düsseldorf',
          degree: 'Erasmus | Jewelry & Applied and Design Program',
          location: 'Düsseldorf | Germany',
        },
        {
          period: '2017 – 2018',
          institution: 'Dilde Gümüş • Kapalıçarşı (Grand Bazaar) Apprenticeship',
          degree: 'Traditional Jewelry Craftsmanship | Silverwork & Hand Engraving',
          location: 'İstanbul | Turkey',
        },
        {
          period: '2015 – 2016',
          institution: 'İKO GLT • Gemologist Laboratory',
          degree: 'Diamond & Colored Stones Identification Certificate',
          location: 'İstanbul | Turkey',
        },
      ]
    : [
        {
          period: '2015 – 2021',
          institution: 'Marmara Üniversitesi',
          degree: 'Takı Teknolojisi ve Tasarımı Yüksekokulu | Gümüş ve Metal İşleri',
          location: 'İstanbul | Türkiye',
        },
        {
          period: '2018 – 2019',
          institution: 'HSD • Hochschule Düsseldorf',
          degree: 'Erasmus | Çağdaş Takı & Uygulamalı Tasarım Programı',
          location: 'Düsseldorf | Almanya',
        },
        {
          period: '2017 – 2018',
          institution: 'Dilde Gümüş • Kapalıçarşı Çıraklık & Ustalık Eğitimi',
          degree: 'Geleneksel Kuyumculuk Zanaatı | Sadekar & Gravür Eğitimi',
          location: 'İstanbul | Türkiye',
        },
        {
          period: '2015 – 2016',
          institution: 'İKO GLT • Gemoloji Laboratuvarı',
          degree: 'Pırlanta & Renkli Taş Tanıma ve Derecelendirme Sertifikası',
          location: 'İstanbul | Türkiye',
        },
      ];

  return (
    <main className="bg-neutral-950 text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 font-sans">
      {/* ========================================================================= */}
      {/* MASAÜSTÜ: 350vh Dikey Scroll ile Yatay Editoryal Akış (Horizontal Spread) */}
      {/* ========================================================================= */}
      <div ref={containerRef} className="hidden lg:block relative h-[360vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-neutral-950 flex flex-col justify-between">
          {/* Üst Editoryal Durum Çubuğu (Persistent Header) */}
          <header className="h-16 px-10 border-b border-neutral-800/80 flex items-center justify-between z-40 bg-neutral-950/90 backdrop-blur-md shrink-0">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="group inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>{isEn ? 'Archive Monograph' : 'Arşiv Monografisi'}</span>
            </Link>

            <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              <span className="hidden xl:inline text-neutral-500">
                {isEn ? 'CURATED ATELIER ARCHIVE' : 'KÜRETE EDİLMİŞ ATÖLYE ARŞİVİ'}
              </span>
              <span className="text-neutral-600">{"//"}</span>
              <span className="text-amber-400 font-semibold">DERİN BUSE DEMİRKAYA</span>
              <span className="text-neutral-600">{"//"}</span>
              <span className="text-neutral-300">2018 — 2026</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                {isEn ? 'Scroll down to slide →' : 'Aşağı kaydırarak akıtın →'}
              </span>
              <div className="w-24 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-400 origin-left"
                  style={{ width: progressBarWidth }}
                />
              </div>
            </div>
          </header>

          {/* Yatay Eksende Kayan 3 Panelli Gövde (300vw) */}
          <div className="flex-1 w-full overflow-hidden relative">
            <motion.div
              style={{ x: xTranslate }}
              className="flex flex-row h-full w-[300vw] will-change-transform"
            >
              {/* ======================================================= */}
              {/* PANEL 01: KAPAK (COVER SPREAD)                          */}
              {/* ======================================================= */}
              <section className="w-screen h-full shrink-0 border-r border-neutral-800/80 p-10 xl:p-14 flex flex-col justify-between relative bg-neutral-950">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 border border-amber-400/40 bg-amber-400/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300 font-semibold">
                      {isEn ? 'Monograph Issue 01' : 'Monografi Sayı 01'}
                    </span>
                  </div>

                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
                    İZMİR • KAPALIÇARŞI • DÜSSELDORF
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-10 items-center my-auto">
                  {/* Sanatçı Devasa Tipografi */}
                  <div className="col-span-7 space-y-6">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400 block">
                      {isEn ? 'Artist & Contemporary Sculptor' : 'Sanatçı & Çağdaş Heykeltıraş'}
                    </span>
                    <h1 className="font-serif text-6xl xl:text-8xl 2xl:text-9xl text-white uppercase tracking-tighter leading-[0.88]">
                      Derin Buse <br />
                      <span className="italic font-light text-neutral-400">Demirkaya</span>
                    </h1>
                    <p className="font-sans text-sm xl:text-base text-neutral-400 max-w-xl font-light leading-relaxed border-l border-neutral-700 pl-5">
                      {isEn
                        ? 'Founder of nonvalue jewel. Exploring the visceral, sculptural, and unassigned value of silver, fire, raw minerals, and salvaged organic matter.'
                        : 'nonvalue jewel kurucusu. Gümüşün, ateşin, ham minerallerin ve doğadan toplanmış atık maddelerin biçimsel ve dokunsal potansiyelini araştıran çağdaş pratik.'}
                    </p>
                  </div>

                  {/* Ham/Minimalist Stüdyo Fotoğrafı */}
                  <div className="col-span-5 flex justify-center">
                    <div className="relative w-full max-w-[360px] aspect-[3/4] border border-neutral-800 bg-neutral-900/90 p-3 shadow-2xl group">
                      <div className="relative w-full h-[88%] overflow-hidden bg-neutral-950">
                        <Image
                          src="/artworks/3fbff7e749e7081a72a2b949196c7ab1.jpg"
                          alt="Derin Buse Demirkaya Atelier"
                          fill
                          sizes="400px"
                          referrerPolicy="no-referrer"
                          className="object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-neutral-950/20 pointer-events-none" />
                      </div>
                      <div className="pt-2.5 flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                        <span>ATELIER PORTRAIT</span>
                        <span className="text-amber-400">FIG. 01</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alt İpucu */}
                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  <span>SPREAD 01 // OVERVIEW</span>
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <Compass className="w-3 h-3 text-amber-400 animate-spin" />
                    {isEn ? 'Scroll down to advance to Manifesto →' : 'Aşağı kaydırarak Manifestoya geçin →'}
                  </span>
                </div>
              </section>

              {/* ======================================================= */}
              {/* PANEL 02: MANİFESTO & FELSEFE (COLUMNS SPREAD)          */}
              {/* ======================================================= */}
              <section className="w-screen h-full shrink-0 border-r border-neutral-800/80 p-10 xl:p-14 flex flex-col justify-between relative bg-neutral-900/60 backdrop-blur-xs">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-300">
                    SPREAD 02 // MANIFESTO & PHILOSOPHY
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                    TRANSFORMATIVE FORCE OF FIRE
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-10 items-center my-auto">
                  {/* Sol Sütun: Görsel ve Alıntı */}
                  <div className="col-span-4 space-y-6">
                    <div className="relative aspect-square w-full max-w-[320px] border border-neutral-800 bg-neutral-950 p-2 shadow-xl">
                      <div className="relative w-full h-full overflow-hidden">
                        <Image
                          src="/artworks/744a7950cff34beaff3f06e308a540a0.jpg"
                          alt="Atölye Döküm İşlemi"
                          fill
                          sizes="350px"
                          referrerPolicy="no-referrer"
                          className="object-cover filter contrast-110 brightness-90"
                        />
                      </div>
                    </div>

                    <blockquote className="font-serif text-xl xl:text-2xl text-neutral-100 font-light leading-snug border-l-2 border-amber-400 pl-4">
                      &ldquo;nonvalue is a contemporary jewelry practice that seeks to reveal what has not yet been assigned value.&rdquo;
                    </blockquote>
                  </div>

                  {/* Sağ Sütun: Dergi Tipi Çoklu Sütun Metni */}
                  <div className="col-span-8 space-y-6">
                    <h2 className="font-serif text-3xl xl:text-5xl text-white uppercase tracking-tight leading-tight">
                      {isEn ? 'The Form of Fire & Situational Sculpture' : 'Ateşin Formu ve Devingen Heykel'}
                    </h2>

                    <div className="columns-2 gap-8 text-xs xl:text-sm font-light text-neutral-300 leading-relaxed space-y-4">
                      {isEn ? (
                        <>
                          <p>
                            Izmir-based artist Derin Buse Demirkaya learned the traditional craft of goldsmithing and metalsmithing under the masters of Istanbul&apos;s historic Grand Bazaar (Kapalıçarşı). After earning her Bachelor&apos;s degree from Marmara University&apos;s School of Jewelry Technology and Design, she continued her academic and artistic journey at Hochschule Düsseldorf in Germany.
                          </p>
                          <p>
                            While initially adopting a disciplined, studio-centric production methodology, her practice gradually evolved into a more exploratory, nomadic, and situational form. Immersing herself in diverse geographies directly informs the materials she encounters and the relationships she builds with them.
                          </p>
                          <p>
                            In addition to natural elements such as raw minerals, cast metals, and organic bone, she reclaims and transforms discarded objects left behind in nature. Her philosophy fuses the meticulous sensitivity of high craft with the narrative resonance of found artifacts, centering on the tactile, visceral, and sculptural potential of the matter.
                          </p>
                          <p>
                            Each wearable specimen serves not as ornamental excess, but as an intimate spatial relic—retaining the memory of extreme heat, melting silver, and deliberate structural imperfections.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            İzmir merkezli sanatçı Derin Buse Demirkaya, geleneksel kuyumculuk zanaatını İstanbul Kapalıçarşı ustalarından öğrendi. Marmara Üniversitesi Takı Teknolojisi ve Tasarımı Bölümü’nden lisans derecesini aldıktan sonra, eğitimini Almanya Hochschule Düsseldorf’ta sürdürdü.
                          </p>
                          <p>
                            İlk başlarda daha disiplinli ve atölye odaklı bir üretim yöntemi benimsemişken, pratiği zaman içinde daha keşifsel ve devingen bir forma evrildi. Farklı coğrafyaları deneyimlemek; karşılaştığı malzemeleri ve onlarla kurduğu ilişkileri derinden şekillendirerek gözlem ve yaratım biçimini besleyen kilit bir unsur haline geldi.
                          </p>
                          <p>
                            Taş, metal ve kemik gibi doğal unsurların yanı sıra, doğada bırakılmış atık materyalleri de dönüştürerek üretir. Yaklaşımı; zanaatın duyarlılığı ile materyallerin anlatı gücünü bir araya getirerek, malzemenin dokunsal ve kavramsal potansiyeline odaklanır.
                          </p>
                          <p>
                            Üretilen her bir takılabilir parça, süs eşyası olmaktan öte; ateşin dönüştürücü kuvvetini, eriyen 925K gümüşün akışkan hafızasını ve bilinçli strüktürel kusurları taşıyan heykelsi bir kalıntıdır.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  <span>SPREAD 02 // ESSAY & PRACTICES</span>
                  <span className="text-neutral-400">PAGE 02 OF 03</span>
                </div>
              </section>

              {/* ======================================================= */}
              {/* PANEL 03: ARŞİV & SERGİ İNDEKSİ (THE INDEX SPREAD)      */}
              {/* ======================================================= */}
              <section className="w-screen h-full shrink-0 p-10 xl:p-14 flex flex-col justify-between relative bg-neutral-950">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-300">
                    SPREAD 03 // ARCHIVE, EXHIBITIONS & PEDAGOGY
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                    INDEX CHRONOLOGY 2015 — 2026
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-10 items-start my-auto">
                  {/* Sol Kolon: Sergiler Listesi */}
                  <div className="col-span-6 space-y-4">
                    <h3 className="font-serif text-2xl text-white uppercase tracking-wider flex items-center gap-2">
                      <span>{isEn ? 'Exhibitions & Biennials' : 'Sergiler & Bienaller'}</span>
                    </h3>

                    <div className="divide-y divide-neutral-800/80 border-t border-b border-neutral-800/80 max-h-[46vh] overflow-y-auto no-scrollbar pr-2">
                      {exhibitions.map((ex, i) => (
                        <div key={i} className="py-2.5 flex items-baseline justify-between text-xs font-mono">
                          <div className="flex items-baseline gap-3">
                            <span className="text-amber-400 font-semibold w-10">{ex.year}</span>
                            <span className="text-white font-medium">{ex.title}</span>
                            <span className="text-neutral-500 text-[11px]">{ex.venue}</span>
                          </div>
                          <span className="text-neutral-400 text-[11px] shrink-0">{ex.location}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sağ Kolon: Eğitim ve Ustalık */}
                  <div className="col-span-6 space-y-4">
                    <h3 className="font-serif text-2xl text-white uppercase tracking-wider flex items-center gap-2">
                      <span>{isEn ? 'Education & Guild Guilds' : 'Eğitim & Ustalık Çıraklığı'}</span>
                    </h3>

                    <div className="space-y-3 max-h-[46vh] overflow-y-auto no-scrollbar pr-2">
                      {education.map((ed, i) => (
                        <div key={i} className="p-3.5 border border-neutral-800 bg-neutral-900/60 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                            <span className="text-amber-400">{ed.period}</span>
                            <span>{ed.location}</span>
                          </div>
                          <h4 className="font-sans text-xs font-semibold text-neutral-200">{ed.institution}</h4>
                          <p className="font-mono text-[11px] text-neutral-400 leading-tight">{ed.degree}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Alt Aksiyonlar & CTA Butonları */}
                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4">
                  <div className="flex items-center gap-4">
                    <Link
                      href="/koleksiyon"
                      onClick={() => soundFx.playClick()}
                      className="px-6 py-2.5 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-colors flex items-center gap-2"
                    >
                      <span>{isEn ? 'View Collection' : 'Koleksiyonu İncele'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href="/atolye"
                      onClick={() => soundFx.playClick()}
                      className="px-5 py-2.5 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isEn ? 'Workshop Calendar' : 'Atölye Takvimi'}</span>
                    </Link>

                    <a
                      href="https://instagram.com/nonvalue_jewel"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFx.playClick()}
                      className="px-4 py-2.5 text-neutral-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>@nonvalue_jewel</span>
                    </a>
                  </div>

                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                    DERİN BUSE DEMİRKAYA — ARCHIVE INDEX FIN.
                  </span>
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. KUSURSUZ MOBİL & TABLET FALLBACK (Dikey Editoryal Akış - lg:hidden)     */}
      {/* ========================================================================= */}
      <div className="lg:hidden min-h-screen py-10 px-5 sm:px-8 space-y-12">
        <Link
          href="/"
          onClick={() => soundFx.playClick()}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back to Home' : 'Ana Sayfaya Dön'}</span>
        </Link>

        {/* Mobil Başlık & Sanatçı İsmi */}
        <div className="space-y-4 border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-amber-400/40 bg-amber-400/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-300 font-semibold">
              {isEn ? 'Artist & Contemporary Sculptor' : 'Sanatçı & Çağdaş Heykeltıraş'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
            Derin Buse <br />
            <span className="italic font-light text-neutral-400">Demirkaya</span>
          </h1>

          <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed border-l-2 border-amber-400/60 pl-3">
            {isEn
              ? 'Founder of nonvalue jewel. Exploring the visceral, sculptural, and unassigned value of silver, fire, raw minerals, and salvaged organic matter.'
              : 'nonvalue jewel kurucusu. Gümüşün, ateşin, ham minerallerin ve doğadan toplanmış atık maddelerin biçimsel ve dokunsal potansiyelini araştıran çağdaş pratik.'}
          </p>
        </div>

        {/* Mobil Görsel */}
        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto border border-neutral-800 bg-neutral-900 p-2 shadow-xl">
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/artworks/3fbff7e749e7081a72a2b949196c7ab1.jpg"
              alt="Derin Buse Demirkaya Atelier"
              fill
              sizes="100vw"
              referrerPolicy="no-referrer"
              className="object-cover filter grayscale contrast-125"
            />
          </div>
        </div>

        {/* Mobil Manifesto */}
        <div className="space-y-6">
          <blockquote className="font-serif text-lg text-neutral-100 font-light leading-snug border-l-2 border-amber-400 pl-4 py-1">
            &ldquo;nonvalue is a contemporary jewelry practice that seeks to reveal what has not yet been assigned value. its production approach is rooted in the transformative force of fire.&rdquo;
          </blockquote>

          <div className="space-y-4 text-xs sm:text-sm font-light text-neutral-300 leading-relaxed">
            {isEn ? (
              <>
                <p>
                  Izmir-based artist Derin Buse Demirkaya learned the traditional craft of goldsmithing and metalsmithing under the masters of Istanbul&apos;s historic Grand Bazaar (Kapalıçarşı). After earning her Bachelor&apos;s degree from Marmara University&apos;s School of Jewelry Technology and Design, she continued her academic and artistic journey at Hochschule Düsseldorf in Germany.
                </p>
                <p>
                  While initially adopting a disciplined, studio-centric production methodology, her practice gradually evolved into a more exploratory, nomadic, and situational form. Immersing herself in diverse geographies directly informs the materials she encounters and the relationships she builds with them.
                </p>
                <p>
                  In addition to natural elements such as raw minerals, cast metals, and organic bone, she reclaims and transforms discarded objects left behind in nature. Her philosophy fuses the meticulous sensitivity of high craft with the narrative resonance of found artifacts.
                </p>
              </>
            ) : (
              <>
                <p>
                  İzmir merkezli sanatçı Derin Buse Demirkaya, geleneksel kuyumculuk zanaatını İstanbul Kapalıçarşı ustalarından öğrendi. Marmara Üniversitesi Takı Teknolojisi ve Tasarımı Bölümü’nden lisans derecesini aldıktan sonra, eğitimini Almanya Hochschule Düsseldorf’ta sürdürdü.
                </p>
                <p>
                  İlk başlarda daha disiplinli ve atölye odaklı bir üretim yöntemi benimsemişken, pratiği zaman içinde daha keşifsel ve devingen bir forma evrildi. Farklı coğrafyaları deneyimlemek; karşılaştığı malzemeleri ve onlarla kurduğu ilişkileri derinden şekillendirerek gözlem ve yaratım biçimini besleyen kilit bir unsur haline geldi.
                </p>
                <p>
                  Taş, metal ve kemik gibi doğal unsurların yanı sıra, doğada bırakılmış atık materyalleri de dönüştürerek üretir. Yaklaşımı; zanaatın duyarlılığı ile materyallerin anlatı gücünü bir araya getirerek, malzemenin dokunsal ve kavramsal potansiyeline odaklanır.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Mobil Sergiler */}
        <div className="space-y-4 border-t border-neutral-800 pt-8">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
            {isEn ? 'Exhibitions & Events' : 'Sergiler & Etkinlikler'}
          </h2>
          <div className="divide-y divide-neutral-800/80 font-mono text-xs">
            {exhibitions.map((ex, i) => (
              <div key={i} className="py-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-semibold">{ex.year}</span>
                  <span className="text-neutral-500 text-[10px]">{ex.location}</span>
                </div>
                <div className="text-neutral-200 font-medium">{ex.title}</div>
                <div className="text-neutral-400 text-[11px]">{ex.venue}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobil Eğitim */}
        <div className="space-y-4 border-t border-neutral-800 pt-8">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
            {isEn ? 'Education & Guild Guilds' : 'Eğitim & Ustalık'}
          </h2>
          <div className="space-y-3 font-mono text-xs">
            {education.map((ed, i) => (
              <div key={i} className="p-3.5 border border-neutral-800 bg-neutral-900/60 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="text-amber-400">{ed.period}</span>
                  <span>{ed.location}</span>
                </div>
                <h4 className="font-sans text-xs font-semibold text-neutral-200">{ed.institution}</h4>
                <p className="text-[11px] text-neutral-400">{ed.degree}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobil CTA */}
        <div className="border-t border-neutral-800 pt-8 space-y-3">
          <Link
            href="/koleksiyon"
            onClick={() => soundFx.playClick()}
            className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-bold text-center block hover:bg-amber-300 transition-colors"
          >
            {isEn ? 'Explore Collection' : 'Koleksiyonu İncele'}
          </Link>
          <Link
            href="/atolye"
            onClick={() => soundFx.playClick()}
            className="w-full py-3.5 border border-neutral-700 text-neutral-200 font-mono text-xs uppercase tracking-widest text-center block hover:border-amber-400 transition-colors"
          >
            {isEn ? 'Workshop Calendar' : 'Atölye Takvimi'}
          </Link>
        </div>
      </div>
    </main>
  );
}
