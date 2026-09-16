import Link from "next/link";

export default function HakkindaPage() {
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
          Derin Demirkaya
        </h1>

        <div className="space-y-6 text-neutral-800 font-sans leading-relaxed text-base md:text-lg font-light">
          <p>
            İstanbul Galata ve Karaköy stüdyolarında üretim yapan Derin Demirkaya,
            geleneksel kuyumculuk teknikleri ile organik heykel formlarını ve seramik
            sanatını bir araya getirir.
          </p>
          <p>
            Wabi-sabi estetiğinden ve brutalist mimariden ilham alan tasarımlar; kusurlu
            simetrileri, dokulu ham yüzeyleri ve malzemenin kendi doğal dönüşümünü ön plana çıkarır.
          </p>
          <p>
            Koleksiyon parçalarının yanı sıra stüdyosunda Raku pişirimi, torna pratiği ve sır
            kimyası üzerine sınırlı kontenjanlı atölyeler düzenlemektedir.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 flex gap-6">
          <Link
            href="/atolye"
            className="bg-primary text-neutral-50 px-6 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Atölye Takvimi
          </Link>
          <Link
            href="/iletisim"
            className="border border-primary text-primary px-6 py-3 text-xs uppercase tracking-widest hover:bg-neutral-100 transition-colors"
          >
            İletişim
          </Link>
        </div>
      </div>
    </div>
  );
}
