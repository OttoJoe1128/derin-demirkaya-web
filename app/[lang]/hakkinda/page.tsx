import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Hakkında & Manifesto — Derin Buse Demirkaya | nonvalue jewel",
  description: "produces work based on process • material • movement. Derin Buse Demirkaya monografisi.",
};

export default function LocalizedHakkindaPage() {
  return (
    <div className="relative w-full min-h-screen bg-black text-neutral-200 overflow-hidden selection:bg-white selection:text-black">
      {/* 0. ARKA PLAN DOKUSU (Untitled design - 1.png - Hafif Vurgu) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/Untitled design - 1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20 mix-blend-screen"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 pt-24 sm:pt-32 pb-32 px-6 sm:px-12 max-w-4xl mx-auto">
        {/* 1. ÜST KİMLİK & MİNİMALİST KÜNYE (MAKSİMUM 14PX KURALI) */}
        <section className="mb-14 sm:mb-20">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="font-mono text-[10px] text-neutral-400 tracking-[0.35em] uppercase">
              NONVALUE // ARTIST STATEMENT
            </span>
          </div>

          <h1 className="font-serif text-[14px] text-white tracking-widest uppercase font-normal mb-6">
            Derin Buse Demirkaya
          </h1>

          {/* Minimalist Manifesto ve İletişim Bloğu */}
          <div className="space-y-4 font-mono text-[12px] text-neutral-300 leading-relaxed border-l-2 border-neutral-800 pl-4 sm:pl-6 py-1">
            <p className="text-white font-normal tracking-wide">
              produces work based on process • material • movement
            </p>

            <div className="space-y-1 text-neutral-400 text-[12px]">
              <span className="text-white block font-medium">open</span>
              <p>exhibitions • residencies • collaborations</p>
            </div>

            <div className="space-y-1 pt-2 text-neutral-300 text-[12px]">
              <p>
                mail •{' '}
                <a
                  href="mailto:derinbusedemirkaya@gmail.com"
                  className="text-white hover:underline underline-offset-4 decoration-neutral-600 transition-colors"
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
                  className="text-white hover:underline underline-offset-4 decoration-neutral-600 transition-colors"
                >
                  @derinsem__
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 2. SANATÇI PORTRESİ & MONOGRAFİ (Untitled design - 2.png) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-start mb-16 border-t border-neutral-900 pt-12">
          <div className="md:col-span-5 relative aspect-[3/4] w-full border border-neutral-800 bg-neutral-900 overflow-hidden shadow-2xl">
            <Image
              src="/Untitled design - 2.png"
              alt="Derin Buse Demirkaya"
              fill
              className="object-cover filter contrast-[1.05]"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="md:col-span-7 space-y-4 text-[12px] text-neutral-400 font-sans font-light leading-relaxed">
            <p>
              <strong className="text-white font-serif text-[14px] block mb-2 font-normal">
                Malzemenin Belleği ve Ateşin Dönüştürücü Gücü
              </strong>
              Marmara Üniversitesi Kuyumculuk Teknolojisi ve Tasarımı Bölümü’nden mezun olduktan sonra Hochschule Düsseldorf (HSD) bünyesinde çağdaş takı, heykel ve metal morfolojisi üzerine araştırmalar yürüttü.
            </p>
            <p>
              Geleneksel süsleme kalıplarını reddeden <span className="text-white font-mono text-[12px]">nonvalue</span> pratiği; kusurluluğu, erimiş gümüşün akışkanlığını, organik dokuları ve takının bedenle kurduğu heykelsi gerilimi merkeze alır. Her bir eser, seri üretimden uzak, doğrudan kayıp mum (lost-wax casting) tekniğiyle tekil veya sayılı edisyonlar olarak biçimlendirilir.
            </p>
            <p>
              Karaköy ve Galata eksenindeki stüdyosunda üretimini sürdüren Demirkaya, aynı zamanda bağımsız atölyeler ve malzeme laboratuvarları aracılığıyla kayıp mum ve döküm pratiklerini yeni kuşak yaratıcılarla paylaşmaktadır.
            </p>
          </div>
        </div>

        {/* 3. AKADEMİK & STÜDYO KRONOLOJİSİ */}
        <section className="border-t border-neutral-900 pt-10">
          <h2 className="font-serif text-[14px] text-white uppercase tracking-widest mb-6 font-normal">
            Akademik & Stüdyo Kronolojisi
          </h2>
          <div className="space-y-3 font-mono text-[10px] sm:text-[12px] text-neutral-400">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-900 gap-1">
              <span className="text-white font-normal text-[12px]">Hochschule Düsseldorf (HSD)</span>
              <span className="text-neutral-500 text-[10px]">Contemporary Jewellery & Object / Almanya</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-900 gap-1">
              <span className="text-white font-normal text-[12px]">Marmara Üniversitesi</span>
              <span className="text-neutral-500 text-[10px]">Kuyumculuk Teknolojisi ve Tasarımı / İstanbul</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-900 gap-1">
              <span className="text-white font-normal text-[12px]">nonvalue studio</span>
              <span className="text-neutral-500 text-[10px]">Karaköy Atölye ve Arşiv Kuruluşu (2018–Günümüz)</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
