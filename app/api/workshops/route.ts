import { NextRequest, NextResponse } from "next/server";
import { db, workshops } from "@/db";
import { asc } from "drizzle-orm";

const SEED_WORKSHOPS = [
  {
    title: "Seramik Heykel & Raku Pişirimi",
    slug: "seramik-heykel-raku-pisirimi",
    description:
      "Ateş ve dumanın organik dokular oluşturduğu kadim Japon tekniği Raku ile tanışın. Heykelimsi formlar oluşturma, sır uygulama ve açık hava redüksiyon fırınlama aşamalarını deneyimleyin.",
    instructor: "Derin Demirkaya",
    location: "Galata Açık Hava Heykel Stüdyosu, İstanbul",
    dateOffsetDays: 3,
    hour: 13,
    durationMinutes: 240,
    price: "4500.00",
    capacity: 8,
    enrolledCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
    materialsIncluded: "Şamotlu heykel çamuru, Raku sırları, koruyucu tulum ve eldiven, 2 adet fırınlanmış eser teslimi.",
  },
  {
    title: "Porselen Çamuru ile İleri Düzey Torna",
    slug: "porselen-camuru-ileri-duzey-torna",
    description:
      "Yüksek hassasiyet ve denge gerektiren Limoges porselen çamurunu torna tezgâhında şekillendirme sanatı. İnce cidarlı kâse, silindir ve vazo formlarının incelikleri.",
    instructor: "Derin Demirkaya",
    location: "Karaköy Zanaat Stüdyosu, No: 14",
    dateOffsetDays: 7,
    hour: 10,
    durationMinutes: 180,
    price: "3800.00",
    capacity: 6,
    enrolledCount: 5,
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
    materialsIncluded: "Fransız Limoges porselen çamuru, ahşap torna bıçakları, 1250°C gazlı fırınlama.",
  },
  {
    title: "Sır Kimyası & Doğal Kül Pigmentleri",
    slug: "sir-kimyasi-dogal-kul-pigmentleri",
    description:
      "Endüstriyel boyalardan uzaklaşıp meşe külü, feldspat, kuars ve doğal demir oksitler ile kendi mat & çatlak sırlarınızı hazırlama laboratuvarı.",
    instructor: "Dr. Selin Vardarlı & Derin Demirkaya",
    location: "Karaköy Malzeme Laboratuvarı",
    dateOffsetDays: 12,
    hour: 14,
    durationMinutes: 210,
    price: "3200.00",
    capacity: 10,
    enrolledCount: 10, // Doldu
    imageUrl: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=1200&q=80",
    materialsIncluded: "Hassas terazi, hammadde kiti, sır test plakaları ve formül defteri.",
  },
  {
    title: "Minimalist Heykelsi Vazolar (El İnşası)",
    slug: "minimalist-heykelsi-vazolar-el-insasi",
    description:
      "Torna kullanmadan sucuk ve plaka teknikleriyle brutalist, asimetrik vazo ve kaideler inşa etme seansı. Yeni başlayanlar ve tasarım meraklıları için uygundur.",
    instructor: "Derin Demirkaya",
    location: "Galata Stüdyo, 2. Kat",
    dateOffsetDays: 18,
    hour: 15,
    durationMinutes: 180,
    price: "2900.00",
    capacity: 10,
    enrolledCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1200&q=80",
    materialsIncluded: "Gres çamuru, modelaj aletleri, ham bisküvi ve şeffaf mat sır fırınlaması.",
  },
  {
    title: "Wabi-Sabi Çay Seremonisi Kapları & Kintsugi Felsefesi",
    slug: "wabi-sabi-cay-kaplari-kintsugi",
    description:
      "Kusurluluğun ve geçiciliğin estetiği: Geleneksel Chawan (çay kasesi) oyma tekniği (Kurinuki) ve altın tozuyla kırık onarma (Modern Kintsugi) pratiği.",
    instructor: "Derin Demirkaya",
    location: "Galata Stüdyo - Japon Bahçesi Avlusu",
    dateOffsetDays: 24,
    hour: 11,
    durationMinutes: 240,
    price: "5200.00",
    capacity: 8,
    enrolledCount: 4,
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    materialsIncluded: "Siyah gres çamuru, Kurinuki oyma bıçakları, Kintsugi onarım seti ve matcha seremonisi ikramı.",
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shouldForceSeed = searchParams.get("seed") === "true";

    // 1. Mevcut atölyeleri sorgula
    let items = await db.query.workshops.findMany({
      orderBy: [asc(workshops.date)],
    });

    // 2. Tablo boşsa veya zorunlu seed istendiyse otomatik örnek kayıtları ekle
    if (items.length === 0 || shouldForceSeed) {
      const now = new Date();

      for (const item of SEED_WORKSHOPS) {
        const targetDate = new Date(now.getTime() + item.dateOffsetDays * 24 * 60 * 60 * 1000);
        targetDate.setHours(item.hour, 0, 0, 0);

        await db
          .insert(workshops)
          .values({
            title: item.title,
            slug: item.slug,
            description: item.description,
            instructor: item.instructor,
            location: item.location,
            date: targetDate,
            durationMinutes: item.durationMinutes,
            price: item.price,
            capacity: item.capacity,
            enrolledCount: item.enrolledCount,
            status: item.enrolledCount >= item.capacity ? "upcoming" : "upcoming",
            imageUrl: item.imageUrl,
            materialsIncluded: item.materialsIncluded,
          })
          .onConflictDoNothing();
      }

      // Tekrar çek
      items = await db.query.workshops.findMany({
        orderBy: [asc(workshops.date)],
      });
    }

    // 3. Gerçek zamanlı kapasite metriklerini hesapla
    const formatted = items.map((w) => {
      const remainingSpots = Math.max(0, w.capacity - w.enrolledCount);
      const isFull = remainingSpots <= 0;
      const fillPercentage = Math.min(100, Math.round((w.enrolledCount / w.capacity) * 100));

      return {
        ...w,
        remainingSpots,
        isFull,
        fillPercentage,
      };
    });

    return NextResponse.json({
      workshops: formatted,
      total: formatted.length,
    });
  } catch (error) {
    console.error("GET /api/workshops error:", error);
    return NextResponse.json(
      { error: "Atölye listesi alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
