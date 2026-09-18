'use client';

import { usePathname } from 'next/navigation';
import CinematicLogoIntro from './CinematicLogoIntro';
import Footer from './Footer';
import VerticalNavigation from './VerticalNavigation';
import type { Dictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/i18n-config';

interface AppLayoutShellProps {
  children: React.ReactNode;
  lang?: Locale;
  dict?: Dictionary;
}

export default function AppLayoutShell({ children, lang, dict }: AppLayoutShellProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/tr' || pathname === '/en';

  // Ana Sayfa (Yatay Dergi): 9 saniyelik sinematik intro ve bağımsız z-[101] üst-orta logo
  if (isHomePage) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-neutral-950 text-neutral-100 relative">
        <CinematicLogoIntro />
        {children}
      </div>
    );
  }

  // Alt sayfalar (/koleksiyon, /arsiv, /atolye, /admin vb.):
  // Üst-ortada yalnız ve görkemli "nonvalue" logosu, sağ kenarda dikey navigasyon (mobilde alt bar), altta footer.
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 pr-0 md:pr-16 lg:pr-24 pb-14 md:pb-0 relative">
      <CinematicLogoIntro />
      <VerticalNavigation lang={lang} dict={dict} />
      <main className="flex-grow w-full pt-16 sm:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
