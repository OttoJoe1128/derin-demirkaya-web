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
    slug: "selflove",
    title: "selflove",
    collectionName: "nonvalue — object",
    category: "Takı & Yüzük",
    price: "₺3.200",
    rawPrice: 3200,
    stock: 1,
    isUniquePiece: true,
    year: "2024",
    material: "El Dökümü 925 Gümüş & Altın Kaplama",
    dimensions: "Değişken / Ayarlanabilir Ebat",
    weight: "16.4 gr",
    technique: "Ateşin dönüştürücü gücüyle ergitme ve kayıp mum el dökümü",
    finish: "Ham döküm dokusu ve yer yer altın yansımaları",
    description:
      "nonvalue pratiğinin temelini oluşturan 'selflove', değerin malzemeden değil bedenle kurulan ilişkiden doğduğunu savunur. Ateşin ve erimenin öngörülemezliğiyle biçimlenen yüzey, ilk bakışta ham ve minimal görünürken yakından incelendiğinde doğadaki jeolojik erozyon izlerini andıran katmanlı mikro dokular barındırır.",
    editorialNote:
      "Solo Sergi: Tozman Bazaar, Eskişehir (2024). Eser doğrudan sergi arşivindendir.",
    images: [
      "/artworks/744a7950cff34beaff3f06e308a540a0.jpg",
      "/artworks/6711ed628aee21b19079e2b143dd0dbf.png",
      "/artworks/44752606680a4cf18c44863741937f13.jpg",
    ],
    specs: [
      { label: "Koleksiyon", value: "nonvalue / object (2024)" },
      { label: "Maden", value: "925 Som Gümüş & Altın Kaplama" },
      { label: "Üretim Yeri", value: "Eskişehir • Turkey" },
      { label: "Edisyon", value: "1/1 — Tek ve Eşsiz Eser" },
      { label: "Sergi Kaydı", value: "Tozman Solo Exhibition (2024)" },
      { label: "Sertifika", value: "Derin Buse Demirkaya Islak İmzalı Belge" },
    ],
  },
  {
    id: "2",
    slug: "its-not-a-set",
    title: "it’s not a set",
    collectionName: "nonvalue — object",
    category: "Takı & Küpe",
    price: "₺2.850",
    rawPrice: 2850,
    stock: 2,
    isUniquePiece: false,
    year: "2024",
    material: "925 Gümüş & Doğal Obsidyen Taşı",
    dimensions: "34 x 18 mm",
    weight: "11.8 gr (Çift)",
    technique: "Kum döküm (sand-cast) tekniği ve doğal obsidyen yerleşimi",
    finish: "Ham kum döküm matlığı ve camsı volkanik parlaklık",
    description:
      "Standart simetrik takı setlerini reddeden 'it’s not a set', volkanik obsidyen ile kum döküm gümüşün rastlantısal birlikteliğinden doğar. Birbirinin kopyası olmayan iki tekin beden üzerindeki asimetrik dengesi, takıyı sadece bir süs değil temasla anlam kazanan yaşayan bir yüzey kılar.",
    editorialNote:
      "Kum döküm işleminde her parçanın yüzey gözenekleri ve döküm kraterleri birbirinden farklı oluşur.",
    images: [
      "/artworks/44752606680a4cf18c44863741937f13.jpg",
      "/artworks/d765dfd4b84c75daadeec973056499cd.jpg",
      "/artworks/f30c57375669386c2b6bfd3bcb1ca23c.jpg",
    ],
    specs: [
      { label: "Koleksiyon", value: "nonvalue / object" },
      { label: "Maden & Taş", value: "925 Gümüş & Doğal Obsidyen" },
      { label: "Döküm Tekniği", value: "Sand-cast (Kum döküm)" },
      { label: "Konum", value: "İzmir • Turkey" },
      { label: "Kilit Mekanizması", value: "El yapımı gümüş klips" },
    ],
  },
  {
    id: "3",
    slug: "non-control",
    title: "non control",
    collectionName: "nonvalue — object",
    category: "Takı & Yüzük",
    price: "₺2.650",
    rawPrice: 2650,
    stock: 3,
    isUniquePiece: false,
    year: "2024",
    material: "925 Ayar Som Gümüş",
    dimensions: "Ölçüye göre ayarlanır (Standart 16-20 mm)",
    weight: "13.5 gr",
    technique: "Sand-cast (Kum döküm) ile erimiş metalin kontrolsüz akışı",
    finish: "Oksitlenmiş derinlikler ve mat gümüş pürüzlülüğü",
    description:
      "Kusursuzluk arayışını bir kenara bırakan 'non control', ustanın elindeki aletin sınırlarını ve sıvı gümüşün kendi rotasını takip etmesini kutlar. Eser, gövdesindeki derin boşluklar ve çıkıntılarla lav akıntılarının soğuma anındaki dondurulmuş halini taşır.",
    editorialNote:
      "Bedenle temas ettikçe zaman içinde kullanıcının kendi ten izleriyle patine alacaktır.",
    images: [
      "/artworks/4107f9b51db8c3dbac92156e1eebba6e.jpg",
      "/artworks/390d49be3a604cb42302eae04ea3624d.jpg",
      "/artworks/570c1912800a525c74408d36c33e87a4.jpg",
    ],
    specs: [
      { label: "Tasarımcı", value: "Derin Buse Demirkaya" },
      { label: "Maden", value: "925 Ayar Som Gümüş" },
      { label: "Yıl", value: "2024" },
      { label: "Teknik", value: "Sand-cast Ring" },
    ],
  },
  {
    id: "4",
    slug: "farewellkiss",
    title: "farewellkiss",
    collectionName: "nonvalue — object",
    category: "Dudak Manşeti (Lips Cuff)",
    price: "₺2.200",
    rawPrice: 2200,
    stock: 2,
    isUniquePiece: false,
    year: "2024",
    material: "925 Ayar Som Gümüş",
    dimensions: "Esnek ergonomik form (Delim gerektirmez)",
    weight: "7.8 gr",
    technique: "Sand-cast lips cuff (Kum döküm dudak kıskacı)",
    finish: "Yumuşatılmış ham döküm kenarlar",
    description:
      "Takının bedenin sınırlarıyla nasıl müzakere ettiğini araştıran avangart bir tasarım. Kulak ya da parmak yerine dudağın hassas kavisine yerleşen 'farewellkiss', metallerin soğukluğuyla tenin sıcaklığı arasındaki tezatı performatif bir deneyime dönüştürür.",
    editorialNote:
      "Delme işlemi gerektirmez; dudağa hafifçe sıkıştırılarak anatomik olarak kilitlenir.",
    images: [
      "/artworks/5f01a919e1659e62d8e4f6367d419720.jpg",
      "/artworks/c542a87ae7530e6a728d69bb347dc601.jpg",
      "/artworks/43a907cf694ce2bbe0ab26ef50978959.jpg",
    ],
    specs: [
      { label: "Kategori", value: "Anatomik Beden Takısı / Lips Cuff" },
      { label: "Maden", value: "925 Ayar Gümüş" },
      { label: "Kullanım", value: "Klipsli / İğnesiz" },
      { label: "Üretim", value: "Limitli Atölye Serisi" },
    ],
  },
  {
    id: "5",
    slug: "tension",
    title: "tension",
    collectionName: "nonvalue — object",
    category: "Saç İğnesi (Hair Pin)",
    price: "₺1.950",
    rawPrice: 1950,
    stock: 4,
    isUniquePiece: false,
    year: "2024",
    material: "El Dövmesi Pirinç & Yarı Değerli Doğal Taş",
    dimensions: "Uzunluk: 14.5 cm",
    weight: "22.1 gr",
    technique: "Hand-forged brass and minimal stone tension setting",
    finish: "Ham fırçalanmış pirinç tonları",
    description:
      "Fiziksel gerilim ve denge üzerine kurulan 'tension', sıcak ocakta el çekiciyle dövülmüş sert pirinç çubuğun yarı değerli taşı kendi mekanik baskısıyla hapsettiği heykelsi bir saç iğnesidir. Kaynak ya da yapıştırıcı yerine malzemenin kendi içsel direnci kullanılır.",
    editorialNote:
      "Zamanla pirinç doğal olarak koyulaşarak eşsiz bir antik matlık kazanır.",
    images: [
      "/artworks/64ef8e21cdd22b16f32ff39624fd4954.jpg",
      "/artworks/e95cb1305bc4fcca0408a847fc1d65ab.jpg",
      "/artworks/568945afad6795b43962f4ecba637336.jpg",
    ],
    specs: [
      { label: "Malzeme", value: "Som Pirinç (Brass) & Ham Taş" },
      { label: "Teknik", value: "Ocakta El Çekiciyle Sıcak Dövme" },
      { label: "Kullanım", value: "Saç Tokası / Heykelsi Obje" },
    ],
  },
  {
    id: "6",
    slug: "uncut",
    title: "uncut",
    collectionName: "nonvalue — object",
    category: "Takı & Yüzük",
    price: "₺3.400",
    rawPrice: 3400,
    stock: 1,
    isUniquePiece: true,
    year: "2023",
    material: "Doğadan Bulunmuş Ham Taş & 925 Gümüş",
    dimensions: "19 mm (Tek parça)",
    weight: "18.3 gr",
    technique: "Buluntu taşların minimum müdahale ile yüzüğe aktarılması",
    finish: "Ham doğa dokusu ve döküm yuvası",
    description:
      "Doğada terk edilmiş veya nehir yataklarında zamanın aşındırdığı taşların formuna saygı duyan 'uncut', taşın kesilip parlatılmasını reddeder. Taşın yüz milyonlarca yıllık varlığı, onu kavrayan gümüş halkayla bir araya gelerek tek ve tekrarlanamaz bir diyalog kurar.",
    editorialNote:
      "1/1 Eşsiz edisyon. Doğadaki her taşın formu benzersiz olduğu için replikası yapılamaz.",
    images: [
      "/artworks/d579cd77efd0e2e64a2057ab336012b3.jpg",
      "/artworks/9e2f07a2dce658918694abc5fee1fc61.jpg",
      "/artworks/edc89bb21ead55625c3c08c8665c8243.jpg",
    ],
    specs: [
      { label: "Taş", value: "Nehir Yatağı Doğal Buluntu Taş" },
      { label: "Gövde", value: "925 Som Gümüş" },
      { label: "Edisyon", value: "1/1 — Tekil Eser" },
      { label: "Dönem", value: "2023 Pratiği" },
    ],
  },
  {
    id: "7",
    slug: "not-a-jewelry",
    title: "not a jewelry",
    collectionName: "nonvalue — space",
    category: "Mekansal Enstalasyon",
    price: "₺8.500",
    rawPrice: 8500,
    stock: 1,
    isUniquePiece: true,
    year: "2022",
    material: "Alçı, Doğal Pigmentler ve Katmanlı Form",
    dimensions: "30 x 40 x 10 cm",
    weight: "4.2 kg",
    technique: "Alçı döküm ve yüzey erozyon kazıması",
    finish: "Mat alçı dokusu ve tozlu yüzey",
    description:
      "Takının bedenden kopup mekana taştığı sınırları sorgulayan enstalasyon. Eser, takı üretiminde kullanılan döküm kalıplarının ve alçının kendisini bir heykel ve hafıza nesnesi olarak merkezine alır.",
    editorialNote:
      "Sergi: Exhibition ARA | Co-Operative Community, Eskişehir (2022).",
    images: [
      "/artworks/744a7950cff34beaff3f06e308a540a0.jpg",
      "/artworks/6711ed628aee21b19079e2b143dd0dbf.png",
      "/artworks/21bf96ed5a3d3e68ed19b405281e9e34.jpg",
    ],
    specs: [
      { label: "Bölüm", value: "space / mekansal formlar" },
      { label: "Boyutlar", value: "30 x 40 x 10 cm" },
      { label: "Sergi", value: "ARA Co-Operative (2022)" },
    ],
  },
  {
    id: "8",
    slug: "zin",
    title: "zin",
    collectionName: "nonvalue — space",
    category: "Mekansal Heykel & Zincir",
    price: "₺6.800",
    rawPrice: 6800,
    stock: 1,
    isUniquePiece: true,
    year: "2018",
    material: "Alüminyum & Kağıt Formlar",
    dimensions: "40 x 40 cm",
    weight: "1.1 kg",
    technique: "Birbirine kenetlenen alüminyum ve kağıt halkalar",
    finish: "Ham endüstriyel alüminyum ve lifli kağıt",
    description:
      "Düsseldorf eğitim döneminde üretilen 'zin', takının en temel yapıtaşlarından biri olan 'zincir' kavramını geleneksel kuyumculuk kalıplarının dışına taşır. Yalnızca katlanmış alüminyum levhalar ve kağıt dokusuyla inşa edilen modüler yapı, hafiflikle ağırlık arasındaki çelişkiyi işler.",
    editorialNote:
      "Hochschule Düsseldorf, Applied Art & Design sergisinde yer almıştır.",
    images: [
      "/artworks/21bf96ed5a3d3e68ed19b405281e9e34.jpg",
      "/artworks/6d05b18ba546e07e87b2ea2d0852afe1.jpg",
      "/artworks/6ece0da3c4d15edecb61b6e688c115c8.jpg",
    ],
    specs: [
      { label: "Üretim", value: "Düsseldorf • Germany (2018)" },
      { label: "Malzeme", value: "Saf Alüminyum & El Yapımı Kağıt" },
      { label: "Form", value: "Asılabilir Mekansal Heykel" },
    ],
  },
  {
    id: "9",
    slug: "plastque",
    title: "plastque",
    collectionName: "nonvalue — space",
    category: "Heykel & İz Nesnesi",
    price: "₺5.400",
    rawPrice: 5400,
    stock: 1,
    isUniquePiece: true,
    year: "2019",
    material: "Isıl İşlem Görmüş Geri Dönüştürülmüş Plastik İzi",
    dimensions: "20 x 25 x 10 cm",
    weight: "1.6 kg",
    technique: "Heat-pressed plastic imprint and surface carving",
    finish: "Yarı saydam ısıl katmanlar",
    description:
      "Doğada terk edilmiş atık plastiklerin kontrollü ısı ve basınç altında eritilerek fosilleşmiş bir kayaç görünümüne dönüştürülmesi. Sanatçının atık materyalleri dönüştürme ve sürdürülebilir zanaat felsefesinin en erken adımlarındandır.",
    editorialNote:
      "Düsseldorf / Almanya atölye sürecinde geliştirilmiştir.",
    images: [
      "/artworks/6d05b18ba546e07e87b2ea2d0852afe1.jpg",
      "/artworks/77d171e14ff02f5a9c1b03fb1c3c4899.jpg",
      "/artworks/6ece0da3c4d15edecb61b6e688c115c8.jpg",
    ],
    specs: [
      { label: "Malzeme", value: "Dönüştürülmüş Polimer & Pigment" },
      { label: "Konsept", value: "Antroposen Fosil Formu" },
      { label: "Yıl", value: "2019" },
    ],
  },
  {
    id: "10",
    slug: "line-traces",
    title: "line / traces",
    collectionName: "nonvalue — line",
    category: "Eskiz & Materyal Düşüncesi",
    price: "₺1.800",
    rawPrice: 1800,
    stock: 3,
    isUniquePiece: true,
    year: "2024",
    material: "Asitsiz Arşiv Kağıdı Üzerine Suluboya & Mürekkep",
    dimensions: "30 x 42 cm (A3)",
    weight: "300 gr",
    technique: "Watercolor on paper & selected digital sketch prints",
    finish: "Dokulu pamuklu arşiv kağıdı",
    description:
      "Gözlem, test ve materyal düşüncesi için bir alan işlevi gören çizimler ve boyamalar. Bu çalışmalar kronolojik bir sıra izlemez; bitmiş ürünlerden ziyade zihindeki sürecin ve sezginin kağıttaki izleri olarak var olurlar.",
    editorialNote:
      "Her çizim sanatçının o dönem üzerinde çalıştığı heykel veya takının zihinsel eskizidir.",
    images: [
      "/artworks/3fbff7e749e7081a72a2b949196c7ab1.jpg",
      "/artworks/5f485c53fdb61444a71d7ee2ffd46312.png",
      "/artworks/db1dee1756273ad65a9748cf9a698250.jpg",
    ],
    specs: [
      { label: "Seri", value: "line (traces of process)" },
      { label: "Kağıt", value: "300 gsm %100 Pamuk Arşiv Kağıdı" },
      { label: "Boyut", value: "A3 (30 x 42 cm)" },
    ],
  },
];

export function getArtworkByIdOrSlug(idOrSlug: string): ArtworkDetail | undefined {
  return ARTWORKS_DATA.find(
    (art) => art.id === idOrSlug || art.slug === idOrSlug
  );
}
