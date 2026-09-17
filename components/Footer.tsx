export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 bg-neutral-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8">
        <div>
          <span className="font-serif text-xl sm:text-2xl tracking-widest text-neutral-950 uppercase block">
            Derin Buse Demirkaya
          </span>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 font-mono tracking-widest uppercase">
            nonvalue jewel • contemporary jewelry & objects
          </p>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1.5 sm:mt-2 font-sans">
            © {new Date().getFullYear()} Derin Demirkaya. Tüm hakları saklıdır.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-8 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-neutral-700">
          <a
            href="https://instagram.com/nonvalue_jewel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-950 underline transition-colors"
          >
            @nonvalue_jewel
          </a>
          <a
            href="https://instagram.com/derinsem__"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-950 underline transition-colors"
          >
            @derinsem__
          </a>
          <a
            href="mailto:nonvaluejewel@gmail.com"
            className="hover:text-neutral-950 underline transition-colors"
          >
            nonvaluejewel@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
