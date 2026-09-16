'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Koleksiyon', href: '/#koleksiyon' },
    { name: 'Atölye Takvimi', href: '/atolye' },
    { name: 'Arşiv', href: '/arsiv' },
    { name: 'Hakkında', href: '/hakkinda' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-neutral-50/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="font-serif text-2xl tracking-widest text-primary uppercase hover:opacity-80 transition-opacity"
        >
          Derin Demirkaya
        </Link>

        {/* Masaüstü Navigasyon */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-sans uppercase tracking-widest text-neutral-800 hover:text-accent transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobil Menü Butonu */}
        <button
          className="md:hidden text-primary focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menüyü Aç/Kapat"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobil Navigasyon Çekmecesi */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-neutral-50 border-b border-neutral-100 shadow-xl">
          <nav className="flex flex-col py-4 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-sans uppercase tracking-widest text-neutral-800 hover:text-accent py-4 border-b border-neutral-100 last:border-none"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
