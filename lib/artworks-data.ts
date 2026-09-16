export interface ArtworkDetail {
  id: string;
  slug: string;
  title: string;
  collectionName: string;
  category: string;
  price: string;
  rawPrice: number;
  stock: number;
  isUniquePiece: boolean;
  year: string;
  material: string;
  dimensions: string;
  weight: string;
  technique: string;
  finish: string;
  description: string;
  editorialNote: string;
  images: string[];
  specs: { label: string; value: string }[];
}

export const ARTWORKS_DATA: ArtworkDetail[] = [
  {
    id: "1",
    slug: "ham-gumus-yuzuk",
    title: "Ham Gümüş Yüzük",
    collectionName: "Koleksiyon 01 — Arkaik İzler",
    category: "Takı Tasarımı",
    price: "₺1.250",
    rawPrice: 1250,
    stock: 3,
    isUniquePiece: false,
    year: "2024",
    material: "925 Ayar Ham Gümüş & Doğal Oksidasyon",
    dimensions: "İç Çap: 18mm (Ayarlanabilir form)",
    weight: "14.2 gr",
    technique: "Kayıp mum döküm ve el çekici dövme tekniği",
    finish: "Mat zımpara ve patine derinlikleri",
    description:
      "Arkaik formların heykelsi bir yorumu olan Ham Gümüş Yüzük, endüstriyel pürüzsüzlüğü reddederek malzemenin saf dokusunu parmakla buluşturuyor. Ateşin ve el çekicinin bıraktığı her mikro iz esere benzersiz bir kimlik kazandırır.",
    editorialNote:
      "Her bir yüzük el işçiliğiyle dövüldüğü için doku derinlikleri ve oksitlenme tonları eserden esere hafif farklılıklar gösterebilir.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1400&q=85",
    ],
    specs: [
      { label: "Maden", value: "925 Ayar Som Gümüş" },
      { label: "Üretim Yılı", value: "2024 / İstanbul" },
      { label: "Yüzey Dokusu", value: "Ham dövme patine" },
      { label: "Ölçü", value: "Standart / Özel siparişe göre ayarlanır" },
      { label: "Sertifika", value: "Sanatçı imzalı orijinallik belgesi dahildir" },
    ],
  },
  {
    id: "2",
    slug: "toprak-ve-form-vazo",
    title: "Toprak ve Form Vazo",
    collectionName: "Koleksiyon 02 — Jeolojik Katmanlar",
    category: "Seramik & Heykel",
    price: "₺2.400",
    rawPrice: 2400,
    stock: 1,
    isUniquePiece: true,
    year: "2024",
    material: "Şamotlu Taş Çamuru & Doğal Meşe Külü Sırı",
    dimensions: "Yükseklik: 28 cm | Çap: 16 cm",
    weight: "2.8 kg",
    technique: "El inşası plaka ve oyma tekniği, 1260°C odunlu fırınlama",
    finish: "Dokusal ham mat yüzey, su geçirmez iç sır",
    description:
      "Yerkabuğunun jeolojik erozyonundan ilham alan tek edisyon heykelimsi vazo. Ham taş çamurunun kaba tanecikli yapısı, ateşin ve külün yüzeyde bıraktığı rastlantısal çatlaklarla birleşerek monolitik bir duruş sergiler.",
    editorialNote:
      "Tek nüsha (Unique piece). Tekrarı üretilmeyecektir.",
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1400&q=85",
    ],
    specs: [
      { label: "Çamur Türü", value: "Yüksek dereceli Şamotlu Stoneware" },
      { label: "Pişirim", value: "1260°C Redüksiyonlu Odun Fırını" },
      { label: "İç Kaplama", value: "Şeffaf gıda ve su uyumlu sır" },
      { label: "Edisyon", value: "1/1 — Tek ve Eşsiz Eser" },
      { label: "Kargo", value: "Özel ahşap sandık içi sigortalı teslimat" },
    ],
  },
  {
    id: "3",
    slug: "toprak-ve-form-obje",
    title: "Toprak ve Form Obje",
    collectionName: "Heykel Serisi — Dilsiz Biçimler",
    category: "Heykel & Obje",
    price: "₺2.100",
    rawPrice: 2100,
    stock: 2,
    isUniquePiece: true,
    year: "2024",
    material: "Siyah Demir Katkılı Seramik & Grafit Cilası",
    dimensions: "22 x 18 x 14 cm",
    weight: "1.9 kg",
    technique: "Oyma ve monolitik kütle eksiltme",
    finish: "Ham grafit parlaklığı, dokunulabilir pürüzsüzlük",
    description:
      "Soyut heykel formu; kütlenin uzaydaki varlığı ve gölge oyunları üzerine bir etüttür. Işık yön değiştirdikçe yüzeydeki asimetrik kırılımlar yeni geometriler doğurur.",
    editorialNote:
      "Yalnızca iç mekan heykel sergilemesi için tasarlanmıştır.",
    images: [
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1400&q=85",
    ],
    specs: [
      { label: "Malzeme", value: "Siyah Stoneware & Grafit" },
      { label: "Tip", value: "Masaüstü / Kaide Heykeli" },
      { label: "İmza", value: "Tabanında Derin Demirkaya soğuk damgası" },
    ],
  },
  {
    id: "4",
    slug: "bronz-dovme-kupe",
    title: "Bronz Dövme Küpe",
    collectionName: "Koleksiyon 02 — Antik Yankılar",
    category: "Takı Tasarımı",
    price: "₺950",
    rawPrice: 950,
    stock: 5,
    isUniquePiece: false,
    year: "2024",
    material: "Masif Heykel Bronzu & 925 Gümüş İğne",
    dimensions: "Boyut: 42 mm x 18 mm",
    weight: "Çift ağırlığı: 8.4 gr (Hafifletilmiş kütle)",
    technique: "Sıcak bronz çekiçleme & el kıvırma",
    finish: "Doğal zeytinyağı patinesi",
    description:
      "Heykelsi kıvrımıyla yerçekimine meydan okuyan Bronz Dövme Küpe, ten ile temas eden iğne kısmında antialerjik 925 ayar gümüş ile donatılmıştır.",
    editorialNote:
      "Tenle temas ettikçe yaşayan ve zamanla kullanıcısına özel bir parıltı kazanan organik bronz alaşım.",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85",
    ],
    specs: [
      { label: "Maden", value: "Sanatsal Bronz Alaşımı" },
      { label: "İğne Kısmı", value: "925 Som Gümüş (Antialerjik)" },
      { label: "Ağırlık", value: "Günlük kullanıma uygun hafifletilmiş form" },
    ],
  },
  {
    id: "5",
    slug: "raku-cay-canagi-chawan",
    title: "Raku Çay Çanağı (Chawan)",
    collectionName: "Wabi-Sabi Seramik",
    category: "Wabi-Sabi Seramik",
    price: "₺1.850",
    rawPrice: 1850,
    stock: 1,
    isUniquePiece: true,
    year: "2024",
    material: "Kaba Şamotlu Çamur & Bakır Mat Raku Sırı",
    dimensions: "Çap: 13.5 cm | Yükseklik: 8.5 cm",
    weight: "420 gr",
    technique: "Açık hava odun talaşı redüksiyonu (Raku Yaki)",
    finish: "Yanık duman hareleri, metalik parıltılar",
    description:
      "Zen çay seremonisi felsefesinden doğan Chawan, kusurluluktaki kusursuzluğu (Wabi-Sabi) kutlar. 1000°C'de akkor halinde fırından çıkarılıp talaşa gömülerek dumanın ateşi mühürlemesiyle meydana gelmiştir.",
    editorialNote:
      "Yalnızca elde ılık suyla yıkanmalıdır.",
    images: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=1400&q=85",
    ],
    specs: [
      { label: "Felsefe", value: "Wabi-Sabi / Kusurlu Uyum" },
      { label: "Kullanım", value: "Matcha ve Geleneksel Çay Töreni" },
      { label: "Kutu", value: "Geleneksel kumaş sarılı özel kutu" },
    ],
  },
  {
    id: "6",
    slug: "asimetrik-kaide-vazo",
    title: "Asimetrik Kaide Vazo",
    category: "Heykelimsi Objeler",
    collectionName: "Brutalist Strüktürler",
    price: "₺3.200",
    rawPrice: 3200,
    stock: 2,
    isUniquePiece: true,
    year: "2024",
    material: "Beyaz Şamotlu Taş Çamuru & Titanyum Mat Sır",
    dimensions: "Yükseklik: 34 cm | Taban: 15x15 cm",
    weight: "3.4 kg",
    technique: "Elle plaka katlama ve kaba dikiş birleştirme",
    finish: "Tebeşir dokulu mat beyaz yüzey",
    description:
      "Mimari bir sütun veya kaideyi andıran Asimetrik Kaide Vazo, hem tek başına bir heykel nesnesi hem de kuru dallar için monolitik bir sergileme kabıdır.",
    editorialNote:
      "Ağır ve dengeli taban yapısıyla mekan içinde güçlü bir odak noktası oluşturur.",
    images: [
      "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1400&q=85",
    ],
    specs: [
      { label: "Mimari İlham", value: "Brutalist Heykeltıraşlık" },
      { label: "Yüzey", value: "Ham tebeşir matlığı" },
      { label: "Özel Teslimat", value: "İstanbul içi atölyeden elden teslim imkanı" },
    ],
  },
];

export function getArtworkByIdOrSlug(idOrSlug: string): ArtworkDetail | undefined {
  return ARTWORKS_DATA.find(
    (item) => item.id === idOrSlug || item.slug === idOrSlug
  );
}
