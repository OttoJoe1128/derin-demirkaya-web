'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Volume2,
  VolumeX,
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

/**
 * Universal Responsive Vertical Navigation Bar
 * - Sitenin tüm cihaz ve arayüzlerinde (mobil, tablet, laptop, masaüstü) aynı estetik kimlik:
 *   Sağ kenara sabitlenmiş heykelsi dikey editoryal bar.
 * - Ekran yüksekliğine duyarlı (h-[100dvh], flex-1 justify-around) ölçeklendirme;
 *   en küçük laptop ve mobil ekranlarda dahi asla ekrandan taşmaz.
 * - NV Monogram, Hızlı Arama (⌘K), 4 Eser/Atölye Bağlantısı, Ses Efekti ve TR | EN Dil Seçici.
 */
export default function VerticalNavigation({ lang: initialLang }: VerticalNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundFx.getMuted());

  // Aktif dil tespiti (URL prefix veya context/prop)
  const currentLangCode: Locale = useMemo(() => {
    if (pathname?.startsWith('/en')) return 'en';
    if (pathname?.startsWith('/tr')) return 'tr';
    if (initialLang) return initialLang;
    return language?.toLowerCase() === 'en' ? 'en' : 'tr';
  }, [pathname, initialLang, language]);

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

  // Özlü, dikeyde taşmayan zarif editoryal etiketler
  const navTexts = {
    collection: currentLangCode === 'en' ? 'Collection' : 'Koleksiyon',
    archive: currentLangCode === 'en' ? 'Archive' : 'Arşiv',
    workshops: currentLangCode === 'en' ? 'Workshops' : 'Atölye',
    studio: currentLangCode === 'en' ? 'Studio' : 'Stüdyo',
    soundOn: currentLangCode === 'en' ? 'AUDIO: ON' : 'SES: AÇIK',
    soundOff: currentLangCode === 'en' ? 'AUDIO: OFF' : 'SES: KAPALI',
    search: currentLangCode === 'en' ? 'Search (⌘K)' : 'Arama (⌘K)',
  };

  // Dile göre yerelleştirilmiş rotalar
  const langPrefix = `/${currentLangCode}`;
  const navLinks = [
    { num: '01', name: navTexts.collection, href: `${langPrefix}/koleksiyon`, rawHref: '/koleksiyon' },
    { num: '02', name: navTexts.archive, href: `${langPrefix}/arsiv`, rawHref: '/arsiv' },
    { num: '03', name: navTexts.workshops, href: `${langPrefix}/atolye`, rawHref: '/atolye' },
    { num: '04', name: navTexts.studio, href: '/admin', rawHref: '/admin' },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* EVRENSEL VE DUYARLI SAĞ KENAR DİKEY NAVİGASYON (TÜM CİHAZLAR VE EKRANLAR) */}
      {/* ========================================================================= */}
      <nav
        id="vertical-navigation"
        role="navigation"
        aria-label="Dergi Dikey Navigasyonu"
        className="fixed right-0 top-0 h-[100dvh] w-11 sm:w-13 md:w-16 lg:w-20 xl:w-24 z-[70] flex flex-col justify-between items-center py-2 sm:py-3 lg:py-5 border-l border-neutral-800/80 bg-neutral-950/92 backdrop-blur-xl text-neutral-300 select-none shadow-[-8px_0_30px_rgba(0,0,0,0.5)] transition-all overflow-hidden"
      >
        {/* 1. TEPE: nonvalue Monogram Logo & Hızlı Arama */}
        <div className="flex flex-col items-center gap-1.5 sm:gap-2.5 lg:gap-3 w-full px-0.5 shrink-0">
          {/* Monogram Logo */}
          <Link
            href={`${langPrefix}`}
            onClick={() => soundFx.playClick()}
            title={currentLangCode === 'en' ? 'nonvalue — Home' : 'nonvalue — Ana Sayfa'}
            className="group flex flex-col items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 p-1"
          >
            <span className="font-serif text-[11px] sm:text-xs md:text-sm tracking-tighter text-neutral-100 group-hover:text-amber-300 transition-colors uppercase font-bold">
              NV
            </span>
            <span className="text-[6px] sm:text-[7px] font-mono tracking-[0.18em] text-neutral-500 uppercase -mt-0.5">
              ’26
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
            className="p-1 sm:p-1.5 md:p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer"
          >
            <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* 2. ORTA: Dikey Tipografik Linkler (Koleksiyon, Arşiv, Atölye, Stüdyo) */}
        {/* flex-1 ve justify-around ile ekran yüksekliği ne olursa olsun tam sığar */}
        <div className="flex flex-col items-center justify-around flex-1 my-auto py-1 sm:py-2 gap-1 sm:gap-2 lg:gap-4 w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname === link.rawHref;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className={`group relative flex items-center justify-center py-1 px-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 shrink-0 cursor-pointer ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title={link.name}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                  {/* Aktif / Hover Çizgi */}
                  <span
                    className={`w-[1.5px] transition-all duration-300 rounded-full ${
                      isActive
                        ? 'h-3 sm:h-4 lg:h-5 bg-amber-400'
                        : 'h-0 group-hover:h-3 sm:group-hover:h-4 bg-amber-400/80'
                    }`}
                  />

                  {/* Dikey Metin (Mobilde 8px, Tablette 9-10px, Geniş Ekranda 11-12px) */}
                  <span
                    className={`font-mono text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs tracking-[0.16em] sm:tracking-[0.2em] lg:tracking-[0.26em] uppercase transition-all duration-300 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap ${
                      isActive
                        ? 'font-bold text-amber-300'
                        : 'group-hover:italic group-hover:tracking-[0.24em] lg:group-hover:tracking-[0.3em]'
                    }`}
                  >
                    {link.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 3. ALT: Ses Kontrolü & TR | EN Dil Seçici */}
        <div className="flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-3 w-full px-0.5 shrink-0">
          {/* Ses FX Düğmesi */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? navTexts.soundOff : navTexts.soundOn}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="p-1 sm:p-1.5 md:p-2 text-neutral-400 hover:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            ) : (
              <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            )}
          </button>

          {/* Dil Değiştirici Pill (Mobilde ve Masaüstünde daima erişilebilir) */}
          <div
            id="language-switcher"
            className="flex items-center border border-neutral-800 bg-neutral-900/90 rounded-xs p-0.5 text-[8px] sm:text-[9px] font-mono tracking-wider uppercase transition-all hover:border-neutral-700"
          >
            <button
              type="button"
              onClick={() => handleSwitchLanguage('tr')}
              aria-label="Türkçe"
              className={`px-1 py-0.5 transition-all cursor-pointer ${
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
              className={`px-1 py-0.5 transition-all cursor-pointer ${
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

      {/* Hızlı Arama Modalı (⌘K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
