import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Hakkında & Monografi — Derin Buse Demirkaya | nonvalue jewel",
  description: "Marmara Üniversitesi ve Hochschule Düsseldorf kökenli çağdaş takı ve mekansal nesne tasarımcısı Derin Buse Demirkaya monografisi.",
};

export default function LocalizedHakkindaPage() {
  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 pt-20 sm:pt-28 pb-24 px-4 sm:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="border-b border-neutral-800 pb-8 mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] sm:text-[10px] text-amber-400 tracking-[0.3em] uppercase">
            MONOGRAPH // BIO
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase font-light">
          Derin Buse Demirkaya
        </h1>
        <p className="mt-3 font-mono text-xs sm:text-sm text-neutral-400">
          nonvalue jewel • Heykelsi Takı, Kayıp Mum Döküm ve Mekansal Nesneler
        </p>
      </header>

      {/* Grid: Image and Bio */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-start mb-16">
        <div className="md:col-span-5 relative aspect-[3/4] w-full border border-neutral-800 bg-neutral-900">
          <Image
            src="/images/21bf96ed5a3d3e68ed19b405281e9e34.jpg"
            alt="Derin Demirkaya Studio"
            fill
            className="object-cover filter contrast-[1.05]"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
        </div>

        <div className="md:col-span-7 space-y-6 text-xs sm:text-sm text-neutral-300 font-sans font-light leading-relaxed">
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

      {/* Timeline & Credentials */}
      <section className="border-t border-neutral-800 pt-10">
        <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-tight mb-6">
          Akademik & Stüdyo Kronolojisi
        </h2>
        <div className="space-y-4 font-mono text-xs text-neutral-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-900">
            <span className="text-white font-semibold">Hochschule Düsseldorf (HSD)</span>
            <span className="text-neutral-500">Contemporary Jewellery & Object / Almanya</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-900">
            <span className="text-white font-semibold">Marmara Üniversitesi</span>
            <span className="text-neutral-500">Kuyumculuk Teknolojisi ve Tasarımı / İstanbul</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-900">
            <span className="text-white font-semibold">nonvalue studio</span>
            <span className="text-neutral-500">Karaköy Atölye ve Arşiv Kuruluşu (2018–Günümüz)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
