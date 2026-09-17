'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Film,
  Volume2,
  VolumeX,
  User as UserIcon,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { soundFx } from '@/lib/sound-fx';
import QuickSearchModal from './QuickSearchModal';

export default function GlobalHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isMuted, setIsMuted] = useState(() => soundFx.getMuted());

  // KURAL 4: Animasyonun bitiş durumu (tıklamaların açılması için)
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  // Global Cmd+K / Ctrl+K klavye kısayolu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        soundFx.playClick();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Kaydırma takibi
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { name: t('nav.collection'), href: '/koleksiyon' },
    { name: t('nav.archive'), href: '/arsiv', highlight: true },
    { name: t('nav.workshops'), href: '/atolye' },
    { name: t('nav.about'), href: '/hakkinda' },
    { name: t('nav.contact'), href: '/iletisim' },
  ];

  return (
    <>
      {/* 
        KURAL 1 & 3: Siyah Perde (Overlay) Katmanı (z-[100])
        - Ekrana gelir gelmez 3 SANİYE boyunca tamamen hareketsiz ve simsiyah kalır (delay: 3).
        - 3 saniye sonra TAM 6 SANİYE boyunca su gibi eriyerek (opacity: 1 -> 0) arkadaki siteyi açığa çıkarır (duration: 6).
        - GPU hızlandırmalı: style={{ willChange: "opacity" }}, ease: [0.45, 0, 0.15, 1].
        - Animasyon bitince DOM'da hiçbir şeye engel olmaması için pointer-events-none olur.
      */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          delay: 3,
          duration: 6,
          ease: [0.45, 0, 0.15, 1],
        }}
        style={{ willChange: 'opacity' }}
        onAnimationComplete={() => {
          setIsAnimationFinished(true);
        }}
        className={`fixed inset-0 bg-black z-[100] ${
          isAnimationFinished ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      />

      {/* Ana Header Çubuğu (z-[95] - Perde ve Logonun üst kapsayıcısı) */}
      <header
        id="global-header"
        className={`${
          isHomePage
            ? 'fixed top-0 left-0 right-20 sm:right-24 z-[95] h-16 sm:h-20 bg-neutral-50/95 backdrop-blur-md border-b border-neutral-200/90 shadow-xs'
            : isScrolled
            ? 'sticky top-0 z-[95] w-full bg-neutral-50/98 backdrop-blur-md border-b border-neutral-300/90 shadow-sm'
            : 'sticky top-0 z-[95] w-full bg-neutral-50/90 backdrop-blur-sm border-b border-neutral-200'
        } transition-colors duration-300 font-sans`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between relative">
          {/* SOL: Sanatçı İmzası & Masaüstü Navigasyon */}
          <div className="flex items-center gap-4 xl:gap-8 shrink-0">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="flex flex-col group shrink-0"
              title="Derin Buse Demirkaya — nonvalue"
            >
              <span className="font-serif text-base sm:text-xl tracking-tight text-neutral-950 uppercase group-hover:opacity-75 transition-opacity leading-tight">
                Derin Buse Demirkaya
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.22em] text-neutral-500 uppercase -mt-0.5">
                Atölye & Arşiv
              </span>
            </Link>

            {/* Masaüstü Navigasyon */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className={`text-xs uppercase tracking-[0.14em] transition-all flex items-center gap-1.5 py-1 ${
                    link.highlight
                      ? 'px-3 py-1 bg-neutral-950 text-white hover:bg-neutral-800 font-mono shadow-[2px_2px_0px_#666]'
                      : 'text-neutral-700 hover:text-neutral-950 font-sans font-medium'
                  }`}
                >
                  {link.highlight && <Film className="w-3 h-3 text-amber-300" />}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* 
            KURAL 1, 2, 3: Merkeze Vurgulu ve Renk Değiştiren Logo (Z-[101])
            - 3 saniye boyunca devasa boyutta ve tam ortada (scale: 4, y: "40vh") hareketsiz bekler (delay: 3).
            - 3 saniye sonra TAM 6 SANİYE içinde yavaşça süzülerek scale: 1, y: "0vh" konumuna yerleşir (duration: 6).
            - GPU hızlandırma: Sadece scale, y, opacity kullanır; layout tetikleyici property yoktur.
            - style={{ willChange: "transform, opacity" }} ile pürüzsüz GPU render.
            - Easing: [0.45, 0, 0.15, 1].
            - Beyazdan siyaha renk dönüşümü overlay ile kusursuz senkronize.
          */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-[101] flex items-center justify-center ${
              isAnimationFinished ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <motion.div
              initial={{ y: '40vh', scale: 4 }}
              animate={{ y: '0vh', scale: 1 }}
              transition={{
                delay: 3,
                duration: 6,
                ease: [0.45, 0, 0.15, 1], // Su gibi pürüzsüz akış eğrisi
              }}
              style={{ willChange: 'transform, opacity' }}
              className="origin-center relative flex items-center justify-center select-none"
            >
              <Link
                href="/"
                onClick={() => soundFx.playClick()}
                className="relative block select-none group"
                title="nonvalue — Ana Sayfa"
              >
                {/* Beyaz Logo Katmanı: 3 saniye parıldar, ardından 6 saniye içinde beyazdan şeffafa erir */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{
                    delay: 3,
                    duration: 6,
                    ease: [0.45, 0, 0.15, 1],
                  }}
                  style={{ willChange: 'opacity' }}
                  className="relative z-10 filter invert brightness-200 drop-shadow-[0_0_24px_rgba(255,255,255,0.7)]"
                >
                  <Image
                    src="/nonvalue-logo.png"
                    alt="nonvalue logo"
                    width={180}
                    height={34}
                    priority
                    className="h-6 sm:h-8 md:h-9 w-auto object-contain"
                  />
                </motion.div>

                {/* Siyah Logo Katmanı: 3 saniye gizli kalır, 6 saniyede belirip header'daki yuvasına oturur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 3,
                    duration: 6,
                    ease: [0.45, 0, 0.15, 1],
                  }}
                  style={{ willChange: 'opacity' }}
                  className="absolute inset-0 z-20 flex items-center justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform"
                >
                  <Image
                    src="/nonvalue-logo.png"
                    alt="nonvalue logo"
                    width={180}
                    height={34}
                    priority
                    className="h-6 sm:h-8 md:h-9 w-auto object-contain"
                  />
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* SAĞ: Araçlar, Arama, Dil, Ses & Profil */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Hızlı Arama Butonu (⌘K) */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsSearchOpen(true);
              }}
              onMouseEnter={() => soundFx.playHover()}
              title={language === 'EN' ? 'Quick Search (⌘K)' : 'Hızlı Arama (⌘K)'}
              className="border border-neutral-950 bg-white hover:bg-neutral-950 hover:text-white px-2 sm:px-2.5 py-1 sm:py-1.5 transition-colors flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider shadow-[1px_1px_0px_#000]"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{language === 'EN' ? 'Search' : 'Ara'}</span>
              <kbd className="hidden md:inline-block border border-neutral-300 bg-neutral-100 text-neutral-600 px-1 py-0.2 text-[9px]">
                ⌘K
              </kbd>
            </button>

            {/* Stüdyo / CMS Yönetim Butonu */}
            <Link
              href="/admin"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              title="Sanatçı Stüdyosu & CMS"
              className="hidden sm:flex border border-neutral-950 bg-neutral-900 text-amber-300 hover:bg-neutral-800 px-2 sm:px-2.5 py-1 sm:py-1.5 transition-colors items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider shadow-[1px_1px_0px_#000]"
            >
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              <span>Stüdyo</span>
            </Link>

            {/* TR / EN Dil Düğmesi */}
            <div className="flex border border-neutral-950 overflow-hidden text-[10px] sm:text-[11px] font-mono font-bold">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  if (language !== 'TR') toggleLanguage();
                }}
                className={`px-1.5 sm:px-2.5 py-1 transition-colors ${
                  language === 'TR'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:text-neutral-950 bg-white'
                }`}
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  if (language !== 'EN') toggleLanguage();
                }}
                className={`px-1.5 sm:px-2.5 py-1 transition-colors ${
                  language === 'EN'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:text-neutral-950 bg-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Ses FX Aç/Kapa Düğmesi */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={isMuted ? t('nav.soundOff') : t('nav.soundOn')}
              className={`hidden md:flex border border-neutral-950 p-1.5 transition-colors ${
                isMuted
                  ? 'text-neutral-400 bg-neutral-100'
                  : 'text-neutral-950 hover:bg-neutral-200 bg-white'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Giriş / Profil Butonu */}
            {isAuthenticated && user ? (
              <Link
                href="/profil"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="hidden sm:inline-flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider shadow-[1px_1px_0px_#666] transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/giris"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="hidden sm:inline-flex items-center gap-1 border border-neutral-950 hover:bg-neutral-950 hover:text-white px-2 py-1 font-mono text-[11px] uppercase tracking-wider transition-all bg-white"
              >
                <UserIcon className="w-3 h-3" />
                <span>{t('nav.login')}</span>
              </Link>
            )}

            {/* Mobil Menü Butonu */}
            <button
              className="lg:hidden text-neutral-950 p-1.5 focus:outline-none border border-neutral-950 bg-white ml-0.5"
              onClick={() => {
                soundFx.playClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-label="Menüyü Aç/Kapat"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobil Menü Çekmecesi */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b-2 border-neutral-950 bg-neutral-50/98 backdrop-blur-lg shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col py-4 px-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    soundFx.playClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-sm uppercase tracking-widest py-2.5 border-b border-neutral-200 flex items-center justify-between ${
                    link.highlight ? 'font-mono font-bold text-amber-600' : 'text-neutral-800'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="text-[10px] px-2 py-0.5 bg-neutral-950 text-white font-mono">
                      YENİ
                    </span>
                  )}
                </Link>
              ))}

              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/admin"
                  onClick={() => {
                    soundFx.playClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 bg-neutral-900 text-amber-300 font-mono text-xs uppercase tracking-wider border border-neutral-950 flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  <span>Sanatçı Stüdyosu & CMS</span>
                </Link>

                {isAuthenticated && user ? (
                  <Link
                    href="/profil"
                    onClick={() => {
                      soundFx.playClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2 bg-neutral-950 text-white font-mono text-xs uppercase tracking-wider"
                  >
                    Profil ({user.name})
                  </Link>
                ) : (
                  <Link
                    href="/giris"
                    onClick={() => {
                      soundFx.playClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2 border border-neutral-950 text-neutral-950 font-mono text-xs uppercase tracking-wider bg-white"
                  >
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global Arama Modalı */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
