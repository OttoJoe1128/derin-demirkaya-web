import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Hakkında & Manifesto — Derin Buse Demirkaya | nonvalue jewel",
  description: "produces work based on process • material • movement. Derin Buse Demirkaya monografisi.",
};

export default function LocalizedHakkindaPage() {
  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 pt-24 sm:pt-32 pb-32 px-6 sm:px-12 max-w-4xl mx-auto selection:bg-white selection:text-black">
      {/* 1. ÜST KİMLİK & MİNİMALİST KÜNYE (KURAL 5) */}
      <section className="mb-16 sm:mb-24">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] sm:text-[10px] text-amber-400 tracking-[0.35em] uppercase">
            NONVALUE // ARTIST STATEMENT
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase font-light mb-8">
          Derin Buse Demirkaya
        </h1>

        {/* Minimalist Manifesto ve İletişim Bloğu */}
        <div className="space-y-6 font-mono text-xs sm:text-sm text-neutral-300 leading-relaxed border-l-2 border-neutral-800 pl-4 sm:pl-6 py-2">
          <p className="text-white font-normal tracking-wide">
            produces work based on process • material • movement
          </p>

          <div className="space-y-1 text-neutral-400">
            <span className="text-white block font-medium">open</span>
            <p>exhibitions • residencies • collaborations</p>
          </div>

          <div className="space-y-1.5 pt-2 text-neutral-300">
            <p>
              mail •{' '}
              <a
                href="mailto:derinbusedemirkaya@gmail.com"
                className="text-white hover:text-amber-400 underline underline-offset-4 decoration-neutral-700 hover:decoration-amber-400 transition-colors"
              >
                derinbusedemirkaya@gmail.com
              </a>
            </p>
            <p>
              - instagram{' '}
              <a
                href="https://instagram.com/derinsem__"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-amber-400 underline underline-offset-4 decoration-neutral-700 hover:decoration-amber-400 transition-colors"
              >
                @derinsem__
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 2. SANATÇI MONOGRAFİSİ & STÜDYO PORTRESİ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-start mb-20 border-t border-neutral-900 pt-16">
        <div className="md:col-span-5 relative aspect-[3/4] w-full border border-neutral-800 bg-neutral-900 overflow-hidden shadow-2xl">
          <Image
            src="/images/21bf96ed5a3d3e68ed19b405281e9e34.jpg"
            alt="Derin Buse Demirkaya"
            fill
            className="object-cover filter contrast-[1.05]"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
        </div>

        <div className="md:col-span-7 space-y-6 text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed">
          <p>
            <strong className="text-white font-serif text-base sm:text-lg block mb-1">
              Malzemenin Belleği ve Ateşin Dönüştürücü Gücü
            </strong>
            Marmara Üniversitesi Kuyumculuk Teknolojisi ve Tasarımı Bölümü’nden mezun olduktan sonra Hochschule Düsseldorf (HSD) bünyesinde çağdaş takı, heykel ve metal morfolojisi üzerine araştırmalar yürüttü.
          </p>
          <p>
            Geleneksel süsleme kalıplarını reddeden <span className="text-white font-mono">nonvalue</span> pratiği; kusurluluğu, erimiş gümüşün akışkanlığını, organik dokuları ve takının bedenle kurduğu heykelsi gerilimi merkeze alır. Her bir eser, seri üretimden uzak, doğrudan kayıp mum (lost-wax casting) tekniğiyle tekil veya sayılı edisyonlar olarak biçimlendirilir.
          </p>
          <p>
            Karaköy ve Galata eksenindeki stüdyosunda üretimini sürdüren Demirkaya, aynı zamanda bağımsız atölyeler ve malzeme laboratuvarları aracılığıyla kayıp mum ve döküm pratiklerini yeni kuşak yaratıcılarla paylaşmaktadır.
          </p>
        </div>
      </div>

      {/* 3. AKADEMİK & STÜDYO KRONOLOJİSİ */}
      <section className="border-t border-neutral-800 pt-12">
        <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-tight mb-8">
          Akademik & Stüdyo Kronolojisi
        </h2>
        <div className="space-y-4 font-mono text-xs text-neutral-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-900 gap-1">
            <span className="text-white font-semibold">Hochschule Düsseldorf (HSD)</span>
            <span className="text-neutral-500">Contemporary Jewellery & Object / Almanya</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-900 gap-1">
            <span className="text-white font-semibold">Marmara Üniversitesi</span>
            <span className="text-neutral-500">Kuyumculuk Teknolojisi ve Tasarımı / İstanbul</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-900 gap-1">
            <span className="text-white font-semibold">nonvalue studio</span>
            <span className="text-neutral-500">Karaköy Atölye ve Arşiv Kuruluşu (2018–Günümüz)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
