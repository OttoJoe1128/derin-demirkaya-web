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
    <article className="group cursor-pointer flex flex-col gap-4">
      {/* Görsel Alanı */}
      <Link href={`/koleksiyon/${id}`} className="block relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-200/50">
        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-500 z-10" />
        
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 font-sans text-xs tracking-widest uppercase">
            Görsel Bekleniyor
          </div>
        )}
      </Link>
      
      {/* Metin Alanı */}
      <div className="flex flex-col items-center text-center space-y-1.5 pt-1">
        <span className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">
          {category}
        </span>
        <h3 className="font-serif text-lg text-neutral-900">
          <Link href={`/koleksiyon/${id}`} className="hover:opacity-70 transition-opacity">
            {title}
          </Link>
        </h3>
        {price && (
          <span className="text-sm font-sans text-neutral-800 font-light">
            {price}
          </span>
        )}
      </div>
    </article>
  );
}
