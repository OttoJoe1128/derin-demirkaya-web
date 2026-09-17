'use client';

import { usePathname } from 'next/navigation';
import CinematicLogoIntro from './CinematicLogoIntro';
import Footer from './Footer';
import VerticalNavigation from './VerticalNavigation';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

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
  // Üst-ortada yalnız ve görkemli "nonvalue" logosu, sağ kenarda dikey navigasyon ve altta footer.
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 pr-20 sm:pr-24 relative">
      <CinematicLogoIntro />
      <VerticalNavigation />
      <main className="flex-grow w-full pt-16 sm:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
