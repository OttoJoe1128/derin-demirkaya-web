import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 py-20 text-center max-w-6xl mx-auto">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Üst Kimlik Rozeti */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 border border-neutral-300/80 bg-white/70 backdrop-blur-xs text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-600">
          <span>nonvalue jewel</span>
          <span className="w-1 h-1 rounded-full bg-neutral-400"></span>
          <span>contemporary jewelry & objects</span>
        </div>

        {/* Ana Başlık */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-neutral-950 uppercase tracking-tight leading-[0.95]">
            Derin Buse <br />
            <span className="italic font-light text-neutral-600">Demirkaya</span>
          </h1>
        </div>

        <div className="w-20 h-[1px] bg-neutral-300 mx-auto"></div>

        {/* Sanatçı Manifestosu */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-neutral-700 font-sans font-light tracking-wide leading-relaxed">
          Henüz değer atanmamış olanı açığa çıkarmayı araştıran çağdaş bir takı ve nesne pratiği. Ateşin dönüştürücü kuvveti, malzeme karşılaşmaları ve bedenle temas eden yaşayan yüzeyler.
        </p>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Link
            href="/#koleksiyon"
            className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-800 text-white px-9 py-4 text-xs uppercase tracking-[0.2em] font-sans transition-all duration-300 shadow-xs"
          >
            Koleksiyonu Keşfet
          </Link>
          <Link
            href="/koleksiyon"
            className="w-full sm:w-auto border border-neutral-900 text-neutral-950 hover:bg-neutral-100 px-9 py-4 text-xs uppercase tracking-[0.2em] font-sans transition-all duration-300"
          >
            Tüm Arşiv (2018–2025)
          </Link>
          <Link
            href="/atolye"
            className="w-full sm:w-auto text-neutral-500 hover:text-neutral-950 px-6 py-4 text-xs uppercase tracking-[0.2em] font-sans transition-colors duration-200"
          >
            Atölye & Takvim →
          </Link>
        </div>

        {/* Editoryal Mikro Bilgi */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-neutral-200/70 text-left">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Eğitim</span>
            <span className="text-xs font-sans text-neutral-800 font-medium">Marmara Üniv. & HSD Düsseldorf</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Temel Zanaat</span>
            <span className="text-xs font-sans text-neutral-800 font-medium">Kapalıçarşı Çıraklığı</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Son Sergi</span>
            <span className="text-xs font-sans text-neutral-800 font-medium">Tozman & Chiskari (2024–25)</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Lokasyon</span>
            <span className="text-xs font-sans text-neutral-800 font-medium">İzmir / İstanbul / Göçebe</span>
          </div>
        </div>

      </div>
    </section>
  );
}
