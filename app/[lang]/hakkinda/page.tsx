import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Manifesto & Info — Derin Buse Demirkaya | nonvalue",
  description: "nonvalue manifesto and studio contact.",
};

export default function LocalizedHakkindaPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-40 sm:pt-48 pb-20 p-6 select-none selection:bg-white selection:text-black overflow-y-auto">
      {/* Ekranın tam merkezindeki manifesto görseli */}
      <div className="relative flex items-center justify-center max-w-full">
        <Image
          src="/nvinfo.png"
          alt="nonvalue manifesto"
          width={800}
          height={600}
          className="object-contain max-w-full h-auto invert"
          priority
          unoptimized={true}
        />
      </div>

      {/* Sayfanın alt kısmındaki minimal Mail ve Instagram flex satırı */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
        <a
          href="mailto:derinbusedemirkaya@gmail.com"
          className="hover:text-white transition-colors underline underline-offset-4 decoration-neutral-700 hover:decoration-white"
        >
          mail • derinbusedemirkaya@gmail.com
        </a>
        <span className="text-neutral-700 hidden sm:inline">•</span>
        <a
          href="https://instagram.com/derinsem__"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors underline underline-offset-4 decoration-neutral-700 hover:decoration-white"
        >
          instagram • @derinsem__
        </a>
      </div>
    </div>
  );
}
