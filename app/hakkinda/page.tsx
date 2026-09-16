"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { soundFx } from "@/lib/sound-fx";

export default function HakkindaPage() {
  const { language } = useLanguage();
  const isEn = language === "EN";

  const exhibitions = [
    { year: "2025", title: "nonvalue", venue: "bazaar shop | Hormoz Island", location: "Iran" },
    { year: "2024", title: "nonvalue", venue: "pop-up bazaar | Chiskari Community", location: "Tbilisi • Georgia" },
    { year: "2024", title: "nonvalue", venue: "art fair | Alan Pa", location: "İzmir • Turkey" },
    { year: "2024", title: "selflove", venue: "solo exhibition | Tozman bazaar", location: "Eskişehir • Turkey" },
    { year: "2022", title: "not a jewelry", venue: "exhibition ARA | Co-Operative Community", location: "Eskişehir • Turkey" },
    { year: "2019", title: "eat w what", venue: "art gallery | Cumhuriyet Müzesi", location: "İstanbul • Turkey" },
    { year: "2018", title: "just jewel", venue: "group exhibition | Hochschule Düsseldorf", location: "Düsseldorf • Germany" },
    { year: "2017", title: "amorph.", venue: "group exhibition | Marmara University", location: "İstanbul • Turkey" },
  ];

  const education = isEn
    ? [
        {
          period: "2015 – 2021",
          institution: "Marmara University",
          degree: "Bachelor in School of Jewelry Technology and Design | Silver & Metalworks",
          location: "İstanbul | Turkey",
        },
        {
          period: "2018 – 2019",
          institution: "HSD • Hochschule Düsseldorf",
          degree: "Erasmus | Jewelry & Applied and Design Program",
          location: "Düsseldorf | Germany",
        },
        {
          period: "2017 – 2018",
          institution: "Dilde Gümüş • Kapalıçarşı (Grand Bazaar) Apprenticeship",
          degree: "Traditional Jewelry Craftsmanship | Silverwork & Hand Engraving",
          location: "İstanbul | Turkey",
        },
        {
          period: "2015 – 2016",
          institution: "İKO GLT • Gemologist Laboratory",
          degree: "Diamond & Colored Stones Identification Certificate",
          location: "İstanbul | Turkey",
        },
      ]
    : [
        {
          period: "2015 – 2021",
          institution: "Marmara Üniversitesi",
          degree: "Takı Teknolojisi ve Tasarımı Yüksekokulu | Gümüş ve Metal İşleri",
          location: "İstanbul | Türkiye",
        },
        {
          period: "2018 – 2019",
          institution: "HSD • Hochschule Düsseldorf",
          degree: "Erasmus | Çağdaş Takı & Uygulamalı Tasarım Programı",
          location: "Düsseldorf | Almanya",
        },
        {
          period: "2017 – 2018",
          institution: "Dilde Gümüş • Kapalıçarşı Çıraklık & Ustalık Eğitimi",
          degree: "Geleneksel Kuyumculuk Zanaatı | Sadekar & Gravür Eğitimi",
          location: "İstanbul | Türkiye",
        },
        {
          period: "2015 – 2016",
          institution: "İKO GLT • Gemoloji Laboratuvarı",
          degree: "Pırlanta & Renkli Taş Tanıma ve Derecelendirme Sertifikası",
          location: "İstanbul | Türkiye",
        },
      ];

  return (
    <div className="min-h-screen bg-neutral-50 py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          onClick={() => soundFx.playClick()}
          className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-950 transition-colors mb-10 inline-block"
        >
          ← {isEn ? "Home" : "Ana Sayfa"}
        </Link>

        {/* Başlık ve Kimlik */}
        <div className="border-b border-neutral-200/80 pb-10 mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-3">
            {isEn ? "Artist & Founder of nonvalue jewel" : "Sanatçı & nonvalue jewel Kurucusu"}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-neutral-950 uppercase tracking-tighter">
            Derin Buse <br />
            <span className="italic font-light text-neutral-500">Demirkaya</span>
          </h1>
        </div>

        {/* Manifest & Statement */}
        <div className="space-y-8 text-neutral-800 font-sans leading-relaxed text-base md:text-lg font-light mb-16">
          <p className="text-lg md:text-xl font-normal text-neutral-900 border-l-2 border-neutral-900 pl-6 py-1">
            &ldquo;nonvalue is a contemporary jewelry practice that seeks to reveal what has not yet been assigned value. its production approach is rooted in the transformative force of fire.&rdquo;
          </p>
          
          {isEn ? (
            <>
              <p>
                Izmir-based artist Derin Buse Demirkaya learned the traditional craft of goldsmithing and metalsmithing under the masters of Istanbul&apos;s historic Grand Bazaar (Kapalıçarşı). After earning her Bachelor&apos;s degree from Marmara University&apos;s School of Jewelry Technology and Design, she continued her academic and artistic journey at Hochschule Düsseldorf in Germany.
              </p>

              <p>
                While initially adopting a disciplined, studio-centric production methodology, her practice gradually evolved into a more exploratory, nomadic, and situational form. Immersing herself in diverse geographies directly informs the materials she encounters and the relationships she builds with them, becoming the core catalyst that nourishes her perception and sculpting approach.
              </p>

              <p>
                In addition to natural elements such as raw minerals, cast metals, and organic bone, she reclaims and transforms discarded objects left behind in nature. Her philosophy fuses the meticulous sensitivity of high craft with the narrative resonance of found artifacts, centering on the tactile, visceral, and sculptural potential of the matter.
              </p>
            </>
          ) : (
            <>
              <p>
                İzmir merkezli sanatçı Derin Buse Demirkaya, geleneksel kuyumculuk zanaatını İstanbul Kapalıçarşı ustalarından öğrendi. Marmara Üniversitesi Takı Teknolojisi ve Tasarımı Bölümü’nden lisans derecesini aldıktan sonra, eğitimini Almanya Hochschule Düsseldorf’ta sürdürdü.
              </p>

              <p>
                İlk başlarda daha disiplinli ve atölye odaklı bir üretim yöntemi benimsemişken, pratiği zaman içinde daha keşifsel ve devingen bir forma evrildi. Farklı coğrafyaları deneyimlemek; karşılaştığı malzemeleri ve onlarla kurduğu ilişkileri derinden şekillendirerek gözlem ve yaratım biçimini besleyen kilit bir unsur haline geldi.
              </p>

              <p>
                Taş, metal ve kemik gibi doğal unsurların yanı sıra, doğada bırakılmış atık materyalleri de dönüştürerek üretir. Yaklaşımı; zanaatın duyarlılığı ile materyallerin anlatı gücünü bir araya getirerek, malzemenin dokunsal ve kavramsal potansiyeline odaklanır.
              </p>
            </>
          )}
        </div>

        {/* Sergiler (Exhibitions) */}
        <div className="border-t border-neutral-200/80 pt-14 mb-16">
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-widest text-neutral-950 mb-8">
            {isEn ? "Exhibitions & Events" : "Sergiler & Etkinlikler"}
          </h2>
          <div className="divide-y divide-neutral-200/70">
            {exhibitions.map((ex, i) => (
              <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-neutral-400 w-12">{ex.year}</span>
                  <div>
                    <span className="font-sans text-sm font-semibold text-neutral-900 mr-2">{ex.title}</span>
                    <span className="text-xs text-neutral-600">{ex.venue}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-neutral-400 sm:text-right">{ex.location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eğitim (Education) */}
        <div className="border-t border-neutral-200/80 pt-14 mb-16">
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-widest text-neutral-950 mb-8">
            {isEn ? "Education & Craft Guilds" : "Eğitim & Ustalık"}
          </h2>
          <div className="space-y-6">
            {education.map((ed, i) => (
              <div key={i} className="bg-white p-5 border border-neutral-200/70 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-neutral-400 mb-1">
                  <span>{ed.period}</span>
                  <span>{ed.location}</span>
                </div>
                <h3 className="font-sans text-base font-semibold text-neutral-900">{ed.institution}</h3>
                <p className="text-xs font-sans text-neutral-600 mt-1">{ed.degree}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Butonları */}
        <div className="border-t border-neutral-200/80 pt-12 flex flex-wrap gap-4 items-center">
          <Link
            href="/koleksiyon"
            onClick={() => soundFx.playClick()}
            className="bg-neutral-950 text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
          >
            {isEn ? "Explore Collection" : "Koleksiyonu İncele"}
          </Link>
          <Link
            href="/atolye"
            onClick={() => soundFx.playClick()}
            className="border border-neutral-900 text-neutral-950 px-8 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-neutral-100 transition-colors"
          >
            {isEn ? "Workshop Calendar" : "Atölye Takvimi"}
          </Link>
          <a
            href="https://instagram.com/nonvalue_jewel"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="text-neutral-500 hover:text-neutral-950 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors"
          >
            Instagram: @nonvalue_jewel ↗
          </a>
        </div>
      </div>
    </div>
  );
}
