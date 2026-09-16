import CollectionCard from "@/components/CollectionCard";
import Link from "next/link";
import { ARTWORKS_DATA } from "@/lib/artworks-data";

export const metadata = {
  title: "Koleksiyon — Derin Demirkaya",
  description: "Özgün çağdaş takı tasarımları, monolitik heykeller ve wabi-sabi seramik formları.",
};

export default function KoleksiyonPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Üst Başlık & Editoryal Giriş */}
        <div className="mb-16 md:mb-20">
          <Link
            href="/"
            className="text-xs font-sans uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors mb-4 inline-block"
          >
            ← Ana Sayfa
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200/80 pb-8">
            <div>
              <h1 className="font-serif text-5xl md:text-7xl text-neutral-950 uppercase tracking-tighter">
                Koleksiyon
              </h1>
              <p className="font-sans text-neutral-500 text-xs tracking-widest uppercase mt-3">
                Özgün takı tasarımları, monolitik heykeller ve seramik formlar
              </p>
            </div>
            <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider">
              Toplam {ARTWORKS_DATA.length} Eser / 2024–2025 Arşivi
            </div>
          </div>
        </div>

        {/* Eser Izgarası (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {ARTWORKS_DATA.map((item) => (
            <CollectionCard
              key={item.id}
              id={item.id}
              title={item.title}
              category={item.category}
              price={item.price}
              imageUrl={item.images[0]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
