import Link from "next/link";
import { ARTWORKS_DATA } from "@/lib/artworks-data";
import CollectionGallery from "@/components/CollectionGallery";

export const metadata = {
  title: "nonvalue • archive — Derin Buse Demirkaya",
  description: "Süreç odaklı çağdaş takı, mekansal heykel ve eskiz arşivi. Ateşin dönüştürücü gücüyle şekillenen 2018–2025 eserleri.",
};

export default function KoleksiyonPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Üst Başlık & Editoryal Giriş */}
        <div className="mb-14 md:mb-18">
          <Link
            href="/"
            className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 transition-colors mb-4 inline-block"
          >
            ← Ana Sayfa
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-neutral-200/80 pb-10">
            <div>
              <span className="text-xs font-sans text-neutral-400 uppercase tracking-[0.25em] block mb-2">
                Derin Buse Demirkaya / nonvalue jewel
              </span>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-neutral-950 uppercase tracking-tighter">
                Arşiv & Koleksiyon
              </h1>
              <p className="font-sans text-neutral-600 text-xs tracking-widest uppercase mt-4 max-w-2xl leading-relaxed">
                the works presented here emerge from process-based making, shaped by movement, material encounters and situational production. each piece reflects a moment, a place or a condition rather than a fixed outcome.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 text-neutral-500 text-xs font-mono uppercase tracking-wider bg-white p-4 border border-neutral-200/60 shadow-xs">
              <div>
                <span className="text-neutral-400 block text-[10px]">Toplam Arşiv</span>
                <span className="text-neutral-950 font-bold">{ARTWORKS_DATA.length} Eser</span>
              </div>
              <div className="border-l border-neutral-200 pl-6">
                <span className="text-neutral-400 block text-[10px]">Dönem</span>
                <span className="text-neutral-950 font-bold">2018 — 2025</span>
              </div>
              <div className="border-l border-neutral-200 pl-6">
                <span className="text-neutral-400 block text-[10px]">Akslar</span>
                <span className="text-neutral-950 font-bold">Object • Space • Line</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dinamik Filtreli Galeri */}
        <CollectionGallery artworks={ARTWORKS_DATA} />

        {/* Alt Bilgi & Sanatçı Beyanı */}
        <div className="mt-32 pt-16 border-t border-neutral-200/80 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 block mb-2">
              Zanaat & Atölye
            </span>
            <p className="text-xs font-sans text-neutral-600 leading-relaxed">
              Marmara Üniversitesi Takı Tasarımı ve Grand Bazaar geleneksel çıraklık eğitimiyle harmanlanan deneysel metal ve gümüş çalışmaları.
            </p>
          </div>
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 block mb-2">
              Kondisyon & Sertifika
            </span>
            <p className="text-xs font-sans text-neutral-600 leading-relaxed">
              Her eser sanatçı imzalı orijinallik belgesiyle özel korumalı ahşap kutusunda teslim edilir. 1/1 parçalar tekil olarak numaralandırılmıştır.
            </p>
          </div>
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 block mb-2">
              İletişim & Özel Eser
            </span>
            <p className="text-xs font-sans text-neutral-600 leading-relaxed">
              Özel sergi, galeri veya sipariş talepleri için doğrudan sanatçı ile temas kurabilirsiniz:{" "}
              <a href="mailto:nonvaluejewel@gmail.com" className="text-neutral-950 underline font-medium">
                nonvaluejewel@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
