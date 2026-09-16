import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-12 text-center max-w-7xl mx-auto">
      <div className="w-full max-w-3xl space-y-8 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-serif text-primary uppercase tracking-widest leading-tight">
          Derin Demirkaya
        </h1>
        <div className="w-16 h-[1px] bg-accent mx-auto"></div>
        <p className="text-base md:text-lg text-neutral-800 font-sans font-light tracking-wide leading-relaxed">
          Özgün takı tasarımları, profesyonel sanat portfolyosu ve atölye rezervasyon yönetimi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/#koleksiyon"
            className="bg-primary hover:bg-neutral-800 text-neutral-50 px-8 py-3 text-sm uppercase tracking-widest transition-all duration-300 inline-block text-center"
          >
            Koleksiyon
          </Link>
          <Link
            href="/atolye"
            className="border border-primary text-primary hover:bg-neutral-100 px-8 py-3 text-sm uppercase tracking-widest transition-all duration-300 inline-block text-center"
          >
            Atölye Takvimi
          </Link>
        </div>
      </div>
    </section>
  );
}

