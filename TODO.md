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
- [x] **Faz 1: Uzamsal Parallax (Spatial Parallax) Eser Detay Mimarisi**:
  - [x] 3D Uzamsal Sahne (`[perspective:1200px]`, `translateZ`, `scale`, `useScroll` + `useSpring`).
  - [x] Devasa tipografi kameraya doğru yaklaşırken arka planın bağımsız hızda derinliğe süzülmesi.
  - [x] Merkezde heykelsi süzülen ana eser tablosu, ışık ve doku derinliği.
  - [x] Perspektif & Görsel Anatomi çoklu açı galerisi, tam ekran zoom modalı.
  - [x] Zanaat Felsefesi & Resmi Eser Kaydı teknik şartnamesi.
  - [x] Doğrudan Satın Alma / Rezervasyon Talebi akışı (Mevcut sipariş amacı ve form yapısı korundu).

---

## 🚀 Sırada Olan Öncelikli Maddeler (In Progress & Up Next)

### Faz 2: Müşteri Portali, Auth Arayüzü & Profil
- [ ] **Müşteri Giriş & Kayıt Sayfası / Modalı (`/giris`)**:
  - [ ] Mevcut JWT auth API'sine (`/api/auth/login`, `/api/auth/register`) bağlı zarif brutalist giriş formu.
- [ ] **Müşteri Profil & Rezervasyonlarım (`/profil`)**:
  - [ ] Kayıtlı olunan atölye etkinlikleri, rezervasyon durumları ve bilet bilgileri.

### Faz 3: Globalleşme, SEO & Mikro Etkileşimler (Tamamlandı)
- [x] **Çoklu Dil Desteği (TR / EN)**: Uluslararası küratörler ve koleksiyonerler için tüm site (Eserler, Atölyeler, Hakkında, İletişim, Filtreler, Arama, Biletler) iki dilli olarak entegre edildi.
- [x] **Gelişmiş Schema.org & SEO**: 
  - [x] Global layout için `Person`, `VisualArtist`, `JewelryStore` / `ArtGallery`, `WebSite` JSON-LD tanımları.
  - [x] Eser detay sayfası (`/koleksiyon/[id]`) için `VisualArtwork` & `Product` Rich Snippet şeması.
  - [x] Atölye takvimi (`/atolye`) için `EducationEvent` / `Event` ve `Offer` Rich Snippet şeması.
- [x] **Atölye ve Eser Arama & Filtreleme**: 
  - [x] Global `Cmd+K` / `Ctrl+K` erişimli Command Palette modalı (`QuickSearchModal`).
  - [x] Eserler ve atölyeler arasında anlık başlık, teknik, malzeme ve kategori filtreleme.
  - [x] Atölye takviminde yerleşik arama çubuğu ve durum filtreleri.

---

### Faz 4: B2B Sanatçı Yönetim Paneli ve CMS (`/admin`)
- [x] **4.1. Sanatçı CMS / Eser & Medya Havuzu Yönetimi**:
  - [x] Supabase arayüzüne girmeden doğrudan stüdyodan yönetilebilen entegre CRUD mimarisi (`/api/admin/artworks`).
  - [x] Eser ekleme / düzenleme / silme modalı (TR/EN Başlık, Malzeme, Boyutlar, Teknik, Fiyat, Stok, Edisyon).
  - [x] Tek tıkla Vitrin (`isFeatured`) yönetimi ile ana sayfa brutalist kırık ızgara senkronizasyonu.
  - [x] Medya havuzu: Çoklu görsel URL yönetimi, hazır stüdyo fotoğraf kütüphanesinden hızlı seçim ve canlı görsel önizlemesi.
  - [x] Hızlı anlık stok güncelleme (+/-) kontrolleri.
- [x] **4.2. Tek Ekran Analitik Dashboard (Single-Screen Analytics)**:
  - [x] Tek bakışta stüdyo nabzını gösteren monokrom lüks brutalist kontrol merkezi (`/admin`).
  - [x] Toplam Ciro, Eser Gelirleri ve Atölye Bilet Gelirleri ayrımı.
  - [x] Atölye Kapasite & Doluluk Isı Haritası (Kayıtlı katılımcı, kalan kontenjan ve interaktif +1/-1 kayıt kontrolü).
  - [x] Kritik Stok & Edisyon Alarmları (Stoku ≤ 1 olan heykelsi eserler ve hızlı takviye).
  - [x] Canlı Sipariş & QR Bilet Akışı (Ödeme ve kargolama aşaması değiştirici).
- [ ] **4.3. Sürükle-Bırak Vitrin Blok Yönetimi**: Sıradaki adım.
- [ ] **4.4. Arşiv Tuval İnteraktif Sürükle-Bırak Konumlandırma**: Sıradaki adım (önizlemesi entegre edildi).

