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
  - [x] Üst mühür logosunun (`/nv_logo.png`) arkasındaki siyah yuvarlak arka plan ve dairesel maskeleme tamamen kaldırıldı; tıpkı `nonvaluejewel` gibi 100% şeffaf (transparent PNG) hale getirildi.
  - [x] Üst mühür logosunun ekran ortasından başlayıp yukarı süzülen 1.5s açılış animasyonu geri getirildi ve sayfa geçiş hareketleriyle eşzamanlı kılındı; `nonvaluejewel` logosu ise sayfanın üstündeki yerinde sabit kalacak şekilde ayrıştırıldı.
  - [x] Üst logo ile `nonvaluejewel` arasındaki mesafe, `nonvaluejewel` ile altındaki asit yeşili nokta arasındaki mesafeyle (`mt-2 sm:mt-2.5` = `gap-2 sm:gap-2.5`, 8px mobil / 10px masaüstü) milimetrik olarak eşitlendi ve standardize edildi.
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
- [x] **Faz 4.2: Dinamik Atölye & Katılımcı Yönetim Akışı (`/admin`)**:
  - [x] Örnek seramik/çömlek atölyeleri tamamen temizlendi; stüdyoya özgü gerçek atölye seansı oluşturma (CRUD: Ekle, Düzenle, Sil, Kontenjan) devreye alındı.
  - [x] `/atolye` sayfası canlı `/api/workshops` endpoint'ine bağlandı; stüdyodan eklenen atölyeler ve kontenjanlar hem takvimde hem listede anında yansıtılıyor.
  - [x] Aktif oturum olmadığında hem ön yüzde hem admin panelinde şık, brutalist boş durum (empty-state) mesajları sağlandı.
- [x] **Faz 4.3: Siparişler & Analitik Nabız Bölümü Revizyonu (`/admin`)**:
  - [x] Satışlar doğrudan ürün detay sayfasındaki "Satın Al" butonuna eklenecek harici link ile yürütüleceğinden, e-ticaret siparişleri ve analitik nabız sekmesi geçici olarak gizlendi.
  - [x] "Siparişler & Kayıtlar" sekmesi sadeleştirilerek sadece **"Atölye Kayıtları"** (katılımcı listesi, bilet kodları, koltuk sayısı ve rezervasyon durumları) haline getirildi.
  - [x] Varsayılan stüdyo açılış sekmesi "4.1 Eser CMS & Medya" olarak ayarlandı.
- [x] **Faz 4.4: Gizli Stüdyo Sayfası & Kriptografik Giriş Bariyeri (`/admin`)**:
  - [x] `/api/admin/auth` güvenli kimlik doğrulama rotası (AES-256 / SHA-256 JWT, HttpOnly `admin_session` çerezleri).
  - [x] `AdminLoginGate` brutalist gizli giriş kartı: Yetkisiz kişilere paneli tamamen kilitleyen monokrom güvenlik duvarı.
  - [x] Stüdyo parolası `nonvalue2026!` olarak sabitlendi; giriş ekranındaki şifre öneri butonları tamamen gizlendi.
  - [x] Panel başlığında aktif "Studio Master" rozeti ve tek tıkla "Güvenli Çıkış" (Logout) butonu.
  - [x] Gizli klavye kısayolu: `Ctrl + Shift + A` veya `Cmd + Shift + A` ile sitenin her yerinden doğrudan gizli `/admin` sayfasına geçiş.

---

## 🚀 Sırada Olan Öncelikli Maddeler (In Progress & Up Next)

- [x] **Faz 4.5: Kalıcı Veri Altyapısı (Persistence)**:
  - [x] `lib/admin-store.ts` üzerinde dosya tabanlı (JSON) yerel kalıcılık katmanı (`data/studio-store.json`) devreye alındı.
  - [x] Sunucu veya konteyner yeniden başlasa bile eklenen/düzenlenen eserler, atölyeler ve stok değişimleri diske kaydedilir ve başlangıçta diskten okunur.
  - [x] `/shop/[id]` eser detay sayfası `getStoredArtworks()` üzerinden dinamikleştirildi; admin panelinden eklenen yeni eserlerin detay sayfaları anında ve hatasız açılır.
- [x] **Faz 4.6: Ürün Detay Harici Satın Alma Butonu Entegrasyonu**:
  - [x] `ArtworkDetail` ve `/api/admin/artworks` rotalarına `purchaseUrl` (Shopier, Etsy, WhatsApp vb.) alanı eklendi.
  - [x] Stüdyo yönetim paneli eser modalına "Harici Satın Alma Linki" giriş alanı ve CMS tablosuna harici link rozeti yerleştirildi.
  - [x] Ürün detay sayfasındaki (`/shop/[id]`) "Satın Al" butonu, tanımlı bir link varsa doğrudan yeni sekmede harici mağazaya yönlendirir; link yoksa klasik sipariş talep modalı devreye girer.
- [x] **Faz 4.7: Arşiv Tuvali (`/arsiv`) Dinamik Koordinat Senkronizasyonu & Sürükle-Bırak Kompozisyon**:
  - [x] `ArchiveCanvasView` bileşeni canlı `/api/artworks` endpoint'ine bağlandı; stüdyodan güncellenen $X/Y$ tuval koordinatları ve yeni eserler 3D tuvalde canlı render edilir.
  - [x] Arşiv çekmecesinde hem eser detay sayfasına doğrudan geçiş hem de harici mağaza linki desteği sağlandı.
  - [x] **Stüdyo İnteraktif Tuval Kompozisyon Editörü (`/admin` -> 4.7)**:
    - [x] Manuel sayısal koordinat girmek yerine fareyle veya dokunmatik olarak eserleri 2D tuval üzerinde serbestçe sürükleyip bırakarak kompozisyon oluşturma.
    - [x] Akıllı dağıtım şablonları (Organik Saçılma, Dairesel Galeri, Merkeze Topla, Izgara Hizala).
    - [x] Gerçek zamanlı koordinat HUD göstergesi, aktif sürükleme vurgusu ve tek tıkla toplu kaydetme (`batch-coords` API).
    - [x] Kaydedilen kompozisyonun hem diske (`data/studio-store.json`) hem de canlı 3D `/arsiv` tuvaline anında yansıması.

---

## 🚀 Sırada Olan Öncelikli Maddeler (In Progress & Up Next)

### Faz 4.8: Bulut Veritabanı (Cloud SQL / PostgreSQL) Hazırlığı
- [ ] Kullanıcı isteği doğrultusunda Cloud SQL veya harici PostgreSQL bağlantı dizesi (.env DATABASE_URL) tanımlandığında Drizzle ORM otomatik senkronizasyonunun devreye girmesi.

### Faz 5: Müşteri Portali & Koleksiyoner Girişi
- [ ] **Müşteri Giriş & Kayıt Sayfası (`/giris`)**:
  - [ ] Müşteriler için JWT auth formları ve sipariş/rezervasyon takip ekranı.
- [ ] **Müşteri Profil & Rezervasyonlarım (`/profil`)**:
  - [ ] Kayıtlı olunan atölye biletleri ve QR kodları.
