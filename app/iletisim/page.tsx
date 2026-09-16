"use client";

import Link from "next/link";
import { Mail, MapPin, Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { soundFx } from "@/lib/sound-fx";

export default function IletisimPage() {
  const { language } = useLanguage();
  const isEn = language === "EN";

  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          onClick={() => soundFx.playClick()}
          className="text-xs font-sans uppercase tracking-widest text-neutral-500 hover:text-neutral-950 transition-colors mb-8 inline-block"
        >
          ← {isEn ? "Home" : "Ana Sayfa"}
        </Link>

        <h1 className="font-serif text-5xl md:text-7xl text-neutral-950 uppercase tracking-tighter mb-8">
          {isEn ? "Contact & Inquiries" : "İletişim"}
        </h1>

        <p className="text-neutral-700 font-sans font-light text-base md:text-lg mb-12">
          {isEn
            ? "For bespoke commissions, institutional acquisitions, and studio workshop sessions, reach out to the studio directly."
            : "Özel sipariş talepleri, koleksiyon soruları ve atölye rezervasyonları için stüdyo ile doğrudan iletişime geçebilirsiniz."}
        </p>

        <div className="space-y-6 border-t border-b border-neutral-200 py-8">
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-neutral-500" />
            <a
              href="mailto:nonvaluejewel@gmail.com"
              className="font-sans text-sm text-neutral-800 hover:text-neutral-950 underline underline-offset-4"
            >
              nonvaluejewel@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-neutral-500" />
            <span className="font-sans text-sm text-neutral-800">
              {isEn ? "Galata & Karaköy Studio, Beyoğlu / Istanbul • Izmir" : "Galata & Karaköy Stüdyosu, Beyoğlu / İstanbul • İzmir"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Globe className="h-5 w-5 text-neutral-500" />
            <a
              href="https://instagram.com/nonvalue_jewel"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-neutral-800 hover:text-neutral-950"
            >
              @nonvalue_jewel (Instagram) ↗
            </a>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/atolye"
            onClick={() => soundFx.playClick()}
            className="inline-block bg-neutral-950 text-neutral-50 px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            {isEn ? "View Workshop Calendar →" : "Atölye Takvimini İncele →"}
          </Link>
        </div>
      </div>
    </div>
  );
}


