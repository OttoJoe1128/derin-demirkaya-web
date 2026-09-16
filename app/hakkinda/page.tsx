import Link from "next/link";

export const metadata = {
  title: "Hakkında / About — Derin Buse Demirkaya (nonvalue)",
  description: "Derin Buse Demirkaya biyografisi, nonvalue manifestosu, eğitim geçmişi ve uluslararası sergi arşivi.",
};

export default function HakkindaPage() {
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

  const education = [
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
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-950 transition-colors mb-10 inline-block"
        >
          ← Ana Sayfa
        </Link>

        {/* Başlık ve Kimlik */}
        <div className="border-b border-neutral-200/80 pb-10 mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-3">
            Artist & Founder of nonvalue jewel
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
          
          <p>
            İzmir merkezli sanatçı Derin Buse Demirkaya, geleneksel kuyumculuk zanaatını İstanbul Kapalıçarşı ustalarından öğrendi. Marmara Üniversitesi Takı Teknolojisi ve Tasarımı Bölümü’nden lisans derecesini aldıktan sonra, eğitimini Almanya Hochschule Düsseldorf’ta sürdürdü.
          </p>

          <p>
            İlk başlarda daha disiplinli ve atölye odaklı bir üretim yöntemi benimsemişken, pratiği zaman içinde daha keşifsel ve devingen bir forma evrildi. Farklı coğrafyaları deneyimlemek; karşılaştığı malzemeleri ve onlarla kurduğu ilişkileri derinden şekillendirerek gözlem ve yaratım biçimini besleyen kilit bir unsur haline geldi.
          </p>

          <p>
            Taş, metal ve kemik gibi doğal unsurların yanı sıra, doğada bırakılmış atık materyalleri de dönüştürerek üretir. Yaklaşımı; zanaatın duyarlılığı ile materyallerin anlatı gücünü bir araya getirerek, malzemenin dokunsal ve kavramsal potansiyeline odaklanır.
          </p>
        </div>

        {/* Sergiler (Exhibitions) */}
        <div className="border-t border-neutral-200/80 pt-14 mb-16">
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-widest text-neutral-950 mb-8">
            Sergiler & Etkinlikler (Exhibitions)
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
            Eğitim & Ustalık (Education)
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
            className="bg-neutral-950 text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
          >
            Koleksiyonu İncele
          </Link>
          <Link
            href="/atolye"
            className="border border-neutral-900 text-neutral-950 px-8 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-neutral-100 transition-colors"
          >
            Atölye Takvimi
          </Link>
          <a
            href="https://instagram.com/nonvalue_jewel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-950 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors"
          >
            Instagram: @nonvalue_jewel ↗
          </a>
        </div>
      </div>
    </div>
  );
}
