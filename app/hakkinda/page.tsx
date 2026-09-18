'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, Flame, ExternalLink, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';

export default function HakkindaPage() {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeSpread, setActiveSpread] = useState<number>(0);
  const activeSpreadRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Dikeyden Yataya Scroll Mapping (Framer Motion container hedefli)
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 144Hz pürüzsüz yay fiziği (Zero-Jank Compositing)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 34,
    restDelta: 0.001,
  });

  // 4 Panel (400vw): 0vh -> 300vh aralığı tam olarak 0% -> -75% kaymaya eşittir.
  // Her 100vh tam 1 panele (100vw = -25%) karşılık gelir.
  const xTranslate = useTransform(smoothProgress, [0, 1], ['0%', '-75%'], { clamp: true });
  const progressBarWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'], { clamp: true });

  // Belirli bir panele yumuşak ve manyetik olarak kaydırma
  const scrollToPanel = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const clampedIndex = Math.max(0, Math.min(3, index));
    const h = window.innerHeight || 1;
    scrollContainerRef.current.scrollTo({
      top: clampedIndex * h,
      behavior: 'smooth',
    });
    activeSpreadRef.current = clampedIndex;
    setActiveSpread(clampedIndex);
    soundFx.playClick();
  }, []);

  // 2. Manyetik Tekerlek Kaydırması (Mouse Wheel Snapping - Yarım Kalmayı Önler)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isWheeling = false;
    let wheelTimer: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      // İçerideki kaydırılabilir alanlarda (örneğin metin/sergiler listesi) dikey kaydırmaya izin ver
      const target = e.target as HTMLElement | null;
      const scrollableChild = target?.closest('.overflow-y-auto');
      if (scrollableChild && scrollableChild !== container) {
        const hasOverflow = scrollableChild.scrollHeight > scrollableChild.clientHeight;
        const isAtTop = scrollableChild.scrollTop <= 0 && e.deltaY < 0;
        const isAtBottom =
          scrollableChild.scrollTop + scrollableChild.clientHeight >= scrollableChild.scrollHeight - 2 &&
          e.deltaY > 0;
        if (hasOverflow && !isAtTop && !isAtBottom) {
          // İç liste kendi içinde kaysın
          return;
        }
      }

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 22) return;

      e.preventDefault();
      if (isWheeling) return;

      isWheeling = true;
      if (delta > 0) {
        scrollToPanel(activeSpreadRef.current + 1);
      } else {
        scrollToPanel(activeSpreadRef.current - 1);
      }

      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        isWheeling = false;
      }, 520);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimer);
    };
  }, [scrollToPanel]);

  // 3. Doğal Sağa/Sola Parmak Kaydırması (Touch Swipe Gestures)
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    const duration = Date.now() - touchStartTime.current;

    if (duration < 700) {
      // Yatay swipe (Sola parmak hareketi -> sonraki panel, Sağa -> önceki panel)
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.15 && Math.abs(deltaX) > 35) {
        if (deltaX < 0) {
          scrollToPanel(activeSpreadRef.current + 1);
        } else {
          scrollToPanel(activeSpreadRef.current - 1);
        }
      }
      // Dikey swipe (Aşağı parmak hareketi -> sonraki panel, Yukarı -> önceki panel)
      else if (Math.abs(deltaY) > Math.abs(deltaX) * 1.15 && Math.abs(deltaY) > 40) {
        if (deltaY < 0) {
          scrollToPanel(activeSpreadRef.current + 1);
        } else {
          scrollToPanel(activeSpreadRef.current - 1);
        }
      }
    }
  };

  // Klavye ok tuşları ile gezinme (A11y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToPanel(activeSpreadRef.current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToPanel(activeSpreadRef.current - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToPanel]);

  // Kaydırma Takibi & Manyetik Kilit
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const st = scrollContainerRef.current.scrollTop;
    const h = window.innerHeight || 1;
    const index = Math.round(st / h);
    if (index !== activeSpreadRef.current) {
      activeSpreadRef.current = index;
      setActiveSpread(index);
    }

    // Manyetik Kilit Kalkanı: Kaydırma durduğunda en yakın 100vh çapa noktasına yapış
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      if (!scrollContainerRef.current) return;
      const currentSt = scrollContainerRef.current.scrollTop;
      const targetTop = index * (window.innerHeight || 1);
      if (Math.abs(currentSt - targetTop) > 4) {
        scrollContainerRef.current.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }
    }, 120);
  };

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

  const spreadTitles = isEn
    ? ['Overview', 'Manifesto', 'Exhibitions', 'Education']
    : ['Genel Bakış', 'Manifesto', 'Sergiler', 'Eğitim'];

  return (
    <main className="bg-neutral-950 text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 font-sans">
      {/* 
        DIŞ KAYDIRMA SARGISI: CSS snap-y snap-mandatory ile donanım düzeyinde manyetik oturma.
        Zero-Jank: Kullanıcı dokunduğunda, kaydırdığında veya tekerleği çevirdiğinde asla paneller arasında yarım kalmaz.
      */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="h-screen w-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth no-scrollbar select-none"
      >
        <div ref={containerRef} className="relative h-[400vh]">
          {/* 
            4 GÖRÜNMEZ MANYETİK ÇAPA (ANCHOR) DIV'İ:
            Her biri tam 100vh boyunda olup snap-start snap-always ile tarayıcının dikey kaydırma motoruna kilitlenir.
          */}
          <div className="absolute inset-0 pointer-events-none flex flex-col">
            <div id="snap-panel-0" className="h-screen w-full snap-start snap-always" />
            <div id="snap-panel-1" className="h-screen w-full snap-start snap-always" />
            <div id="snap-panel-2" className="h-screen w-full snap-start snap-always" />
            <div id="snap-panel-3" className="h-screen w-full snap-start snap-always" />
          </div>

          {/* STICKY VİEWPORT: Ekrana kilitlenen ve yatay şeridi gösteren ana sahne */}
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-neutral-950 flex flex-col justify-between">
            {/* Üst Editoryal Durum Çubuğu (Persistent Nav Header) */}
            <header className="h-14 sm:h-16 pl-4 sm:pl-8 lg:pl-12 pr-14 sm:pr-16 md:pr-20 lg:pr-24 xl:pr-28 border-b border-neutral-800/80 flex items-center justify-between z-40 bg-neutral-950/90 backdrop-blur-md shrink-0">
              <Link
                href="/"
                onClick={() => soundFx.playClick()}
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>{isEn ? 'Archive' : 'Arşiv'}</span>
              </Link>

              {/* Orta: Monografi Başlığı ve Doğrudan Tıklanabilir Panel Sekmeleri */}
              <div className="flex items-center gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400">
                <span className="hidden md:inline text-neutral-500">
                  {isEn ? 'MONOGRAPH' : 'MONOGRAFİ'}
                </span>
                <span className="hidden md:inline text-neutral-700">{'//'}</span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToPanel(idx)}
                      className={`px-2 py-0.5 transition-colors cursor-pointer ${
                        activeSpread === idx
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                      }`}
                      aria-label={`Go to spread ${idx + 1}`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sağ: İlerleme Çubuğu ve Swipe İpucu */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 hidden xs:inline">
                  {isEn ? 'Swipe ← →' : 'Kaydır ← →'}
                </span>
                <div className="w-16 sm:w-24 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-amber-400 origin-left"
                    style={{ width: progressBarWidth }}
                  />
                </div>
              </div>
            </header>

            {/* Yatay Eksende Kayan 4 Panelli Gövde (400vw) */}
            <div className="flex-1 w-full overflow-hidden relative">
              <motion.div
                style={{ x: xTranslate }}
                onPanEnd={(_e, info) => {
                  const threshold = 35;
                  if (info.offset.x < -threshold || info.velocity.x < -180) {
                    scrollToPanel(activeSpreadRef.current + 1);
                  } else if (info.offset.x > threshold || info.velocity.x > 180) {
                    scrollToPanel(activeSpreadRef.current - 1);
                  }
                }}
                className="flex flex-row h-full w-[400vw] will-change-transform"
              >
                {/* ======================================================= */}
                {/* SPREAD 01: KAPAK (COVER SPREAD)                         */}
                {/* ======================================================= */}
                <section
                  id="panel-01"
                  className="w-screen h-full shrink-0 border-r border-neutral-800/80 p-5 sm:p-8 md:p-10 xl:p-14 pr-14 sm:pr-16 md:pr-20 lg:pr-24 xl:pr-28 flex flex-col justify-between relative bg-neutral-950"
                >
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-amber-400/40 bg-amber-400/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-amber-300 font-semibold">
                        {isEn ? 'Monograph Issue 01' : 'Monografi Sayı 01'}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-500">
                      İZMİR • KAPALIÇARŞI • DÜSSELDORF
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto">
                    {/* Sanatçı Devasa Tipografi */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                      <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] text-amber-400 block">
                        {isEn ? 'Artist & Contemporary Sculptor' : 'Sanatçı & Çağdaş Heykeltıraş'}
                      </span>
                      <h1 className="font-serif text-4xl sm:text-6xl xl:text-8xl 2xl:text-9xl text-white uppercase tracking-tighter leading-[0.88]">
                        Derin Buse <br />
                        <span className="italic font-light text-neutral-400">Demirkaya</span>
                      </h1>
                      <p className="font-sans text-xs sm:text-sm xl:text-base text-neutral-300 max-w-xl font-light leading-relaxed border-l border-amber-400/80 pl-4 sm:pl-5">
                        {isEn
                          ? 'Founder of nonvalue jewel. Exploring the visceral, sculptural, and unassigned value of silver, fire, raw minerals, and salvaged organic matter.'
                          : 'nonvalue jewel kurucusu. Gümüşün, ateşin, ham minerallerin ve doğadan toplanmış atık maddelerin biçimsel ve dokunsal potansiyelini araştıran çağdaş pratik.'}
                      </p>
                    </div>

                    {/* Ham/Minimalist Stüdyo Fotoğrafı */}
                    <div className="lg:col-span-5 flex justify-center">
                      <div className="relative w-full max-w-[200px] sm:max-w-[280px] xl:max-w-[340px] aspect-[3/4] border border-neutral-800 bg-neutral-900/90 p-2 sm:p-3 shadow-2xl group">
                        <div className="relative w-full h-[88%] overflow-hidden bg-neutral-950">
                          <Image
                            src="/artworks/3fbff7e749e7081a72a2b949196c7ab1.jpg"
                            alt="Derin Buse Demirkaya Atelier"
                            fill
                            sizes="360px"
                            priority
                            referrerPolicy="no-referrer"
                            className="object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-neutral-950/20 pointer-events-none" />
                        </div>
                        <div className="pt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                          <span>ATELIER PORTRAIT</span>
                          <span className="text-amber-400">FIG. 01</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alt Bilgi & Sonraki Panele Geçiş Butonu */}
                  <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    <span>SPREAD 01 // OVERVIEW</span>
                    <button
                      type="button"
                      onClick={() => scrollToPanel(1)}
                      className="flex items-center gap-1 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      <span>{isEn ? 'Manifesto →' : 'Manifesto →'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </section>

                {/* ======================================================= */}
                {/* SPREAD 02: MANİFESTO & FELSEFE (PHILOSOPHY SPREAD)      */}
                {/* ======================================================= */}
                <section
                  id="panel-02"
                  className="w-screen h-full shrink-0 border-r border-neutral-800/80 p-5 sm:p-8 md:p-10 xl:p-14 pr-14 sm:pr-16 md:pr-20 lg:pr-24 xl:pr-28 flex flex-col justify-between relative bg-neutral-900/60 backdrop-blur-xs"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-300">
                      SPREAD 02 // MANIFESTO & PHILOSOPHY
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-400">
                      TRANSFORMATIVE FORCE OF FIRE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto">
                    {/* Sol: Döküm Görseli ve Alıntı */}
                    <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                      <div className="relative aspect-video lg:aspect-square w-full max-w-[280px] mx-auto lg:mx-0 border border-neutral-800 bg-neutral-950 p-2 shadow-xl">
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

                      <blockquote className="font-serif text-base sm:text-xl xl:text-2xl text-neutral-100 font-light leading-snug border-l-2 border-amber-400 pl-4">
                        &ldquo;nonvalue is a contemporary jewelry practice that seeks to reveal what has not yet been assigned value.&rdquo;
                      </blockquote>
                    </div>

                    {/* Sağ: Çoklu Sütun Biyografi ve Heykel Metni */}
                    <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                      <h2 className="font-serif text-2xl sm:text-4xl xl:text-5xl text-white uppercase tracking-tight leading-tight">
                        {isEn ? 'The Form of Fire & Situational Sculpture' : 'Ateşin Formu ve Devingen Heykel'}
                      </h2>

                      <div className="columns-1 md:columns-2 gap-6 xl:gap-8 text-xs sm:text-sm font-light text-neutral-300 leading-relaxed space-y-3 max-h-[46vh] sm:max-h-[55vh] overflow-y-auto no-scrollbar pr-1">
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

                  <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    <span>SPREAD 02 // ESSAY & PRACTICES</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => scrollToPanel(0)}
                        className="text-neutral-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Prev' : 'Geri'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToPanel(2)}
                        className="text-neutral-300 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{isEn ? 'Exhibitions →' : 'Sergiler →'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* ======================================================= */}
                {/* SPREAD 03: SERGİLER & BİENALLER (EXHIBITIONS CHRONOLOGY)*/}
                {/* ======================================================= */}
                <section
                  id="panel-03"
                  className="w-screen h-full shrink-0 border-r border-neutral-800/80 p-5 sm:p-8 md:p-10 xl:p-14 pr-14 sm:pr-16 md:pr-20 lg:pr-24 xl:pr-28 flex flex-col justify-between relative bg-neutral-950"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-300">
                      SPREAD 03 // EXHIBITIONS & BIENNIALS
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-400">
                      CHRONOLOGY 2017 — 2025
                    </span>
                  </div>

                  <div className="space-y-4 my-auto">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h3 className="font-serif text-2xl sm:text-4xl text-white uppercase tracking-wider">
                        {isEn ? 'Exhibitions & Events' : 'Sergiler & Etkinlikler'}
                      </h3>
                      <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                        {isEn ? '8 Selected Curations' : '8 Seçilmiş Sergi'}
                      </span>
                    </div>

                    {/* 2 Sütunlu Minimal Monospace Daktilo İndeks Listesi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1 divide-y md:divide-y-0 divide-neutral-800/80 border-t border-b border-neutral-800/80 py-2 max-h-[58vh] overflow-y-auto no-scrollbar pr-2">
                      {exhibitions.map((ex, i) => (
                        <div
                          key={i}
                          className="py-3 flex items-baseline justify-between text-xs font-mono border-b border-neutral-800/60 hover:bg-neutral-900/40 px-2 transition-colors"
                        >
                          <div className="flex items-baseline gap-3">
                            <span className="text-amber-400 font-semibold w-10 shrink-0">{ex.year}</span>
                            <div>
                              <span className="text-white font-medium mr-2">{ex.title}</span>
                              <span className="text-neutral-400 text-[11px] block sm:inline">{ex.venue}</span>
                            </div>
                          </div>
                          <span className="text-neutral-500 text-[11px] shrink-0 text-right">{ex.location}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    <span>SPREAD 03 // EXHIBITIONS INDEX</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => scrollToPanel(1)}
                        className="text-neutral-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Prev' : 'Geri'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToPanel(3)}
                        className="text-neutral-300 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{isEn ? 'Education →' : 'Eğitim →'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* ======================================================= */}
                {/* SPREAD 04: EĞİTİM, KAPALIÇARŞI & AKSİYON (INDEX FIN.)   */}
                {/* ======================================================= */}
                <section
                  id="panel-04"
                  className="w-screen h-full shrink-0 p-5 sm:p-8 md:p-10 xl:p-14 pr-14 sm:pr-16 md:pr-20 lg:pr-24 xl:pr-28 flex flex-col justify-between relative bg-neutral-950"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-300">
                      SPREAD 04 // EDUCATION & CRAFT GUILDS
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-emerald-400">
                      PEDAGOGY & APPRENTICESHIP
                    </span>
                  </div>

                  <div className="space-y-5 my-auto">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider">
                        {isEn ? 'Education & Guild Guilds' : 'Eğitim & Ustalık Çıraklığı'}
                      </h3>
                      <p className="font-mono text-[11px] text-neutral-400 mt-1">
                        {isEn
                          ? 'Academic design background merged with traditional Grand Bazaar metalsmithing.'
                          : 'Akademik tasarım eğitimi ile Kapalıçarşı geleneksel sadekar çıraklığının sentezi.'}
                      </p>
                    </div>

                    {/* 4 Eğitim ve Zanaat Kartı */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[46vh] sm:max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
                      {education.map((ed, i) => (
                        <div
                          key={i}
                          className="p-4 border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                            <span className="text-amber-400 font-semibold">{ed.period}</span>
                            <span>{ed.location}</span>
                          </div>
                          <h4 className="font-sans text-xs sm:text-sm font-semibold text-neutral-200">
                            {ed.institution}
                          </h4>
                          <p className="font-mono text-[11px] text-neutral-400 leading-tight">
                            {ed.degree}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Alt Aksiyonlar & CTA Butonları */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Link
                        href="/koleksiyon"
                        onClick={() => soundFx.playClick()}
                        className="px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-colors flex items-center gap-2"
                      >
                        <span>{isEn ? 'Explore Collection' : 'Koleksiyonu İncele'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href="/atolye"
                        onClick={() => soundFx.playClick()}
                        className="px-5 py-3 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isEn ? 'Workshop Calendar' : 'Atölye Takvimi'}</span>
                      </Link>

                      <a
                        href="https://instagram.com/nonvalue_jewel"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundFx.playClick()}
                        className="px-4 py-3 text-neutral-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>@nonvalue_jewel</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    <span>SPREAD 04 // INDEX FIN.</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => scrollToPanel(2)}
                        className="text-neutral-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Prev' : 'Geri'}</span>
                      </button>
                      <span className="text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        DERİN BUSE DEMİRKAYA — 2026
                      </span>
                    </div>
                  </div>
                </section>
              </motion.div>
            </div>

            {/* Alt Sabit Manyetik Navigasyon Çubuğu (Floating Spread Dock) */}
            <footer className="h-10 pl-4 sm:pl-8 pr-14 sm:pr-16 md:pr-20 lg:pr-24 xl:pr-28 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400 bg-neutral-950/95 shrink-0 z-40">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">0{activeSpread + 1} / 04</span>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-300 font-medium">{spreadTitles[activeSpread]}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollToPanel(activeSpread - 1)}
                  disabled={activeSpread === 0}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 cursor-pointer"
                  aria-label="Previous Spread"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToPanel(activeSpread + 1)}
                  disabled={activeSpread === 3}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 cursor-pointer"
                  aria-label="Next Spread"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
