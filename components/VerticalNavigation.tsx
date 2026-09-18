'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Volume2,
  VolumeX,
  Menu,
  X,
  ArrowRight,
  Compass,
  Layers,
  Flame,
  Shield,
  BookOpen,
  Mail,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';
import QuickSearchModal from './QuickSearchModal';
import type { Dictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';

interface VerticalNavigationProps {
  lang?: Locale;
  dict?: Dictionary;
}

export default function VerticalNavigation({ lang: initialLang, dict }: VerticalNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isMuted, setIsMuted] = useState(() => soundFx.getMuted());

  // Aktif dil tespiti (URL prefix veya context/prop)
  const currentLangCode: Locale = useMemo(() => {
    if (pathname?.startsWith('/en')) return 'en';
    if (pathname?.startsWith('/tr')) return 'tr';
    if (initialLang) return initialLang;
    return language?.toLowerCase() === 'en' ? 'en' : 'tr';
  }, [pathname, initialLang, language]);

  // Sayfa rotası değiştiğinde mobil menüyü otomatik kapat (render-time state adjustment)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  // Mobil menü açıkken arkadaki sayfanın kaymasını engelle
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.removeProperty('overflow');
    }
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isMobileMenuOpen]);

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // URL'deki dili değiştiren router fonksiyonu
  const handleSwitchLanguage = (targetLang?: Locale) => {
    soundFx.playClick();
    const nextLocale: Locale = targetLang || (currentLangCode === 'tr' ? 'en' : 'tr');
    
    // Client context'ini de güncelle
    setLanguage(nextLocale.toUpperCase() as 'TR' | 'EN');

    // Pathname'i dönüştür
    let newPath = pathname;
    if (pathname.startsWith('/tr')) {
      newPath = pathname.replace(/^\/tr/, `/${nextLocale}`);
    } else if (pathname.startsWith('/en')) {
      newPath = pathname.replace(/^\/en/, `/${nextLocale}`);
    } else {
      newPath = `/${nextLocale}${pathname === '/' ? '' : pathname}`;
    }

    // Çerezi de güncelle
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    document.cookie = `derin_lang=${nextLocale.toUpperCase()}; path=/; max-age=31536000`;

    router.push(newPath);
  };

  // Çeviriler
  const navTexts = {
    collection: dict?.nav?.collection || (currentLangCode === 'en' ? 'Collection' : 'Koleksiyon'),
    archive: dict?.nav?.archive || (currentLangCode === 'en' ? 'Archive' : 'Arşiv'),
    workshops: dict?.nav?.workshops || (currentLangCode === 'en' ? 'Workshops' : 'Atölye'),
    studio: dict?.nav?.studio || (currentLangCode === 'en' ? 'Studio' : 'Stüdyo'),
    about: dict?.nav?.about || (currentLangCode === 'en' ? 'About' : 'Hakkında'),
    contact: dict?.nav?.contact || (currentLangCode === 'en' ? 'Contact' : 'İletişim'),
    soundOn: dict?.nav?.soundOn || (currentLangCode === 'en' ? 'AUDIO: ON' : 'SES: AÇIK'),
    soundOff: dict?.nav?.soundOff || (currentLangCode === 'en' ? 'AUDIO: OFF' : 'SES: KAPALI'),
    search: dict?.nav?.search || (currentLangCode === 'en' ? 'Search (⌘K)' : 'Arama (⌘K)'),
    menu: currentLangCode === 'en' ? 'Menu' : 'Menü',
    close: currentLangCode === 'en' ? 'Close' : 'Kapat',
  };

  // Dile göre yerelleştirilmiş rotalar
  const langPrefix = `/${currentLangCode}`;
  const navLinks = [
    { num: '01', name: navTexts.collection, href: `${langPrefix}/koleksiyon`, rawHref: '/koleksiyon', icon: Layers },
    { num: '02', name: navTexts.archive, href: `${langPrefix}/arsiv`, rawHref: '/arsiv', icon: Compass },
    { num: '03', name: navTexts.workshops, href: `${langPrefix}/atolye`, rawHref: '/atolye', icon: Flame },
    { num: '04', name: navTexts.studio, href: '/admin', rawHref: '/admin', icon: Shield, isStudio: true },
  ];

  const extendedMobileLinks = [
    ...navLinks,
    { num: '05', name: navTexts.about, href: `${langPrefix}/hakkinda`, rawHref: '/hakkinda', icon: BookOpen },
    { num: '06', name: navTexts.contact, href: `${langPrefix}/iletisim`, rawHref: '/iletisim', icon: Mail },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MASAÜSTÜ & TABLET: EVRENSEL DİKEY NAVİGASYON (MD & LG EKRANLAR) */}
      {/* ========================================================================= */}
      {/* 
        - Desktop: w-20 xl:w-24
        - Tablet (md:max-lg): w-16, kompakt iç padding ve sıkı font ölçeği
        - Mobilde (ekran < 768px): hidden ile tamamen gizlenir, içeriği ASLA sıkıştırmaz
        - z-[70]: Sayfa içi öğelerin üstünde, modal/arama/perdenin altında (sıfır çakışma)
      */}
      <nav
        id="vertical-navigation"
        role="navigation"
        aria-label="Dergi Dikey Navigasyonu"
        className="hidden md:flex fixed right-0 top-0 h-screen w-16 lg:w-20 xl:w-24 z-[70] flex-col justify-between items-center py-4 sm:py-6 lg:py-8 border-l border-neutral-800/80 bg-neutral-950/90 backdrop-blur-xl text-neutral-300 select-none shadow-[-8px_0_30px_rgba(0,0,0,0.5)] transition-all"
      >
        {/* TEPE: Monogram Logo & Hızlı Arama */}
        <div className="flex flex-col items-center gap-3 lg:gap-4 w-full px-1 sm:px-2">
          {/* nonvalue Monogram Logo */}
          <Link
            href={`${langPrefix}`}
            onClick={() => soundFx.playClick()}
            title={currentLangCode === 'en' ? "Derin Buse Demirkaya — Home" : "Derin Buse Demirkaya — Ana Sayfa"}
            className="group flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 p-1"
          >
            <span className="font-serif text-xs lg:text-sm tracking-tighter text-neutral-100 group-hover:text-amber-300 transition-colors uppercase font-bold">
              NV
            </span>
            <span className="text-[7px] font-mono tracking-[0.2em] text-neutral-500 uppercase -mt-0.5">
              2026
            </span>
          </Link>

          {/* İnce Ayırıcı Nokta */}
          <div className="w-1 h-1 rounded-full bg-neutral-800" />

          {/* Hızlı Arama Butonu (⌘K) */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsSearchOpen(true);
            }}
            onMouseEnter={() => soundFx.playHover()}
            title={navTexts.search}
            aria-label="Arama"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          </button>
        </div>

        {/* ORTA: Dikey Tipografik Linkler (Koleksiyon, Arşiv, Atölye, Stüdyo) */}
        <div className="flex flex-col items-center gap-6 lg:gap-8 xl:gap-10 my-auto py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname === link.rawHref;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className={`group relative flex items-center justify-center py-2 px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title={link.name}
              >
                <div className="flex items-center gap-1.5 lg:gap-2">
                  {/* Aktif / Hover Çizgi */}
                  <span
                    className={`w-[1.5px] transition-all duration-300 rounded-full ${
                      isActive
                        ? 'h-5 lg:h-6 bg-amber-400'
                        : 'h-0 group-hover:h-4 lg:group-hover:h-5 bg-amber-400/80'
                    }`}
                  />

                  {/* Dikey Metin (Tablette 10px, Geniş Ekranda 11-12px) */}
                  <span
                    className={`font-mono text-[10px] lg:text-[11px] xl:text-xs tracking-[0.22em] lg:tracking-[0.28em] uppercase transition-all duration-300 [writing-mode:vertical-rl] rotate-180 ${
                      isActive
                        ? 'font-bold text-amber-300'
                        : 'group-hover:italic group-hover:tracking-[0.32em]'
                    }`}
                  >
                    {link.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ALT: Ses Kontrolü & TR | EN Dil Seçici */}
        <div className="flex flex-col items-center gap-3 w-full px-1 sm:px-2">
          {/* Ses FX Düğmesi */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? navTexts.soundOff : navTexts.soundOn}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="p-1.5 lg:p-2 text-neutral-400 hover:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Dil Değiştirici Pill */}
          <div
            id="language-switcher-desktop"
            className="flex items-center border border-neutral-800 bg-neutral-900/90 rounded-xs p-0.5 text-[9px] font-mono tracking-widest uppercase transition-all hover:border-neutral-700"
          >
            <button
              type="button"
              onClick={() => handleSwitchLanguage('tr')}
              aria-label="Türkçe"
              className={`px-1 py-0.5 transition-all ${
                currentLangCode === 'tr'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              TR
            </button>
            <span className="text-neutral-700 px-0.5 select-none">|</span>
            <button
              type="button"
              onClick={() => handleSwitchLanguage('en')}
              aria-label="English"
              className={`px-1 py-0.5 transition-all ${
                currentLangCode === 'en'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. MOBİL: KUSURSUZ VE ERGONOMİK BOTTOM NAVIGATION DOCK (EKRAN < 768px) */}
      {/* ========================================================================= */}
      {/* 
        - Ekranın en altına sabitlenir (fixed bottom-0 left-0 right-0 h-14)
        - Cam & editoryal siyah arka plan: bg-neutral-950/92 backdrop-blur-xl
        - İçeriği asla ezmez, sağdan 80px boşluk çalmaz!
        - z-[70]: Sayfa içeriği üzerinde kusursuz çalışır
      */}
      <div
        id="mobile-bottom-navigation"
        className="flex md:hidden fixed bottom-0 left-0 right-0 h-14 z-[70] items-center justify-between px-4 border-t border-neutral-800/90 bg-neutral-950/95 backdrop-blur-xl text-neutral-300 select-none shadow-[0_-8px_25px_rgba(0,0,0,0.7)]"
      >
        {/* Sol: NV Monogram + Dil Seçici */}
        <div className="flex items-center gap-3">
          <Link
            href={`${langPrefix}`}
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-1 font-serif text-sm font-bold text-white tracking-tighter"
            aria-label="nonvalue Ana Sayfa"
          >
            <span>NV</span>
            <span className="text-[8px] font-mono text-amber-400/80 font-normal">’26</span>
          </Link>

          <div className="flex items-center border border-neutral-800 bg-neutral-900/80 rounded-xs p-0.5 text-[9px] font-mono">
            <button
              type="button"
              onClick={() => handleSwitchLanguage('tr')}
              className={`px-1.5 py-0.5 transition-colors ${
                currentLangCode === 'tr' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400'
              }`}
            >
              TR
            </button>
            <span className="text-neutral-700 px-0.5">|</span>
            <button
              type="button"
              onClick={() => handleSwitchLanguage('en')}
              className={`px-1.5 py-0.5 transition-colors ${
                currentLangCode === 'en' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Orta: Hızlı Gezinme Sekmeleri */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href={`${langPrefix}/koleksiyon`}
            onClick={() => soundFx.playClick()}
            className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors rounded-xs ${
              pathname.includes('/koleksiyon')
                ? 'text-amber-300 font-bold border-b border-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {navTexts.collection}
          </Link>

          <Link
            href={`${langPrefix}/arsiv`}
            onClick={() => soundFx.playClick()}
            className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors rounded-xs ${
              pathname.includes('/arsiv')
                ? 'text-amber-300 font-bold border-b border-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {navTexts.archive}
          </Link>
        </div>

        {/* Sağ: Arama ve Hamburger Menü Butonları */}
        <div className="flex items-center gap-2">
          {/* Arama Butonu */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsSearchOpen(true);
            }}
            aria-label="Arama"
            className="p-2 text-neutral-400 hover:text-white rounded-xs focus-visible:outline-none"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Menü Açma / Kapatma Hamburger Butonu */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsMobileMenuOpen((prev) => !prev);
            }}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? navTexts.close : navTexts.menu}
            className="p-2 border border-neutral-800 bg-neutral-900 text-neutral-200 hover:text-white hover:border-amber-400/80 rounded-xs flex items-center justify-center transition-all"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-amber-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBİL: EDİTORYAL TAM EKRAN MENÜ PERDESİ (DRAWER OVERLAY) */}
      {/* ========================================================================= */}
      {/* 
        - Hamburger menüye basıldığında pürüzsüzce açılır
        - z-[85]: Sayfanın ve alt barın üzerinde, QuickSearchModal'ın altında
        - Awwwards seviyesi editoryal tipografi ve mikro etkileşimler
      */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-drawer-overlay"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="md:hidden fixed inset-0 z-[85] bg-neutral-950/98 backdrop-blur-2xl flex flex-col justify-between p-6 pb-20 pt-16 overflow-y-auto"
          >
            {/* Üst Kapatma & Marka Bilgisi */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-white uppercase tracking-tight">
                  nonvalue
                </span>
                <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest px-1.5 py-0.5 border border-amber-400/30">
                  JEWEL // ARCHIVE
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 text-neutral-400 hover:text-white border border-neutral-800 rounded-xs"
                aria-label="Menüyü Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Orta: Büyük Editoryal Link Listesi */}
            <div className="my-auto py-6 flex flex-col space-y-3">
              {extendedMobileLinks.map((link) => {
                const isActive = pathname === link.href || pathname === link.rawHref;
                const IconComponent = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      soundFx.playClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`group flex items-center justify-between py-2.5 px-3 border-b border-neutral-900 transition-all ${
                      isActive
                        ? 'bg-neutral-900/60 border-amber-400/50 text-white'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-amber-400/80 font-semibold">
                        {link.num}
                      </span>
                      <span className="font-serif text-2xl uppercase tracking-tight text-neutral-100 group-hover:text-amber-300 transition-colors">
                        {link.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors" />
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:translate-x-1 group-hover:text-amber-400 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Alt: Ses, Arama ve Sanatçı Stüdyosu Bilgisi */}
            <div className="border-t border-neutral-800/80 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                {/* Ses FX */}
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  <span>{isMuted ? navTexts.soundOff : navTexts.soundOn}</span>
                </button>

                {/* Hızlı Arama Butonu */}
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-xs font-mono text-amber-300 rounded-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{navTexts.search}</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-neutral-600 flex justify-between uppercase tracking-widest pt-1">
                <span>DERİN BUSE DEMİRKAYA</span>
                <span>KARAKÖY • 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Hızlı Arama Modalı (z-[150] katmanında) */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
