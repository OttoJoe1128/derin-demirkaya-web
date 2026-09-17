'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

/**
 * KURAL 3: Pasif E-Ticaret ve Kayıt Altyapısı (Future-Proofing)
 * Bu bayrak 'false' olduğunda Sepet (Cart) ve Kullanıcı Giriş (Sign In/Register)
 * butonları render edilmez, ancak tüm mantık, state ve ikon altyapısı hazır bekler.
 * Aktifleştirmek için bu değeri 'true' yapmanız yeterlidir.
 */
const IS_ECOMMERCE_ACTIVE = false;

export default function VerticalNavigation() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundFx.getMuted());

  // Pasif e-ticaret sepet durumu (Future-proof altyapı)
  const [cartCount] = useState<number>(0);

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { name: t('nav.collection') || 'Koleksiyon', href: '/koleksiyon' },
    { name: t('nav.archive') || 'Arşiv', href: '/arsiv' },
    { name: t('nav.workshops') || 'Atölye', href: '/atolye' },
    { name: 'Stüdyo', href: '/admin', isStudio: true },
  ];

  return (
    <>
      {/* 
        KURAL 2 & 4: Sağ Kenar Dikey Navigasyonu (Semantic <nav>, z-[90], a11y focus-visible)
        - Ekranın SAĞ KESİTİNE tam boy sabitlenmiş (fixed right-0 top-0 h-screen w-20 sm:w-24)
        - Arka planı blur'lu lüks cam efekti (bg-neutral-950/80 backdrop-blur-xl)
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
            href="/"
            onClick={() => soundFx.playClick()}
            title="Derin Buse Demirkaya — Ana Sayfa"
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
            title={language === 'EN' ? 'Search (⌘K)' : 'Arama (⌘K)'}
            aria-label="Arama"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800/80 rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* ORTA: Dikey Okunan Linkler (Koleksiyon, Arşiv, Atölye, Stüdyo) */}
        <div className="flex flex-col items-center gap-8 sm:gap-10 my-auto py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

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
                  KURAL 2: Yukarıdan aşağıya doğru okunacak dikey metin:
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

        {/* ALT: Ses, Dil ve KURAL 3 Pasif E-Ticaret / Giriş Altyapısı */}
        <div className="flex flex-col items-center gap-3.5 w-full px-2">
          {/* 
            KURAL 3: PASİF E-TİCARET VE KAYIT ALTYAPISI
            IS_ECOMMERCE_ACTIVE = false iken gizli kalır;
            true yapıldığında eksiksiz sepet ve kullanıcı giriş arayüzü aktifleşir.
          */}
          {IS_ECOMMERCE_ACTIVE && (
            <div
              id="ecommerce-module"
              className="flex flex-col items-center gap-3 pt-2 border-t border-neutral-800 w-full"
            >
              {/* Sepet Butonu */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  // Sepet çekmecesini açma mantığı buraya bağlanır
                }}
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

              {/* Kullanıcı Giriş / Kayıt Butonu */}
              {isAuthenticated && user ? (
                <Link
                  href="/profil"
                  onClick={() => soundFx.playClick()}
                  aria-label={`Kullanıcı Profili: ${user.name}`}
                  className="p-2 text-amber-300 hover:bg-neutral-800/80 rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Sparkles className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/giris"
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
            title={isMuted ? t('nav.soundOff') : t('nav.soundOn')}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="p-2 text-neutral-400 hover:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* TR / EN Dil Düğmesi (Dikey minik toggle) */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              toggleLanguage();
            }}
            title="Dili Değiştir (TR / EN)"
            className="font-mono text-[10px] tracking-widest uppercase py-1 px-1.5 border border-neutral-700 hover:border-neutral-400 text-neutral-400 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {language}
          </button>
        </div>
      </nav>

      {/* Global Hızlı Arama Modalı */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
