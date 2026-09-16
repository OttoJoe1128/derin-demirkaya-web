'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Film } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Koleksiyon', href: '/koleksiyon' },
    { name: 'Sinematik Arşiv', href: '/arsiv', highlight: true },
    { name: 'Atölye Takvimi', href: '/atolye' },
    { name: 'Hakkında', href: '/hakkinda' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-300/80 bg-neutral-50/95 backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex flex-col group"
        >
          <span className="font-serif text-2xl tracking-tight text-neutral-950 uppercase group-hover:opacity-75 transition-opacity">
            Derin Buse Demirkaya
          </span>
          <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase -mt-1">
            nonvalue jewel • 2018–2025
          </span>
        </Link>

        {/* Masaüstü Navigasyon */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-1.5 py-1 ${
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

        {/* Mobil Menü Butonu */}
        <button
          className="md:hidden text-neutral-950 p-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menüyü Aç/Kapat"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobil Navigasyon Çekmecesi */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-950 bg-neutral-50 shadow-2xl">
          <nav className="flex flex-col py-4 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-xs uppercase tracking-widest py-3.5 border-b border-neutral-200 last:border-none flex items-center justify-between ${
                  link.highlight ? 'font-bold text-neutral-950' : 'text-neutral-700'
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && <span className="text-[10px] font-mono bg-neutral-950 text-white px-2 py-0.5">CANLI</span>}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
