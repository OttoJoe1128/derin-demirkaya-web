export interface WorkshopItem {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'casting' | 'wheel' | 'chemistry' | 'sculpture' | 'kintsugi';
  categoryTitle: string;
  categoryTitleEn: string;
  instructor: string;
  location: string;
  locationEn: string;
  durationMinutes: number;
  price: string;
  rawPrice: number;
  capacity: number;
  enrolledCount: number;
  dateOffsetDays: number;
  hour: number;
  imageUrl: string;
  materialsIncluded: string;
  materialsIncludedEn: string;
}

export const WORKSHOPS_DATA: WorkshopItem[] = [
  {
    id: 'ws-1',
    slug: 'seramik-heykel-raku-pisirimi',
    title: 'Seramik Heykel & Raku Pişirimi',
    titleEn: 'Ceramic Sculpture & Raku Firing',
    description:
      'Ateş ve dumanın organik dokular oluşturduğu kadim Japon tekniği Raku ile tanışın. Heykelimsi formlar oluşturma, sır uygulama ve açık hava redüksiyon fırınlama aşamalarını deneyimleyin.',
    descriptionEn:
      'Encounter the ancient Japanese Raku technique where fire and smoke yield spontaneous organic textures. Experience sculptural forming, glaze application, and outdoor reduction firing.',
    category: 'casting',
    categoryTitle: 'Raku & Heykel',
    categoryTitleEn: 'Raku & Sculpture',
    instructor: 'Derin Buse Demirkaya',
    location: 'Galata Açık Hava Heykel Stüdyosu, İstanbul',
    locationEn: 'Galata Open-Air Sculpture Studio, Istanbul',
    durationMinutes: 240,
    price: '₺4.500',
    rawPrice: 4500,
    capacity: 8,
    enrolledCount: 6,
    dateOffsetDays: 3,
    hour: 13,
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    materialsIncluded: 'Şamotlu heykel çamuru, Raku sırları, koruyucu tulum ve eldiven, 2 adet fırınlanmış eser teslimi.',
    materialsIncludedEn: 'Grogged sculpting clay, Raku glazes, protective studio gear, and 2 kiln-fired finished pieces.',
  },
  {
    id: 'ws-2',
    slug: 'porselen-camuru-ileri-duzey-torna',
    title: 'Porselen Çamuru ile İleri Düzey Torna',
    titleEn: 'Advanced Wheel Throwing with Porcelain',
    description:
      'Yüksek hassasiyet ve denge gerektiren Limoges porselen çamurunu torna tezgâhında şekillendirme sanatı. İnce cidarlı kâse, silindir ve vazo formlarının incelikleri.',
    descriptionEn:
      'The delicate balance of shaping French Limoges porcelain on the potter’s wheel. Discover the nuances of ultra-thin rimmed vessels, cylinders, and flared forms.',
    category: 'wheel',
    categoryTitle: 'Porselen & Torna',
    categoryTitleEn: 'Porcelain & Wheel',
    instructor: 'Derin Buse Demirkaya',
    location: 'Karaköy Zanaat Stüdyosu, No: 14',
    locationEn: 'Karaköy Artisan Studio, No: 14, Istanbul',
    durationMinutes: 180,
    price: '₺3.800',
    rawPrice: 3800,
    capacity: 6,
    enrolledCount: 5,
    dateOffsetDays: 7,
    hour: 10,
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    materialsIncluded: 'Fransız Limoges porselen çamuru, ahşap torna bıçakları, 1250°C gazlı fırınlama.',
    materialsIncludedEn: 'French Limoges porcelain clay, wooden turning ribs, and 1250°C gas kiln firing.',
  },
  {
    id: 'ws-3',
    slug: 'sir-kimyasi-dogal-kul-pigmentleri',
    title: 'Sır Kimyası & Doğal Kül Pigmentleri',
    titleEn: 'Glaze Chemistry & Natural Ash Pigments',
    description:
      'Endüstriyel boyalardan uzaklaşıp meşe külü, feldspat, kuars ve doğal demir oksitler ile kendi mat & çatlak sırlarınızı hazırlama laboratuvarı.',
    descriptionEn:
      'Step beyond commercial glazes into raw mineral alchemy: formulate tactile matte and crackle glazes using oak ash, feldspar, quartz, and natural iron oxides.',
    category: 'chemistry',
    categoryTitle: 'Sır Kimyası',
    categoryTitleEn: 'Glaze Chemistry',
    instructor: 'Dr. Selin Vardarlı & Derin Buse Demirkaya',
    location: 'Karaköy Malzeme Laboratuvarı',
    locationEn: 'Karaköy Materials Lab, Istanbul',
    durationMinutes: 210,
    price: '₺3.200',
    rawPrice: 3200,
    capacity: 10,
    enrolledCount: 10,
    dateOffsetDays: 12,
    hour: 14,
    imageUrl: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=1200&q=80',
    materialsIncluded: 'Hassas terazi, hammadde kiti, sır test plakaları ve formül defteri.',
    materialsIncludedEn: 'Precision micro-scale, raw mineral kit, test tiles, and studio recipe journal.',
  },
  {
    id: 'ws-4',
    slug: 'minimalist-heykelsi-vazolar-el-insasi',
    title: 'Minimalist Heykelsi Vazolar (El İnşası)',
    titleEn: 'Minimalist Sculptural Vessels (Hand-Building)',
    description:
      'Torna kullanmadan sucuk ve plaka teknikleriyle brutalist, asimetrik vazo ve kaideler inşa etme seansı. Yeni başlayanlar ve tasarım meraklıları için uygundur.',
    descriptionEn:
      'Construct brutalist, asymmetrical vessels and pedestals using coil and slab building without a wheel. Welcoming both beginners and design enthusiasts.',
    category: 'sculpture',
    categoryTitle: 'Heykelsi El İnşası',
    categoryTitleEn: 'Sculptural Hand-Building',
    instructor: 'Derin Buse Demirkaya',
    location: 'Galata Stüdyo, 2. Kat',
    locationEn: 'Galata Studio, 2nd Floor, Istanbul',
    durationMinutes: 180,
    price: '₺2.900',
    rawPrice: 2900,
    capacity: 10,
    enrolledCount: 3,
    dateOffsetDays: 18,
    hour: 15,
    imageUrl: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1200&q=80',
    materialsIncluded: 'Gres çamuru, modelaj aletleri, ham bisküvi ve şeffaf mat sır fırınlaması.',
    materialsIncludedEn: 'Stoneware grog clay, modeling tools, bisque and matte transparent glaze firing.',
  },
  {
    id: 'ws-5',
    slug: 'wabi-sabi-cay-kaplari-kintsugi',
    title: 'Wabi-Sabi Çay Seremonisi Kapları & Kintsugi Felsefesi',
    titleEn: 'Wabi-Sabi Tea Bowls & Kintsugi Philosophy',
    description:
      'Kusurluluğun ve geçiciliğin estetiği: Geleneksel Chawan (çay kasesi) oyma tekniği (Kurinuki) ve altın tozuyla kırık onarma (Modern Kintsugi) pratiği.',
    descriptionEn:
      'The aesthetics of imperfection: Carving traditional Chawan tea vessels via Kurinuki subtractive technique followed by gold-powder mending (Kintsugi).',
    category: 'kintsugi',
    categoryTitle: 'Kintsugi & Kurinuki',
    categoryTitleEn: 'Kintsugi & Kurinuki',
    instructor: 'Derin Buse Demirkaya',
    location: 'Galata Stüdyo - Japon Bahçesi Avlusu',
    locationEn: 'Galata Studio - Japanese Courtyard, Istanbul',
    durationMinutes: 240,
    price: '₺5.200',
    rawPrice: 5200,
    capacity: 8,
    enrolledCount: 4,
    dateOffsetDays: 24,
    hour: 11,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    materialsIncluded: 'Siyah gres çamuru, Kurinuki oyma bıçakları, Kintsugi onarım seti ve matcha seremonisi ikramı.',
    materialsIncludedEn: 'Black stoneware clay, Kurinuki carving tools, Kintsugi gold lacquer kit, and matcha tea ceremony.',
  },
];
