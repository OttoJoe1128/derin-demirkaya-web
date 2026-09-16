import CollectionCard from "@/components/CollectionCard";
import Link from "next/link";

export default function KoleksiyonPage() {
  const collectionItems = [
    {
      id: "1",
      title: "Ham Gümüş Yüzük",
      category: "Takı Tasarımı — Koleksiyon 01",
      price: "₺1.250",
    },
    {
      id: "2",
      title: "Toprak ve Form Vazo",
      category: "Seramik & Heykel",
      price: "₺2.400",
    },
    {
      id: "3",
      title: "Toprak ve Form Obje",
      category: "Heykel Serisi",
      price: "₺2.100",
    },
    {
      id: "4",
      title: "Bronz Dövme Küpe",
      category: "Takı Tasarımı — Koleksiyon 02",
      price: "₺950",
    },
    {
      id: "5",
      title: "Raku Çay Çanağı (Chawan)",
      category: "Wabi-Sabi Seramik",
      price: "₺1.850",
    },
    {
      id: "6",
      title: "Asimetrik Kaide Vazo",
      category: "Heykelimsi Objeler",
      price: "₺3.200",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <Link
            href="/"
            className="text-xs font-sans uppercase tracking-widest text-accent hover:text-primary transition-colors mb-4 inline-block"
          >
            ← Ana Sayfa
          </Link>
          <h1 className="font-serif text-5xl md:text-7xl text-primary uppercase tracking-tighter">
            Koleksiyon
          </h1>
          <p className="font-sans text-neutral-600 text-sm tracking-widest uppercase mt-3">
            Özgün takı tasarımları ve heykel formları
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {collectionItems.map((item) => (
            <CollectionCard
              key={item.id}
              id={item.id}
              title={item.title}
              category={item.category}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
