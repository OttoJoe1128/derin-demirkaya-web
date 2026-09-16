export interface ArtworkDetail {
  id: string;
  slug: string;
  title: string;
  collectionName: string;
  category: string;
  categoryEn?: string;
  price: string;
  rawPrice: number;
  stock: number;
  isUniquePiece: boolean;
  year: string;
  material: string;
  materialEn?: string;
  dimensions: string;
  dimensionsEn?: string;
  weight: string;
  technique: string;
  techniqueEn?: string;
  finish: string;
  finishEn?: string;
  description: string;
  descriptionEn?: string;
  editorialNote: string;
  editorialNoteEn?: string;
  images: string[];
  specs: { label: string; value: string }[];
  specsEn?: { label: string; value: string }[];
}

export const ARTWORKS_DATA: ArtworkDetail[] = [
  {
    id: "1",
    slug: "selflove",
    title: "selflove",
    collectionName: "nonvalue — object",
    category: "Takı & Yüzük",
    categoryEn: "Jewelry & Sculptural Ring",
    price: "₺3.200",
    rawPrice: 3200,
    stock: 1,
    isUniquePiece: true,
    year: "2024",
    material: "El Dökümü 925 Gümüş & Altın Kaplama",
    materialEn: "Hand-Cast 925 Sterling Silver & Gold Vermeil",
    dimensions: "Değişken / Ayarlanabilir Ebat",
    dimensionsEn: "Variable / Adjustable Size",
    weight: "16.4 gr",
    technique: "Ateşin dönüştürücü gücüyle ergitme ve kayıp mum el dökümü",
    techniqueEn: "Direct flame fusion & lost-wax hand casting",
    finish: "Ham döküm dokusu ve yer yer altın yansımaları",
    finishEn: "Raw molten cast texture with localized gold reflections",
    description:
      "nonvalue pratiğinin temelini oluşturan 'selflove', değerin malzemeden değil bedenle kurulan ilişkiden doğduğunu savunur. Ateşin ve erimenin öngörülemezliğiyle biçimlenen yüzey, ilk bakışta ham ve minimal görünürken yakından incelendiğinde doğadaki jeolojik erozyon izlerini andıran katmanlı mikro dokular barındırır.",
    descriptionEn:
      "Forming the foundation of the nonvalue philosophy, 'selflove' asserts that value emerges not from the preciousness of matter, but from its intimate dialogue with the human body. Molded by the elemental unpredictability of fire, the surface reveals geological erosion-like micro-textures upon close tactile examination.",
    editorialNote:
      "Solo Sergi: Tozman Bazaar, Eskişehir (2024). Eser doğrudan sergi arşivindendir.",
    editorialNoteEn:
      "Solo Exhibition: Tozman Bazaar, Eskişehir (2024). Direct acquisition from the gallery archive.",
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
    specsEn: [
      { label: "Collection", value: "nonvalue / object (2024)" },
      { label: "Metal", value: "925 Sterling Silver & Gold Vermeil" },
      { label: "Origin", value: "Eskişehir • Turkey" },
      { label: "Edition", value: "1/1 — Unique Masterpiece" },
      { label: "Exhibition Record", value: "Tozman Solo Exhibition (2024)" },
      { label: "Certificate", value: "Hand-Signed Certificate of Authenticity" },
    ],
  },
  {
    id: "2",
    slug: "its-not-a-set",
    title: "it’s not a set",
    collectionName: "nonvalue — object",
    category: "Takı & Küpe",
    categoryEn: "Jewelry & Earrings",
    price: "₺2.850",
    rawPrice: 2850,
    stock: 2,
    isUniquePiece: false,
    year: "2024",
    material: "925 Gümüş & Doğal Obsidyen Taşı",
    materialEn: "925 Sterling Silver & Natural Raw Obsidian",
    dimensions: "34 x 18 mm",
    dimensionsEn: "34 x 18 mm",
    weight: "11.8 gr (Çift)",
    technique: "Kum döküm (sand-cast) tekniği ve doğal obsidyen yerleşimi",
    techniqueEn: "Sand-cast silver technique with natural obsidian setting",
    finish: "Ham kum döküm matlığı ve camsı volkanik parlaklık",
    finishEn: "Matte sand-cast porosity with glassy volcanic obsidian luster",
    description:
      "Standart simetrik takı setlerini reddeden 'it’s not a set', volkanik obsidyen ile kum döküm gümüşün rastlantısal birlikteliğinden doğar. Birbirinin kopyası olmayan iki tekin beden üzerindeki asimetrik dengesi, takıyı sadece bir süs değil temasla anlam kazanan yaşayan bir yüzey kılar.",
    descriptionEn:
      "Rejecting standardized symmetrical pairs, 'it’s not a set' is born from the spontaneous communion of raw volcanic obsidian and sand-cast silver. The asymmetrical counterpoise between two non-identical specimens elevates jewelry into a living, tactile sculpture.",
    editorialNote:
      "Kum döküm işleminde her parçanın yüzey gözenekleri ve döküm kraterleri birbirinden farklı oluşur.",
    editorialNoteEn:
      "In sand-casting, surface micro-pores and molten craters solidify distinctively on each piece.",
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
    specsEn: [
      { label: "Collection", value: "nonvalue / object" },
      { label: "Materials", value: "925 Silver & Natural Obsidian" },
      { label: "Casting Method", value: "Sand-cast" },
      { label: "Origin", value: "İzmir • Turkey" },
      { label: "Clasp", value: "Handcrafted Silver Stud Clasp" },
    ],
  },
  {
    id: "3",
    slug: "non-control",
    title: "non control",
    collectionName: "nonvalue — object",
    category: "Takı & Yüzük",
    categoryEn: "Jewelry & Brutalist Ring",
    price: "₺3.100",
    rawPrice: 3100,
    stock: 2,
    isUniquePiece: false,
    year: "2024",
    material: "925 Ayar Som Gümüş",
    materialEn: "925 Solid Sterling Silver",
    dimensions: "Ölçüye göre ayarlanır (Standart 16-20 mm)",
    dimensionsEn: "Custom-fitted (Standard 16-20 mm)",
    weight: "13.5 gr",
    technique: "Sand-cast (Kum döküm) ile erimiş metalin kontrolsüz akışı",
    techniqueEn: "Sand-cast uncontrolled molten metallic flow",
    finish: "Oksitlenmiş derinlikler ve mat gümüş pürüzlülüğü",
    finishEn: "Oxidized recesses with raw textured matte silver",
    description:
      "Kusursuzluk arayışını bir kenara bırakan 'non control', ustanın elindeki aletin sınırlarını ve sıvı gümüşün kendi rotasını takip etmesini kutlar. Eser, gövdesindeki derin boşluklar ve çıkıntılarla lav akıntılarının soğuma anındaki dondurulmuş halini taşır.",
    descriptionEn:
      "Surrendering the dogma of polished perfection, 'non control' honors the organic threshold where the artisan's hand yields to the molten momentum of liquid silver. It captures the crystalline instant of cooling magma, sculpted with cavernous voids and ridges.",
    editorialNote:
      "Bedenle temas ettikçe zaman içinde kullanıcının kendi ten izleriyle patine alacaktır.",
    editorialNoteEn:
      "Through intimate bodily wear, the metal will acquire a customized patina responding to the wearer's skin.",
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
    specsEn: [
      { label: "Artisan", value: "Derin Buse Demirkaya" },
      { label: "Alloy", value: "925 Solid Sterling Silver" },
      { label: "Year", value: "2024" },
      { label: "Technique", value: "Sand-cast Ring" },
    ],
  },
  {
    id: "4",
    slug: "farewellkiss",
    title: "farewellkiss",
    collectionName: "nonvalue — object",
    category: "Dudak Manşeti (Lips Cuff)",
    categoryEn: "Anatomical Lip Cuff",
    price: "₺2.200",
    rawPrice: 2200,
    stock: 2,
    isUniquePiece: false,
    year: "2024",
    material: "925 Ayar Som Gümüş",
    materialEn: "925 Solid Sterling Silver",
    dimensions: "Esnek ergonomik form (Delim gerektirmez)",
    dimensionsEn: "Flexible ergonomic arc (No piercing required)",
    weight: "7.8 gr",
    technique: "Sand-cast lips cuff (Kum döküm dudak kıskacı)",
    techniqueEn: "Sand-cast lip cuff with hand-finished contour",
    finish: "Yumuşatılmış ham döküm kenarlar",
    finishEn: "Tactile raw-cast edges with satiny interior comfort",
    description:
      "Takının bedenin sınırlarıyla nasıl müzakere ettiğini araştıran avangart bir tasarım. Kulak ya da parmak yerine dudağın hassas kavisine yerleşen 'farewellkiss', metallerin soğukluğuyla tenin sıcaklığı arasındaki tezatı performatif bir deneyime dönüştürür.",
    descriptionEn:
      "An avant-garde exploration into how adornment negotiates bodily perimeters. Settling onto the sensitive arc of the lip rather than a conventional finger or ear, 'farewellkiss' transforms the polarity between chilled cast metal and body heat into a performative presence.",
    editorialNote:
      "Delme işlemi gerektirmez; dudağa hafifçe sıkıştırılarak anatomik olarak kilitlenir.",
    editorialNoteEn:
      "No piercing required; gently hugs the natural curvature of the lip with balanced ergonomic tension.",
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
    specsEn: [
      { label: "Category", value: "Anatomical Body Jewelry / Lip Cuff" },
      { label: "Alloy", value: "925 Sterling Silver" },
      { label: "Mechanism", value: "Clip-on (Non-pierced)" },
      { label: "Edition", value: "Limited Studio Series" },
    ],
  },
  {
    id: "5",
    slug: "tension",
    title: "tension",
    collectionName: "nonvalue — object",
    category: "Saç İğnesi (Hair Pin)",
    categoryEn: "Hair Pin / Sculptural Object",
    price: "₺1.950",
    rawPrice: 1950,
    stock: 4,
    isUniquePiece: false,
    year: "2024",
    material: "El Dövmesi Pirinç & Yarı Değerli Doğal Taş",
    materialEn: "Hand-Forged Solid Brass & Raw Natural Stone",
    dimensions: "Uzunluk: 14.5 cm",
    dimensionsEn: "Length: 14.5 cm",
    weight: "22.1 gr",
    technique: "Hand-forged brass and minimal stone tension setting",
    techniqueEn: "Hot-forged with hand hammer on hearth, mechanical stone tension setting",
    finish: "Ham fırçalanmış pirinç tonları",
    finishEn: "Raw brushed brass tones with organic antique aging",
    description:
      "Fiziksel gerilim ve denge üzerine kurulan 'tension', sıcak ocakta el çekiciyle dövülmüş sert pirinç çubuğun yarı değerli taşı kendi mekanik baskısıyla hapsettiği heykelsi bir saç iğnesidir. Kaynak ya da yapıştırıcı yerine malzemenin kendi içsel direnci kullanılır.",
    descriptionEn:
      "Founded upon physical tension and structural equilibrium, 'tension' is a sculptural hair pin wherein a hardened brass rod, forged with hand hammers on an open hearth, encapsulates a raw semi-precious stone purely through its own inward mechanical compression. In lieu of soldering or synthetic adhesives, the innate structural resistance of the alloy is utilized.",
    editorialNote:
      "Zamanla pirinç doğal olarak koyulaşarak eşsiz bir antik matlık kazanır.",
    editorialNoteEn:
      "Over time, the brass organically deepens in tone, acquiring a distinguished antique matte patina.",
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
    specsEn: [
      { label: "Material", value: "Solid Brass & Raw Stone" },
      { label: "Technique", value: "Hot-Forged with Hand Hammer" },
      { label: "Application", value: "Hair Pin / Sculptural Object" },
    ],
  },
  {
    id: "6",
    slug: "uncut",
    title: "uncut",
    collectionName: "nonvalue — object",
    category: "Takı & Yüzük",
    categoryEn: "Jewelry & Ring",
    price: "₺3.400",
    rawPrice: 3400,
    stock: 1,
    isUniquePiece: true,
    year: "2023",
    material: "Doğadan Bulunmuş Ham Taş & 925 Gümüş",
    materialEn: "Found Riverbed Raw Stone & 925 Silver",
    dimensions: "19 mm (Tek parça)",
    dimensionsEn: "19 mm (One-of-a-kind)",
    weight: "18.3 gr",
    technique: "Buluntu taşların minimum müdahale ile yüzüğe aktarılması",
    techniqueEn: "Found mineral setting with zero polishing intervention",
    finish: "Ham doğa dokusu ve döküm yuvası",
    finishEn: "Raw weathered rock texture with cast cradle",
    description:
      "Doğada terk edilmiş veya nehir yataklarında zamanın aşındırdığı taşların formuna saygı duyan 'uncut', taşın kesilip parlatılmasını reddeder. Taşın yüz milyonlarca yıllık varlığı, onu kavrayan gümüş halkayla bir araya gelerek tek ve tekrarlanamaz bir diyalog kurar.",
    descriptionEn:
      "Honoring the unyielding geometry of riverbed stones shaped solely by the abrasive flow of water over millennia, 'uncut' refuses lapidary cutting or artificial gloss. The ancient mineral existence engages in an unrepeatable dialogue with the enclosing sterling silver cradle.",
    editorialNote:
      "1/1 Eşsiz edisyon. Doğadaki her taşın formu benzersiz olduğu için replikası yapılamaz.",
    editorialNoteEn:
      "1/1 Unique edition. Because each found natural stone possesses an unrepeatable silhouette, no replica can ever exist.",
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
    specsEn: [
      { label: "Stone", value: "Natural Riverbed Found Mineral" },
      { label: "Body", value: "925 Sterling Silver" },
      { label: "Edition", value: "1/1 — Unique Specimen" },
      { label: "Period", value: "2023 Studio Practice" },
    ],
  },
  {
    id: "7",
    slug: "not-a-jewelry",
    title: "not a jewelry",
    collectionName: "nonvalue — space",
    category: "Mekansal Enstalasyon",
    categoryEn: "Spatial Installation",
    price: "₺8.500",
    rawPrice: 8500,
    stock: 1,
    isUniquePiece: true,
    year: "2022",
    material: "Alçı, Doğal Pigmentler ve Katmanlı Form",
    materialEn: "Casting Plaster, Natural Earth Pigments & Layered Void",
    dimensions: "30 x 40 x 10 cm",
    dimensionsEn: "30 x 40 x 10 cm",
    weight: "4.2 kg",
    technique: "Alçı döküm ve yüzey erozyon kazıması",
    techniqueEn: "Plaster casting and surface erosion excavation",
    finish: "Mat alçı dokusu ve tozlu yüzey",
    finishEn: "Matte chalky plaster texture with dusty stratification",
    description:
      "Takının bedenden kopup mekana taştığı sınırları sorgulayan enstalasyon. Eser, takı üretiminde kullanılan döküm kalıplarının ve alçının kendisini bir heykel ve hafıza nesnesi olarak merkezine alır.",
    descriptionEn:
      "An architectural installation interrogating the threshold where jewelry detaches from the body and encroaches into physical space. The artwork elevates the temporary plaster casting molds used in metalsmithing into autonomous monuments of memory and form.",
    editorialNote:
      "Sergi: Exhibition ARA | Co-Operative Community, Eskişehir (2022).",
    editorialNoteEn:
      "Exhibition: Exhibition ARA | Co-Operative Community, Eskişehir (2022).",
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
    specsEn: [
      { label: "Discipline", value: "Space / Spatial Forms" },
      { label: "Dimensions", value: "30 x 40 x 10 cm" },
      { label: "Exhibition", value: "ARA Co-Operative (2022)" },
    ],
  },
  {
    id: "8",
    slug: "zin",
    title: "zin",
    collectionName: "nonvalue — space",
    category: "Mekansal Heykel & Zincir",
    categoryEn: "Spatial Sculpture & Chain",
    price: "₺6.800",
    rawPrice: 6800,
    stock: 1,
    isUniquePiece: true,
    year: "2018",
    material: "Alüminyum & Kağıt Formlar",
    materialEn: "Structural Aluminum & Fibrous Paper Sheets",
    dimensions: "40 x 40 cm",
    dimensionsEn: "40 x 40 cm",
    weight: "1.1 kg",
    technique: "Birbirine kenetlenen alüminyum ve kağıt halkalar",
    techniqueEn: "Interlocking aluminum segments and handmade paper loops",
    finish: "Ham endüstriyel alüminyum ve lifli kağıt",
    finishEn: "Raw industrial aluminum & tactile rag paper",
    description:
      "Düsseldorf eğitim döneminde üretilen 'zin', takının en temel yapıtaşlarından biri olan 'zincir' kavramını geleneksel kuyumculuk kalıplarının dışına taşır. Yalnızca katlanmış alüminyum levhalar ve kağıt dokusuyla inşa edilen modüler yapı, hafiflikle ağırlık arasındaki çelişkiyi işler.",
    descriptionEn:
      "Developed during the artist's master studio tenure in Düsseldorf, 'zin' extracts the quintessential concept of the 'chain' outside orthodox jewelry conventions. Constructed purely from folded aluminum plates and fibrous paper, the modular structure dissects the paradox between ethereal weightlessness and industrial density.",
    editorialNote:
      "Hochschule Düsseldorf, Applied Art & Design sergisinde yer almıştır.",
    editorialNoteEn:
      "Exhibited at Hochschule Düsseldorf, Applied Art & Design Masterclass (2018).",
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
    specsEn: [
      { label: "Origin", value: "Düsseldorf • Germany (2018)" },
      { label: "Materials", value: "Pure Aluminum & Rag Paper" },
      { label: "Typology", value: "Suspended Spatial Sculpture" },
    ],
  },
  {
    id: "9",
    slug: "plastque",
    title: "plastque",
    collectionName: "nonvalue — space",
    category: "Heykel & İz Nesnesi",
    categoryEn: "Sculptural Specimen & Trace Object",
    price: "₺5.400",
    rawPrice: 5400,
    stock: 1,
    isUniquePiece: true,
    year: "2019",
    material: "Isıl İşlem Görmüş Geri Dönüştürülmüş Plastik İzi",
    materialEn: "Thermal-Pressed Post-Consumer Polymer & Mineral Pigment",
    dimensions: "20 x 25 x 10 cm",
    dimensionsEn: "20 x 25 x 10 cm",
    weight: "1.6 kg",
    technique: "Heat-pressed plastic imprint and surface carving",
    techniqueEn: "Heat-pressed plastic imprint and surface carving",
    finish: "Yarı saydam ısıl katmanlar",
    finishEn: "Translucent thermal stratification",
    description:
      "Doğada terk edilmiş atık plastiklerin kontrollü ısı ve basınç altında eritilerek fosilleşmiş bir kayaç görünümüne dönüştürülmesi. Sanatçının atık materyalleri dönüştürme ve sürdürülebilir zanaat felsefesinin en erken adımlarındandır.",
    descriptionEn:
      "Discarded post-consumer polymers fused under calibrated heat and atmospheric pressure, transforming synthetic debris into an Anthropocene fossil rock. Marks the artist's foundational research into sustainable alchemy and matter reincarnation.",
    editorialNote:
      "Düsseldorf / Almanya atölye sürecinde geliştirilmiştir.",
    editorialNoteEn:
      "Developed in studio workshops in Düsseldorf, Germany.",
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
    specsEn: [
      { label: "Material", value: "Recycled Polymer & Earth Pigments" },
      { label: "Concept", value: "Anthropocene Fossil Form" },
      { label: "Year", value: "2019" },
    ],
  },
  {
    id: "10",
    slug: "line-traces",
    title: "line / traces",
    collectionName: "nonvalue — line",
    category: "Eskiz & Materyal Düşüncesi",
    categoryEn: "Drawings & Material Contemplation",
    price: "₺1.800",
    rawPrice: 1800,
    stock: 3,
    isUniquePiece: true,
    year: "2024",
    material: "Asitsiz Arşiv Kağıdı Üzerine Suluboya & Mürekkep",
    materialEn: "Watercolor & Archival Carbon Ink on Cotton Rag",
    dimensions: "30 x 42 cm (A3)",
    dimensionsEn: "A3 (30 x 42 cm)",
    weight: "300 gr",
    technique: "Watercolor on paper & selected digital sketch prints",
    techniqueEn: "Watercolor on paper & selected digital process sketch prints",
    finish: "Dokulu pamuklu arşiv kağıdı",
    finishEn: "Textured heavyweight 100% cotton archival paper",
    description:
      "Gözlem, test ve materyal düşüncesi için bir alan işlevi gören çizimler ve boyamalar. Bu çalışmalar kronolojik bir sıra izlemez; bitmiş ürünlerden ziyade zihindeki sürecin ve sezginin kağıttaki izleri olarak var olurlar.",
    descriptionEn:
      "Drawings and washes serving as an open arena for material contemplation, chemical interaction, and intuitive tests. Resisting chronological rigidity, these sheets function as psychic blueprints and seismographic traces of the molten forms before their metallic manifestation.",
    editorialNote:
      "Her çizim sanatçının o dönem üzerinde çalıştığı heykel veya takının zihinsel eskizidir.",
    editorialNoteEn:
      "Each drawing is an intimate mental study of the sculptures currently under production on the anvil.",
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
    specsEn: [
      { label: "Series", value: "line (traces of process)" },
      { label: "Substrate", value: "300 gsm 100% Cotton Rag Paper" },
      { label: "Format", value: "A3 (30 x 42 cm)" },
    ],
  },
];

export function getArtworkByIdOrSlug(idOrSlug: string): ArtworkDetail | undefined {
  return ARTWORKS_DATA.find(
    (art) => art.id === idOrSlug || art.slug === idOrSlug
  );
}

export function getLocalizedArtwork(artwork: ArtworkDetail, lang: 'TR' | 'EN'): ArtworkDetail {
  if (lang === 'TR') return artwork;
  return {
    ...artwork,
    category: artwork.categoryEn || artwork.category,
    material: artwork.materialEn || artwork.material,
    dimensions: artwork.dimensionsEn || artwork.dimensions,
    technique: artwork.techniqueEn || artwork.technique,
    finish: artwork.finishEn || artwork.finish,
    description: artwork.descriptionEn || artwork.description,
    editorialNote: artwork.editorialNoteEn || artwork.editorialNote,
    specs: artwork.specsEn && artwork.specsEn.length > 0 ? artwork.specsEn : artwork.specs,
  };
}
