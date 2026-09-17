'use client';

import { usePathname } from 'next/navigation';
import GlobalHeader from './GlobalHeader';
import Footer from './Footer';
import VerticalNavigation from './VerticalNavigation';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Ana Sayfa (Yatay Dergi): 9 saniyelik sinematik introyu içeren GlobalHeader ve 100vh yatay dergi sargısı
  if (isHomePage) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-neutral-950 text-neutral-100 relative">
        <GlobalHeader />
        {children}
      </div>
    );
  }

  // Alt sayfalar (/koleksiyon, /arsiv, /atolye, /admin vb.):
  // GlobalHeader, dikey navigasyon ve footer ile tam konforlu gezinim.
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-800 pr-20 sm:pr-24">
      <GlobalHeader />
      <VerticalNavigation />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
    </div>
  );
}
