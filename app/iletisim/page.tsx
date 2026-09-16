import Link from "next/link";
import { Mail, MapPin, Globe } from "lucide-react";

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-xs font-sans uppercase tracking-widest text-accent hover:text-primary transition-colors mb-8 inline-block"
        >
          ← Ana Sayfa
        </Link>

        <h1 className="font-serif text-5xl md:text-7xl text-primary uppercase tracking-tighter mb-8">
          İletişim
        </h1>

        <p className="text-neutral-700 font-sans font-light text-base md:text-lg mb-12">
          Özel sipariş talepleri, koleksiyon soruları ve atölye rezervasyonları için stüdyo ile
          doğrudan iletişime geçebilirsiniz.
        </p>

        <div className="space-y-6 border-t border-b border-neutral-200 py-8">
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-accent" />
            <span className="font-sans text-sm text-neutral-800">studio@derindemirkaya.com</span>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-accent" />
            <span className="font-sans text-sm text-neutral-800">
              Galata & Karaköy Stüdyosu, Beyoğlu / İstanbul
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Globe className="h-5 w-5 text-accent" />
            <span className="font-sans text-sm text-neutral-800">@derindemirkaya.studio</span>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/atolye"
            className="inline-block bg-primary text-neutral-50 px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Atölye Takvimini İncele
          </Link>
        </div>
      </div>
    </div>
  );
}

