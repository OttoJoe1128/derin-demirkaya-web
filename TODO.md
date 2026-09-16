# Derin Demirkaya — Proje Yol Haritası & Yapılacaklar (TODO)

## 📌 Tamamlanan Aşamalar (Completed)
- [x] **Tasarım Sistemi & Temel Mimarisi**:
  - [x] Next.js 15 App Router, Tailwind CSS v4, font entegrasyonları (Playfair Display + Inter).
  - [x] Header, Hero, Footer, CollectionCard ve FeaturedCollection bileşenleri.
  - [x] Sinematik interaktif tuval: `/arsiv` (Arşiv uzay keşfi ve sürükleme).
- [x] **Ödüllü Minimalist İmleç (CustomCursor)**:
  - [x] `mix-blend-difference` ve dinamik zıtlık sistemi (beyaz zeminlerde saf siyah, koyu zeminlerde ışıldayan ters renk).
  - [x] Preview ve masaüstü uyumluluğu, pürüzsüz yay animasyonu (`stiffness: 500, damping: 28, mass: 0.5`).
- [x] **Veritabanı & Altyapı**:
  - [x] Drizzle ORM + PostgreSQL şemaları (`db/schema.ts`: workshops, workshopBookings, artworks, artworkImages, collections, customers).
- [x] **Kimlik Doğrulama & Yetkilendirme**:
  - [x] JWT + Bcrypt (`lib/auth.ts`, `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`).
- [x] **Atölye Yönetimi & Takvim**:
  - [x] `/api/workshops` ve `/api/workshops/[id]` endpoint'leri.
  - [x] `/atolye` sayfası: İnteraktif ay/hafta takvimi, kontenjan durumu, filtreler ve rezervasyon akışı.
- [x] **Faz 1: Koleksiyon & Eser Detay Mimarisi**:
  - [x] Dinamik Eser Detay Sayfası (`/koleksiyon/[id]`): Yüksek çözünürlüklü galeri, zoom modalı, malzeme & teknik özellikleri, 1/1 edisyon etiketi.
  - [x] Koleksiyon API Rotaları (`/api/artworks`, `/api/artworks/[id]`).
  - [x] "Satın Al / Rezervasyon Talebi" akışı ve doğrudan sanatçıya özel soru sorma bağlantısı.
  - [x] Koleksiyon listesi (`/koleksiyon`) ve Ana Sayfa Seçili Eserler (`FeaturedCollection`) gerçek görseller ve linklerle bağlandı.

---

## 🚀 Sırada Olan Öncelikli Maddeler (In Progress & Up Next)

### Faz 2: Müşteri Portali, Auth Arayüzü & Profil
- [ ] **Müşteri Giriş & Kayıt Sayfası / Modalı (`/giris`)**:
  - [ ] Mevcut JWT auth API'sine (`/api/auth/login`, `/api/auth/register`) bağlı zarif brutalist giriş formu.
- [ ] **Müşteri Profil & Rezervasyonlarım (`/profil`)**:
  - [ ] Kayıtlı olunan atölye etkinlikleri, rezervasyon durumları ve bilet bilgileri.

### Faz 3: Globalleşme, SEO & Mikro Etkileşimler
- [ ] **Çoklu Dil Desteği (TR / EN)**: Uluslararası küratörler ve koleksiyonerler için dil seçeneği.
- [ ] **Gelişmiş Schema.org & SEO**: Eserler ve atölyeler için Google zengin sonuç (Rich Snippet) etiketleri.
- [ ] **Atölye ve Eser Arama & Filtreleme**: Kategori bazlı hızlı filtreleme.
