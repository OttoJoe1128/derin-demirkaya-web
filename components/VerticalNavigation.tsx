'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { soundFx } from '@/lib/sound-fx';
import QuickSearchModal from './QuickSearchModal';
import type { Dictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';

const IS_ECOMMERCE_ACTIVE = false;

interface VerticalNavigationProps {
  lang?: Locale;
  dict?: Dictionary;
}

export default function VerticalNavigation({ lang: initialLang, dict }: VerticalNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundFx.getMuted());

  // Pasif e-ticaret sepet durumu (Future-proof altyapı)
  const [cartCount] = useState<number>(0);

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

  // URL'deki dili değiştiren router fonksiyonu (Sayfa düzenini kırmadan /tr/ -> /en/ çevirir)
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

  // Çeviriler: Önce doğrudan geçirilen `dict`, sonra `t()` hook'u
  const navTexts = {
    collection: dict?.nav?.collection || (currentLangCode === 'en' ? 'Collection' : 'Koleksiyon'),
    archive: dict?.nav?.archive || (currentLangCode === 'en' ? 'Archive' : 'Arşiv'),
    workshops: dict?.nav?.workshops || (currentLangCode === 'en' ? 'Workshops' : 'Atölye'),
    studio: dict?.nav?.studio || (currentLangCode === 'en' ? 'Studio' : 'Stüdyo'),
    soundOn: dict?.nav?.soundOn || (currentLangCode === 'en' ? 'AUDIO: ON' : 'SES: AÇIK'),
    soundOff: dict?.nav?.soundOff || (currentLangCode === 'en' ? 'AUDIO: OFF' : 'SES: KAPALI'),
    search: dict?.nav?.search || (currentLangCode === 'en' ? 'Search (⌘K)' : 'Arama (⌘K)'),
  };

  // Dile göre yerelleştirilmiş rotalar
  const langPrefix = `/${currentLangCode}`;
  const navLinks = [
    { name: navTexts.collection, href: `${langPrefix}/koleksiyon`, rawHref: '/koleksiyon' },
    { name: navTexts.archive, href: `${langPrefix}/arsiv`, rawHref: '/arsiv' },
    { name: navTexts.workshops, href: `${langPrefix}/atolye`, rawHref: '/atolye' },
    { name: navTexts.studio, href: '/admin', rawHref: '/admin', isStudio: true },
  ];

  return (
    <>
      {/* 
        Sağ Kenar Dikey Navigasyonu (Semantic <nav>, z-[90], a11y focus-visible)
        - Ekranın SAĞ KESİTİNE tam boy sabitlenmiş (fixed right-0 top-0 h-screen w-20 sm:w-24)
        - Arka planı blur'lu lüks cam efekti (bg-neutral-950/85 backdrop-blur-xl)
        - Sol tarafında çok ince zarif kenarlık (border-l border-neutral-200/50)
      */}
      <nav
        id="vertical-navigation"
        role="navigation"
        aria-label="Sağ Kenar Dikey Dergi Navigasyonu"
        className="fixed right-0 top-0 h-screen w-20 sm:w-24 z-[90] flex flex-col justify-between items-center py-6 sm:py-8 border-l border-neutral-200/50 bg-neutral-950/85 backdrop-blur-xl text-neutral-300 select-none shadow-[-8px_0_30px_rgba(0,0,0,0.5)] transition-all"
      >
        {/* TEPE: Monogram / Ana Sayfa ve Hızlı Arama Butonu */}
        <div className="flex flex-col items-center gap-4 w-full px-2">
          {/* nonvalue Monogram Logo */}
          <Link
            href={`${langPrefix}`}
            onClick={() => soundFx.playClick()}
            title={currentLangCode === 'en' ? "Derin Buse Demirkaya — Home" : "Derin Buse Demirkaya — Ana Sayfa"}
            className="group flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 p-1"
          >
            <span className="font-serif text-sm tracking-tighter text-neutral-100 group-hover:text-amber-300 transition-colors uppercase font-bold">
              NV
            </span>
            <span className="text-[7px] font-mono tracking-[0.25em] text-neutral-500 uppercase -mt-0.5">
              2026
            </span>
          </Link>

          {/* İnce Ayırıcı Nokta */}
          <div className="w-1 h-1 rounded-full bg-neutral-700" />

          {/* Hızlı Arama (⌘K) */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsSearchOpen(true);
            }}
            onMouseEnter={() => soundFx.playHover()}
            title={navTexts.search}
            aria-label="Arama"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800/80 rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* ORTA: Dikey Okunan Linkler (Koleksiyon, Arşiv, Atölye, Stüdyo) */}
        <div className="flex flex-col items-center gap-8 sm:gap-10 my-auto py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname === link.rawHref;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className={`group relative flex items-center justify-center py-2 px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title={link.name}
              >
                {/* 
                  Yukarıdan aşağıya doğru okunacak dikey metin:
                  writing-mode: vertical-rl + rotate-180
                  Hover durumunda: dikey metin italik olur ve ince bir çizgi belirir.
                */}
                <div className="flex items-center gap-2">
                  {/* Hover'da beliren ince zarif çizgi */}
                  <span
                    className={`w-[1.5px] transition-all duration-300 rounded-full ${
                      isActive
                        ? 'h-6 bg-amber-400'
                        : 'h-0 group-hover:h-5 bg-amber-400/90'
                    }`}
                  />

                  {/* Dikey Metin */}
                  <span
                    className={`font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase transition-all duration-300 [writing-mode:vertical-rl] rotate-180 ${
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

        {/* ALT: Ses, TR | EN Dil Seçici ve Pasif E-Ticaret / Giriş Altyapısı */}
        <div className="flex flex-col items-center gap-3.5 w-full px-2">
          {IS_ECOMMERCE_ACTIVE && (
            <div
              id="ecommerce-module"
              className="flex flex-col items-center gap-3 pt-2 border-t border-neutral-800 w-full"
            >
              <button
                type="button"
                onClick={() => soundFx.playClick()}
                aria-label="Alışveriş Sepeti"
                className="relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-neutral-950 font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {isAuthenticated && user ? (
                <Link
                  href={`${langPrefix}/profil`}
                  onClick={() => soundFx.playClick()}
                  aria-label={`Kullanıcı Profili: ${user.name}`}
                  className="p-2 text-amber-300 hover:bg-neutral-800/80 rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Sparkles className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href={`${langPrefix}/giris`}
                  onClick={() => soundFx.playClick()}
                  aria-label="Kullanıcı Girişi / Kayıt"
                  className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <UserIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}

          {/* Ses FX Düğmesi */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? navTexts.soundOff : navTexts.soundOn}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="p-2 text-neutral-400 hover:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* KURAL 4: Editoryal Tasarımla Uyumlu "TR | EN" Dil Değiştirici */}
          <div
            id="language-switcher-pill"
            className="flex items-center border border-neutral-800 bg-neutral-900/90 rounded-xs p-0.5 text-[9px] font-mono tracking-widest uppercase transition-all hover:border-neutral-600"
          >
            <button
              type="button"
              onClick={() => handleSwitchLanguage('tr')}
              aria-label="Türkçe Dilini Seç"
              className={`px-1.5 py-1 transition-all ${
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
              aria-label="Select English Language"
              className={`px-1.5 py-1 transition-all ${
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

      {/* Global Hızlı Arama Modalı */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
