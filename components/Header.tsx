'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Film, Volume2, VolumeX, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { soundFx } from '@/lib/sound-fx';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isMuted, setIsMuted] = useState(() => soundFx.getMuted());

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
    <header className="sticky top-0 z-50 w-full border-b border-neutral-300/80 bg-neutral-50/95 backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link 
          href="/" 
          onClick={() => soundFx.playClick()}
          className="flex flex-col group shrink-0"
        >
          <span className="font-serif text-xl sm:text-2xl tracking-tight text-neutral-950 uppercase group-hover:opacity-75 transition-opacity">
            Derin Buse Demirkaya
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase -mt-1">
            nonvalue jewel • 2018–2025
          </span>
        </Link>

        {/* Masaüstü Navigasyon */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className={`text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 py-1 ${
                link.highlight
                  ? 'px-3 py-1.5 bg-neutral-950 text-white hover:bg-neutral-800 font-mono shadow-[2px_2px_0px_#666]'
                  : 'text-neutral-700 hover:text-neutral-950 font-sans'
              }`}
            >
              {link.highlight && <Film className="w-3 h-3 text-amber-300" />}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sağ Araçlar: Dil Switcher, Ses FX & Profil / Giriş */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* TR / EN Dil Düğmesi */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              toggleLanguage();
            }}
            onMouseEnter={() => soundFx.playHover()}
            title={language === 'TR' ? 'Switch to English' : 'Türkçe\'ye Geç'}
            className="border border-neutral-950 px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider hover:bg-neutral-950 hover:text-white transition-colors"
          >
            {language === 'TR' ? 'EN' : 'TR'}
          </button>

          {/* Ses FX Aç/Kapa Düğmesi */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? t('nav.soundOff') : t('nav.soundOn')}
            className={`border border-neutral-950 p-1.5 transition-colors ${
              isMuted ? 'text-neutral-400 bg-neutral-100' : 'text-neutral-950 hover:bg-neutral-200'
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
              className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_#666] transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span className="max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              href="/giris"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="inline-flex items-center gap-1.5 border border-neutral-950 hover:bg-neutral-950 hover:text-white px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all"
            >
              <UserIcon className="w-3 h-3" />
              <span>{t('nav.login')}</span>
            </Link>
          )}
        </div>

        {/* Mobil Menü Butonu & Araçları */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="border border-neutral-950 px-2 py-0.5 text-[10px] font-mono font-bold"
          >
            {language}
          </button>

          <button
            className="text-neutral-950 p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menüyü Aç/Kapat"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobil Navigasyon Çekmecesi */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b-2 border-neutral-950 bg-neutral-50 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col py-4 px-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(false);
                }}
                className={`text-xs uppercase tracking-widest py-3 border-b border-neutral-200 flex items-center justify-between ${
                  link.highlight ? 'font-bold text-neutral-950' : 'text-neutral-700'
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && <span className="text-[10px] font-mono bg-neutral-950 text-white px-2 py-0.5">CANLI</span>}
              </Link>
            ))}

            {/* Mobil Giriş / Profil Butonu */}
            <div className="pt-4 flex items-center justify-between gap-3">
              {isAuthenticated && user ? (
                <Link
                  href="/profil"
                  onClick={() => {
                    soundFx.playClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-neutral-950 text-white font-mono text-xs uppercase py-2.5 shadow-[2px_2px_0px_#666]"
                >
                  {t('nav.profile')} ({user.name.split(' ')[0]})
                </Link>
              ) : (
                <Link
                  href="/giris"
                  onClick={() => {
                    soundFx.playClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center border-2 border-neutral-950 font-mono text-xs uppercase py-2.5"
                >
                  {t('nav.login')}
                </Link>
              )}

              <button
                onClick={handleToggleSound}
                className="border-2 border-neutral-950 p-2.5 shrink-0"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
