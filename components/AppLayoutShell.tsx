'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import VerticalNavigation from './VerticalNavigation';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Ana Sayfa (Yatay Dergi): Standart yatay üst bar ve alt footer tamamen kaldırılır.
  // Yerine VerticalNavigation ve 100vh yatay dergi sargısı geçer.
  if (isHomePage) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-neutral-950 text-neutral-100">
        {children}
      </div>
    );
  }

  // Alt sayfalar (/koleksiyon, /arsiv, /atolye, /admin vb.):
  // Hem sağ dikey navigasyon korunur hem de sayfa içerikleri konforlu gezinilebilir.
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-800 pr-20 sm:pr-24">
      <VerticalNavigation />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
    </div>
  );
}
