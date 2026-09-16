import Link from 'next/link';

interface CollectionCardProps {
  id: string;
  title: string;
  category: string;
  price?: string;
}

export default function CollectionCard({ id, title, category, price }: CollectionCardProps) {
  return (
    <article className="group cursor-pointer flex flex-col gap-4">
      {/* Görsel Alanı - Şimdilik Yer Tutucu (Placeholder) */}
      <Link href={`/koleksiyon/${id}`} className="block relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-500 z-10" />
        {/* Gerçek görseller eklendiğinde buraya next/image gelecek */}
        <div className="w-full h-full flex items-center justify-center text-accent/50 font-sans text-sm tracking-widest uppercase">
          Görsel Bekleniyor
        </div>
      </Link>
      
      {/* Metin Alanı */}
      <div className="flex flex-col items-center text-center space-y-1">
        <span className="text-xs font-sans text-accent uppercase tracking-widest">
          {category}
        </span>
        <h3 className="font-serif text-lg text-neutral-900">
          <Link href={`/koleksiyon/${id}`} className="hover:opacity-70 transition-opacity">
            {title}
          </Link>
        </h3>
        {price && (
          <span className="text-sm font-sans text-neutral-800">
            {price}
          </span>
        )}
      </div>
    </article>
  );
}
