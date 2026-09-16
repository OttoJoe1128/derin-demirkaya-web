import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-neutral-50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <span className="font-serif text-xl tracking-widest text-primary uppercase">
            Derin Demirkaya
          </span>
          <p className="text-sm text-accent mt-2 font-sans tracking-wide">
            © {new Date().getFullYear()} Tüm hakları saklıdır.
          </p>
        </div>
        <div className="flex gap-6 text-xs font-sans uppercase tracking-widest text-neutral-800">
          <Link href="/gizlilik" className="hover:text-accent transition-colors duration-300">
            Gizlilik Politikası
          </Link>
          <Link href="/sartlar" className="hover:text-accent transition-colors duration-300">
            Kullanım Şartları
          </Link>
        </div>
      </div>
    </footer>
  );
}
