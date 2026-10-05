# Derin Demirkaya — Proje Yol Haritası & Yapılacaklar (TODO)

## 📌 Tamamlanan Aşamalar (Completed)
- [x] **Tasarım Sistemi & Temel Mimarisi**:
  - [x] Next.js 15 App Router, Tailwind CSS v4, tipografi sistemi (Garet gövde metinleri + FF Providence Sans başlıklar).
  - [x] Header, Hero, Footer, CollectionCard ve FeaturedCollection bileşenleri.
  - [x] Sinematik interaktif tuval: `/arsiv` (Arşiv uzay keşfi ve sürükleme).
- [x] **Ödüllü Minimalist İmleç (CustomCursor)**:
  - [x] `mix-blend-difference` ve dinamik zıtlık sistemi (beyaz zeminlerde saf siyah, siyah zeminlerde saf beyaz).
  - [x] Yüksek frame hızı (donanım frekansında 0ms gecikmeli GPU translate3d ve akıcı ölçekleme).
  - [x] Masaüstünde kaybolma hatası kalıcı olarak çözüldü (kesintisiz hareket ve sınır kontrolü, metin alanı I-beam geçişleri).
- [x] **4 Yönlü Uzamsal Portalı & Marka Vurgusu**:
  - [x] 4 yönlü kategori gösterge noktaları ve mühür altı `nonvaluejewel` logosu asit yeşili `#C1FF72` tonuyla güncellendi (11px net tipografik yükseklik).
  - [x] Yüksek çözünürlüklü `/nv_logo.png` açılış mühürü entegre edildi; tam ekran merkezli başlangıç, büyütülmüş dinlenme ölçeği (104px mobil / 130px tablet / 152px masaüstü) ve `nonvaluejewel` ile altındaki nokta arasındaki mesafeyle birebir eşitlenen simetrik dikey ritim (`mt-2 sm:mt-2.5` = `gap-2 sm:gap-2.5`).
  - [x] Workshop takvim başlığı üzerindeki etiket (`ATELIER // 2026 CALENDAR & SESSIONS`) ve Arşiv sayfasındaki editoryal telemetri metinleri (`REC 24FPS`, `CINEMASCOPE`) kaldırıldı.
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
- [x] **Faz 3: Globalleşme, SEO & Mikro Etkileşimler**:
  - [x] Çoklu Dil Desteği (TR / EN): Uluslararası küratörler ve koleksiyonerler için tüm site iki dilli olarak entegre edildi.
  - [x] Gelişmiş Schema.org & SEO: Global layout, Eser detay ve Atölye takvimi için Rich Snippet şemaları.
  - [x] Atölye ve Eser Arama & Filtreleme: Global `Cmd+K` / `Ctrl+K` QuickSearchModal.
- [x] **Faz 4.1: Sanatçı CMS / Eser & Medya Havuzu Yönetimi (`/admin`)**:
  - [x] Eser ekleme / düzenleme / silme modalı (TR/EN Başlık, Malzeme, Boyutlar, Teknik, Fiyat, Stok, Edisyon).
  - [x] Tek tıkla Vitrin (`isFeatured`) yönetimi ve canlı medya havuzu.
  - [x] Anlık stok güncelleme (+/-) sayaçları ve dijital COA Özgünlük Sertifikası motoru.
- [x] **Faz 4.2: Tek Ekran Analitik Dashboard (`/admin`)**:
  - [x] Toplam Ciro, Eser Gelirleri ve Atölye Bilet Gelirleri ayrımı.
  - [x] Atölye Kapasite & Doluluk Isı Haritası (Kayıtlı katılımcı, kalan kontenjan ve interaktif +1/-1 kontrolü).
  - [x] Kritik Stok & Edisyon Alarmları (Stoku ≤ 1 olan heykelsi eserler ve hızlı takviye).
  - [x] Canlı Sipariş & QR Bilet Akışı (Ödeme ve kargolama aşaması değiştirici).
- [x] **Faz 4.3: Gizli Stüdyo Sayfası & Kriptografik Giriş Bariyeri (`/admin`)**:
  - [x] `/api/admin/auth` güvenli kimlik doğrulama rotası (AES-256 / SHA-256 JWT, HttpOnly `admin_session` çerezleri).
  - [x] `AdminLoginGate` brutalist gizli giriş kartı: Yetkisiz kişilere paneli tamamen kilitleyen monokrom güvenlik duvarı.
  - [x] Site sahibi için hızlı stüdyo parolası doğrulaması (`derinsem2026` / `nonvalue2026!`).
  - [x] Panel başlığında aktif "Studio Master" rozeti ve tek tıkla "Güvenli Çıkış" (Logout) butonu.
  - [x] Gizli klavye kısayolu: `Ctrl + Shift + A` veya `Cmd + Shift + A` ile sitenin her yerinden doğrudan gizli `/admin` sayfasına geçiş.

---

## 🚀 Sırada Olan Öncelikli Maddeler (In Progress & Up Next)

### Faz 4.4: Kalıcı Veritabanı Entegrasyonu (Persistence)
- [ ] **Drizzle ORM & Cloud SQL / PostgreSQL / Supabase Entegrasyonu**:
  - [ ] `lib/admin-store.ts` içindeki bellek içi (in-memory) yapıyı gerçek veritabanı tablolarına bağlama.
  - [ ] Panelden eklenen eserlerin, silinen kayıtların ve stok değişimlerinin sunucu yeniden başlasa dahi kalıcı olması.

### Faz 4.5: Dinamik Vitrin Senkronizasyonu (Storefront Sync)
- [ ] **Eser Detay (`/shop/[id]`) Dinamik Bağlantısı**:
  - [ ] Statik `ARTWORKS_DATA` yerine API/veritabanı sorgusu ile yeni eklenen eserlerin detay sayfalarının sorunsuz açılması.
- [ ] **Atölye Takvimi (`/atolye`) Dinamik Bağlantısı**:
  - [ ] `WorkshopCalendarView` bileşenini `/api/workshops` endpoint'ine bağlayarak stüdyo panelinden eklenen yeni atölyelerin takvimde anında belirmesi.
- [ ] **Arşiv Tuvali (`/arsiv`) Dinamik Koordinat Senkronizasyonu**:
  - [ ] Paneldeki $X/Y$ tuval konumlandırmalarının interaktif uzayda canlı güncellenmesi.

### Faz 4.6: Müşteri Portali & Koleksiyoner Girişi
- [ ] **Müşteri Giriş & Kayıt Sayfası (`/giris`)**:
  - [ ] Müşteriler için JWT auth formları ve sipariş takip ekranı.
- [ ] **Müşteri Profil & Rezervasyonlarım (`/profil`)**:
  - [ ] Kayıtlı olunan atölye biletleri ve QR kodları.
