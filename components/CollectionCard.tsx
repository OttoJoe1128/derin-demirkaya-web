import Link from 'next/link';
import Image from 'next/image';

interface CollectionCardProps {
  id: string;
  title: string;
  category: string;
  price?: string;
  imageUrl?: string;
}

export default function CollectionCard({ id, title, category, price, imageUrl }: CollectionCardProps) {
  return (
    <article className="group bg-white border border-neutral-950 p-3.5 shadow-[4px_4px_0px_#000] flex flex-col justify-between font-sans">
      {/* Üst Teknik Çapraz Çizgiler */}
      <div className="flex items-center justify-between border-b border-neutral-950 pb-2 mb-2 text-[10px] font-mono tracking-widest uppercase text-neutral-600">
        <span className="font-bold text-neutral-950">[+] REF // {id.toUpperCase()}</span>
        <span>[+]</span>
      </div>

      {/* Görsel Alanı */}
      <Link
        href={`/koleksiyon/${id}`}
        className="block relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-950"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs tracking-widest uppercase">
            GÖRSEL BEKLENİYOR
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-neutral-950 text-white px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          3D Detay →
        </div>
      </Link>

      {/* Metin ve Fiyat */}
      <div className="flex flex-col pt-3 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          <span>{category}</span>
          {price && <span className="font-bold text-neutral-950">{price}</span>}
        </div>

        <h3 className="font-serif text-xl uppercase tracking-tight text-neutral-950 group-hover:underline">
          <Link href={`/koleksiyon/${id}`}>
            {title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
