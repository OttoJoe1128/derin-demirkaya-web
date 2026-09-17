"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Layers,
  Calendar,
  Package,
  Search,
  ChevronRight,
  Database,
  ExternalLink,
  Activity,
  DollarSign,
  Users,
  MapPin,
  Clock,
  QrCode,
  Compass,
  X,
  Star,
  UploadCloud,
  ShieldCheck,
} from "lucide-react";
import { soundFx } from "@/lib/sound-fx";
import { useAuth } from "@/lib/auth-context";
import type { ArtworkDetail } from "@/lib/artworks-data";
import type { WorkshopItem } from "@/lib/workshops-data";
import type { AdminOrder, AdminBooking } from "@/lib/admin-store";
import CertificateOfAuthenticityModal from "@/components/CertificateOfAuthenticityModal";

// Hazır Yüksek Çözünürlüklü Stüdyo Fotoğrafı Kütüphanesi (Hızlı Seçim İçin)
const PRESET_STUDIO_IMAGES = [
  { label: "selflove (Yüzük)", url: "/artworks/744a7950cff34beaff3f06e308a540a0.jpg" },
  { label: "uncut (Ham Form)", url: "/artworks/6711ed628aee21b19079e2b143dd0dbf.png" },
  { label: "tension (Heykelsi)", url: "/artworks/44752606680a4cf18c44863741937f13.jpg" },
  { label: "Raku Pişirimi (Atölye)", url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80" },
  { label: "Porselen Torna (Stüdyo)", url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80" },
  { label: "Kül & Pigment Laboratuvarı", url: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=1200&q=80" },
  { label: "Wabi-Sabi Kaplar", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80" },
];

export default function AdminStudioPage() {
  const { user } = useAuth();

  // Aktif Sekme: 'analytics' | 'artworks' | 'workshops' | 'orders' | 'canvas'
  const [activeTab, setActiveTab] = useState<"analytics" | "artworks" | "workshops" | "orders" | "canvas">("analytics");

  // Veri Durumları
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalOrderRevenue: number;
    totalWorkshopRevenue: number;
    totalArtworks: number;
    uniquePiecesCount: number;
    lowStockCount: number;
    featuredCount: number;
    averageFillRate: number;
    totalCapacity: number;
    totalEnrolled: number;
  }>({
    totalRevenue: 0,
    totalOrderRevenue: 0,
    totalWorkshopRevenue: 0,
    totalArtworks: 0,
    uniquePiecesCount: 0,
    lowStockCount: 0,
    featuredCount: 0,
    averageFillRate: 0,
    totalCapacity: 0,
    totalEnrolled: 0,
  });

  const [artworks, setArtworks] = useState<ArtworkDetail[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);

  // Filtreler & Arama
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Eser Ekleme / Düzenleme Modalı
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Partial<ArtworkDetail> | null>(null);

  // COA Özgünlük Sertifikası Modalı
  const [coaArtwork, setCoaArtwork] = useState<ArtworkDetail | null>(null);
  const [isCoaOpen, setIsCoaOpen] = useState(false);

  // Atölye Ekleme / Düzenleme Modalı
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Partial<WorkshopItem> | null>(null);

  // Bildirim / Geri Bildirim Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // API'den tüm stüdyo verilerini yükle
  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);

    try {
      // 1. İstatistikleri çek
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
        setDbConnected(Boolean(data.dbConnected));
      }

      // 2. Eserleri çek
      const artworksRes = await fetch("/api/admin/artworks");
      if (artworksRes.ok) {
        const data = await artworksRes.json();
        setArtworks(data.artworks || []);
      }

      // 3. Atölyeleri çek
      const workshopsRes = await fetch("/api/admin/workshops");
      if (workshopsRes.ok) {
        const data = await workshopsRes.json();
        setWorkshops(data.workshops || []);
      }

      // 4. Siparişleri ve Biletleri çek
      const ordersRes = await fetch("/api/admin/orders");
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to load admin studio data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        const [statsRes, artworksRes, workshopsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/artworks"),
          fetch("/api/admin/workshops"),
          fetch("/api/admin/orders"),
        ]);
        if (!isMounted) return;
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats);
          setDbConnected(Boolean(data.dbConnected));
        }
        if (artworksRes.ok) {
          const data = await artworksRes.json();
          setArtworks(data.artworks || []);
        }
        if (workshopsRes.ok) {
          const data = await workshopsRes.json();
          setWorkshops(data.workshops || []);
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data.orders || []);
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error("Failed to load admin studio initial data:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Eser Stok Hızlı Güncelleme
  const handleStockChange = async (id: string, newStock: number) => {
    soundFx.playClick();
    const cleanStock = Math.max(0, newStock);

    // İyimser UI güncellemesi
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stock: cleanStock } : a))
    );

    try {
      const res = await fetch("/api/admin/artworks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action: "update-stock",
          stock: cleanStock,
        }),
      });
      if (res.ok) {
        showToast(`Stok güncellendi: ${cleanStock} adet`);
      }
    } catch (err) {
      console.error("Stock update error:", err);
    }
  };

  // Vitrin (Featured) Toggle
  const handleToggleFeatured = async (id: string) => {
    soundFx.playClick();
    const item = artworks.find((a) => a.id === id);
    if (!item) return;

    const nextState = !item.isFeatured;
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isFeatured: nextState } : a))
    );

    try {
      const res = await fetch("/api/admin/artworks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action: "toggle-featured",
        }),
      });
      if (res.ok) {
        showToast(
          nextState
            ? `"${item.title}" ana sayfa vitrinine eklendi`
            : `"${item.title}" ana sayfa vitrininden kaldırıldı`
        );
      }
    } catch (err) {
      console.error("Featured toggle error:", err);
    }
  };

  // Eser Silme
  const handleDeleteArtwork = async (id: string, title: string) => {
    if (!window.confirm(`"${title}" eserini kalıcı olarak silmek istediğinizden emin misiniz?`)) {
      return;
    }
    soundFx.playClick();

    setArtworks((prev) => prev.filter((a) => a.id !== id));

    try {
      const res = await fetch(`/api/admin/artworks?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`"${title}" başarıyla silindi`);
        fetchAllData(true);
      }
    } catch (err) {
      console.error("Delete artwork error:", err);
    }
  };

  // Eser Kaydetme (Yeni veya Düzenleme)
  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtwork || !editingArtwork.title) return;
    soundFx.playClick();

    const isEdit = Boolean(editingArtwork.id);
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/artworks", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArtwork),
      });

      if (res.ok) {
        setIsArtworkModalOpen(false);
        setEditingArtwork(null);
        showToast(isEdit ? "Eser güncellendi." : "Yeni eser kataloğa eklendi.");
        fetchAllData(true);
      }
    } catch (err) {
      console.error("Save artwork error:", err);
    }
  };

  // Atölye Kontenjan Hızlı Değiştirme
  const handleWorkshopEnrollmentDelta = async (id: string, delta: number) => {
    soundFx.playClick();
    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              enrolledCount: Math.max(0, Math.min(w.capacity, w.enrolledCount + delta)),
            }
          : w
      )
    );

    try {
      const res = await fetch("/api/admin/workshops", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "update-enrollment", delta }),
      });
      if (res.ok) {
        fetchAllData(true);
      }
    } catch (err) {
      console.error("Workshop enrollment update error:", err);
    }
  };

  // Sipariş / Bilet Durumu Güncelleme
  const handleOrderStatusChange = async (
    orderId: string,
    newStatus: AdminOrder["status"]
  ) => {
    soundFx.playClick();
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "order", id: orderId, status: newStatus }),
      });
      showToast(`Sipariş durumu güncellendi: ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error("Order status update error:", err);
    }
  };

  // Filtrelenmiş Eserler
  const filteredArtworks = useMemo(() => {
    return artworks.filter((a) => {
      const matchesSearch =
        searchQuery === "" ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.collectionName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        a.category.toLowerCase().includes(categoryFilter.toLowerCase());

      const matchesFeatured = !featuredOnly || a.isFeatured;

      return matchesSearch && matchesCategory && matchesFeatured;
    });
  }, [artworks, searchQuery, categoryFilter, featuredOnly]);

  return (
    <div className="min-h-screen bg-[#111111] text-[#ECECEC] font-sans antialiased pb-24">
      {/* TOAST BİLDİRİMİ */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E1E] border border-amber-400/60 text-white px-4 py-3 shadow-[4px_4px_0px_#000] flex items-center gap-3 font-mono text-xs animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP HEADER: Sanatçı Stüdyosu Navigasyonu & Canlı Senkron Göstergesi */}
      <header className="sticky top-0 z-40 bg-[#171717]/95 border-b border-neutral-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="flex flex-col group shrink-0"
            >
              <span className="font-serif text-lg sm:text-xl text-neutral-100 tracking-tight uppercase group-hover:text-amber-400 transition-colors">
                Derin Demirkaya
              </span>
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400/90 uppercase -mt-0.5">
                Stüdyo • CMS & Analitik Motoru
              </span>
            </Link>

            {/* Supabase Senkronizasyon Rozeti */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border ${
                dbConnected
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-700/60"
                  : "bg-amber-950/40 text-amber-300 border-amber-700/60"
              }`}
              title={
                dbConnected
                  ? "Supabase PostgreSQL bulut veritabanına bağlı."
                  : "Yerel Entegre Stüdyo Modu devrede (Supabase bağlantısı bekleniyor, tüm işlemler hafızada canlı çalışıyor)."
              }
            >
              <Database className="w-3.5 h-3.5" />
              <span>{dbConnected ? "Supabase Canlı" : "Entegre Stüdyo Çekirdeği"}</span>
            </div>

            {/* Sanatçı & Yönetici Bilgisi */}
            <div className="hidden lg:flex items-center gap-2 border-l border-neutral-800 pl-4 text-xs font-mono text-neutral-400">
              <span className="text-amber-400 font-bold">●</span>
              <span className="text-neutral-200 font-serif">
                {user?.name || "Derin Buse Demirkaya"}
              </span>
            </div>
          </div>

          {/* Sağ Eylemler: Yenile, Ön Yüze Git, Profil */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                fetchAllData();
              }}
              disabled={isRefreshing}
              className="px-3 py-1.5 border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-mono text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
              title="Tüm veritabanını ve sayaçları yeniden sorgula"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-amber-400" : ""}`}
              />
              <span className="hidden sm:inline">Senkronize Et</span>
            </button>

            <Link
              href="/"
              target="_blank"
              onClick={() => soundFx.playClick()}
              className="px-3 py-1.5 border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Ön Yüzü Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SEKME ÇUBUĞU (BRUTALIST NAV) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-neutral-800/80 flex overflow-x-auto no-scrollbar gap-1 py-1.5">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab("analytics");
            }}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "analytics"
                ? "bg-neutral-100 text-neutral-950 font-bold shadow-[2px_2px_0px_#D4AF37]"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>4.2 Analitik & Nabız</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab("artworks");
            }}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "artworks"
                ? "bg-neutral-100 text-neutral-950 font-bold shadow-[2px_2px_0px_#D4AF37]"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4.1 Eser CMS & Medya</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-neutral-800 text-neutral-300 rounded">
              {artworks.length}
            </span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab("workshops");
            }}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "workshops"
                ? "bg-neutral-100 text-neutral-950 font-bold shadow-[2px_2px_0px_#D4AF37]"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Atölyeler & Biletler</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-neutral-800 text-neutral-300 rounded">
              {workshops.length}
            </span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab("orders");
            }}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "orders"
                ? "bg-neutral-100 text-neutral-950 font-bold shadow-[2px_2px_0px_#D4AF37]"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Siparişler & Kayıtlar</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-neutral-800 text-neutral-300 rounded">
              {orders.length + bookings.length}
            </span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab("canvas");
            }}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "canvas"
                ? "bg-neutral-100 text-neutral-950 font-bold shadow-[2px_2px_0px_#D4AF37]"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>4.4 Tuval Koordinatları</span>
          </button>
        </div>
      </header>

      {/* ANA İÇERİK */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-neutral-400">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
            <p className="font-mono text-xs tracking-wider uppercase">
              Sanatçı stüdyosu ve envanter verileri yükleniyor...
            </p>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* SEKMELER: 1. TEK EKRAN ANALİTİK DASHBOARD (FAZ 4.2)                       */}
            {/* ========================================================================= */}
            {activeTab === "analytics" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* HERO STATS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Kart 1: Toplam Ciro */}
                  <div className="bg-[#191919] border border-neutral-800 p-5 relative overflow-hidden shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2 uppercase tracking-wider">
                      <span>Toplam Brüt Gelir</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-neutral-100">
                      ₺{stats.totalRevenue.toLocaleString("tr-TR")}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-800/80 pt-2">
                      <span>Eser Satışı: ₺{stats.totalOrderRevenue.toLocaleString("tr-TR")}</span>
                      <span className="text-amber-400">Atölye: ₺{stats.totalWorkshopRevenue.toLocaleString("tr-TR")}</span>
                    </div>
                  </div>

                  {/* Kart 2: Atölye Doluluk Oranı */}
                  <div className="bg-[#191919] border border-neutral-800 p-5 relative overflow-hidden shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2 uppercase tracking-wider">
                      <span>Atölye Doluluk Oranı</span>
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-neutral-100 flex items-baseline gap-2">
                      <span>%{stats.averageFillRate}</span>
                      <span className="text-xs text-neutral-400 font-normal">
                        ({stats.totalEnrolled}/{stats.totalCapacity} kişi)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 mt-3 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-500"
                        style={{ width: `${stats.averageFillRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Kart 3: Aktif Eserler & Koleksiyon */}
                  <div className="bg-[#191919] border border-neutral-800 p-5 relative overflow-hidden shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2 uppercase tracking-wider">
                      <span>Katalog & Vitrin</span>
                      <Layers className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-neutral-100 flex items-baseline gap-2">
                      <span>{stats.totalArtworks}</span>
                      <span className="text-xs text-neutral-400 font-normal">
                        ({stats.uniquePiecesCount} adet 1/1 tekil)
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-800/80 pt-2">
                      <span className="text-amber-300">★ {stats.featuredCount} Vitrinde Öne Çıkan</span>
                      <span>{artworks.reduce((acc, a) => acc + a.stock, 0)} Toplam Stok</span>
                    </div>
                  </div>

                  {/* Kart 4: Kritik Stok Uyarısı */}
                  <div className="bg-[#191919] border border-neutral-800 p-5 relative overflow-hidden shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2 uppercase tracking-wider">
                      <span>Kritik Envanter</span>
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          stats.lowStockCount > 0 ? "text-rose-400 animate-pulse" : "text-neutral-500"
                        }`}
                      />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-neutral-100 flex items-baseline gap-2">
                      <span className={stats.lowStockCount > 0 ? "text-rose-400" : "text-neutral-100"}>
                        {stats.lowStockCount}
                      </span>
                      <span className="text-xs text-neutral-400 font-normal">
                        eser ≤ 1 adet stokta
                      </span>
                    </div>
                    <div className="mt-3 text-[11px] font-mono text-neutral-400 border-t border-neutral-800/80 pt-2 truncate">
                      {stats.lowStockCount > 0
                        ? "Tükenmek üzere olan heykelsi eserler"
                        : "Tüm stok durumları dengeli"}
                    </div>
                  </div>
                </div>

                {/* ORTA BÖLÜM: 1. ATÖLYE KAPASİTE ISI HARİTASI & 2. KRİTİK STOKLAR */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Atölye Doluluk Isı Haritası (2 Sütun) */}
                  <div className="lg:col-span-2 bg-[#171717] border border-neutral-800 p-6 shadow-[3px_3px_0px_#000]">
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-800">
                      <div>
                        <h2 className="font-serif text-lg text-neutral-100">
                          Atölye Kapasite & Kontenjan Isı Haritası
                        </h2>
                        <p className="text-xs font-mono text-neutral-400 mt-0.5">
                          Kayıtlı katılımcı sayıları ve canlı doluluk oranları
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setEditingWorkshop({});
                          setIsWorkshopModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-200 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Yeni Atölye Aç</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {workshops.map((w) => {
                        const pct = Math.round((w.enrolledCount / w.capacity) * 100);
                        const isFull = w.enrolledCount >= w.capacity;

                        return (
                          <div
                            key={w.id}
                            className="bg-[#1F1F1F] border border-neutral-800 p-4 hover:border-neutral-700 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div>
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-amber-400 uppercase tracking-wider mr-2">
                                  {w.categoryTitle || w.category}
                                </span>
                                <span className="font-serif text-sm text-neutral-100 font-medium">
                                  {w.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-xs text-neutral-300">
                                  {w.price}
                                </span>
                                <span
                                  className={`font-mono text-xs px-2 py-0.5 border ${
                                    isFull
                                      ? "bg-rose-950/40 text-rose-300 border-rose-800"
                                      : pct >= 70
                                      ? "bg-amber-950/40 text-amber-300 border-amber-800"
                                      : "bg-emerald-950/40 text-emerald-300 border-emerald-800"
                                  }`}
                                >
                                  {isFull ? "DOLDU" : `%${pct} Dolu`}
                                </span>
                              </div>
                            </div>

                            {/* Doluluk Çubuğu */}
                            <div className="w-full bg-neutral-800 h-2 my-2 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  isFull
                                    ? "bg-rose-500"
                                    : pct >= 70
                                    ? "bg-amber-400"
                                    : "bg-emerald-400"
                                }`}
                                style={{ width: `${Math.min(100, pct)}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mt-2">
                              <span className="flex items-center gap-1.5">
                                <Users className="w-3 h-3 text-neutral-500" />
                                {w.enrolledCount} / {w.capacity} Katılımcı ({w.capacity - w.enrolledCount} Kalan Yer)
                              </span>

                              {/* Hızlı Kontenjan Artır/Azalt Butonları */}
                              <div className="flex items-center gap-1">
                                <span className="text-neutral-500 mr-1">Manuel Kayıt:</span>
                                <button
                                  onClick={() => handleWorkshopEnrollmentDelta(w.id, -1)}
                                  disabled={w.enrolledCount <= 0}
                                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 disabled:opacity-40"
                                  title="Katılımcı düşür"
                                >
                                  -
                                </button>
                                <span className="px-2 font-mono text-neutral-200">
                                  {w.enrolledCount}
                                </span>
                                <button
                                  onClick={() => handleWorkshopEnrollmentDelta(w.id, +1)}
                                  disabled={w.enrolledCount >= w.capacity}
                                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 disabled:opacity-40"
                                  title="Katılımcı ekle"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kritik Stok & Edisyon Paneli (1 Sütun) */}
                  <div className="bg-[#171717] border border-neutral-800 p-6 shadow-[3px_3px_0px_#000] flex flex-col">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
                      <div>
                        <h2 className="font-serif text-lg text-neutral-100">
                          Kritik Stok & Edisyonlar
                        </h2>
                        <p className="text-xs font-mono text-neutral-400 mt-0.5">
                          Stok adedi ≤ 1 olan tekil eserler
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-xs">
                        {artworks.filter((a) => a.stock <= 1).length} Eser
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
                      {artworks
                        .filter((a) => a.stock <= 1)
                        .map((a) => (
                          <div
                            key={a.id}
                            className="p-3 bg-[#1F1F1F] border border-neutral-800 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 bg-neutral-900 shrink-0 relative overflow-hidden border border-neutral-700">
                                {a.images?.[0] && (
                                  <Image
                                    src={a.images[0]}
                                    alt={a.title}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-serif text-xs text-neutral-100 truncate">
                                  {a.title}
                                </h4>
                                <span className="font-mono text-[10px] text-amber-400 block">
                                  {a.price}
                                </span>
                                <span className="text-[9px] font-mono text-neutral-400">
                                  {a.isUniquePiece ? "1/1 Eşsiz Eser" : "Limitli Edisyon"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleStockChange(a.id, a.stock + 1)}
                                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-mono text-xs"
                                title="Stok Ekle (+1)"
                              >
                                +1
                              </button>
                              <span
                                className={`font-mono text-xs px-2 py-1 font-bold ${
                                  a.stock === 0
                                    ? "bg-rose-900/60 text-rose-200 border border-rose-800"
                                    : "bg-amber-900/40 text-amber-200 border border-amber-800"
                                }`}
                              >
                                {a.stock}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setActiveTab("artworks");
                        }}
                        className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <span>Tüm Kataloğu İncele</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ALT BÖLÜM: CANLI SİPARİŞ & BİLET AKIŞI (SON KAYITLAR) */}
                <div className="bg-[#171717] border border-neutral-800 p-6 shadow-[3px_3px_0px_#000]">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-800">
                    <div>
                      <h2 className="font-serif text-lg text-neutral-100">
                        Canlı Sipariş & QR Bilet Akışı
                      </h2>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">
                        Koleksiyoner ödemeleri, kargolama aşamaları ve atölye bilet kodları
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab("orders");
                      }}
                      className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Tümünü Gör ({orders.length + bookings.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider">
                          <th className="py-2.5 px-3">Kod / Referans</th>
                          <th className="py-2.5 px-3">Tür</th>
                          <th className="py-2.5 px-3">Koleksiyoner</th>
                          <th className="py-2.5 px-3">Açıklama / Eser</th>
                          <th className="py-2.5 px-3">Tutar</th>
                          <th className="py-2.5 px-3">Durum</th>
                          <th className="py-2.5 px-3 text-right">Eylemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {/* Eser Siparişleri */}
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-neutral-800/30 transition-colors">
                            <td className="py-3 px-3 text-neutral-200 font-bold">
                              {o.orderNumber}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 bg-blue-950/60 border border-blue-800 text-blue-300 text-[10px]">
                                Eser Siparişi
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-serif text-neutral-200">{o.customerName}</div>
                              <div className="text-[10px] text-neutral-400">{o.customerEmail}</div>
                            </td>
                            <td className="py-3 px-3 text-neutral-300 max-w-[220px] truncate">
                              {o.items.map((i) => `${i.title} (${i.quantity}x)`).join(", ")}
                            </td>
                            <td className="py-3 px-3 font-bold text-neutral-100">
                              ₺{o.totalAmount.toLocaleString("tr-TR")}
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={o.status}
                                onChange={(e) =>
                                  handleOrderStatusChange(
                                    o.id,
                                    e.target.value as AdminOrder["status"]
                                  )
                                }
                                className="bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs px-2 py-1 font-mono focus:border-amber-400 outline-none"
                              >
                                <option value="pending">BEKLİYOR</option>
                                <option value="paid">ÖDENDİ</option>
                                <option value="shipped">KARGOLANDI</option>
                                <option value="completed">TAMAMLANDI</option>
                                <option value="cancelled">İPTAL</option>
                              </select>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span className="text-[10px] text-neutral-400">
                                {o.paymentProvider}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {/* Atölye Biletleri */}
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-neutral-800/30 transition-colors">
                            <td className="py-3 px-3 text-amber-300 font-bold flex items-center gap-1.5">
                              <QrCode className="w-3.5 h-3.5" />
                              <span>{b.ticketCode}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 bg-amber-950/60 border border-amber-800 text-amber-300 text-[10px]">
                                Atölye Bileti
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-serif text-neutral-200">{b.attendeeName}</div>
                              <div className="text-[10px] text-neutral-400">{b.attendeeEmail}</div>
                            </td>
                            <td className="py-3 px-3 text-neutral-300 max-w-[220px] truncate">
                              {b.workshopTitle} ({b.seatCount} Kişi)
                            </td>
                            <td className="py-3 px-3 font-bold text-neutral-100">
                              ₺{b.totalPrice.toLocaleString("tr-TR")}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[10px]">
                                {b.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right text-neutral-400 text-[10px]">
                              {b.workshopDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SEKMELER: 2. SANATÇI CMS & ESER YÖNETİMİ (FAZ 4.1)                         */}
            {/* ========================================================================= */}
            {activeTab === "artworks" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* CMS EYLEM BARI: Arama, Filtreler & Yeni Eser Ekle */}
                <div className="bg-[#171717] border border-neutral-800 p-4 shadow-[2px_2px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    {/* Arama Inputu */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Eser adı, malzeme veya koleksiyon ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111] border border-neutral-700 pl-9 pr-3 py-1.5 font-mono text-xs text-neutral-100 focus:border-amber-400 outline-none"
                      />
                    </div>

                    {/* Kategori Filtresi */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-[#111] border border-neutral-700 px-3 py-1.5 font-mono text-xs text-neutral-300 focus:border-amber-400 outline-none"
                    >
                      <option value="all">Tüm Kategoriler</option>
                      <option value="yüzük">Takı & Yüzük</option>
                      <option value="heykel">Heykel & Obje</option>
                      <option value="seramik">Seramik & Porselen</option>
                    </select>

                    {/* Vitrin Filtresi */}
                    <button
                      onClick={() => setFeaturedOnly((prev) => !prev)}
                      className={`px-3 py-1.5 border font-mono text-xs flex items-center gap-1.5 transition-colors ${
                        featuredOnly
                          ? "bg-amber-400 text-neutral-950 border-amber-400 font-bold"
                          : "bg-[#111] text-neutral-400 border-neutral-700 hover:text-white"
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Sadece Vitrindekiler</span>
                    </button>
                  </div>

                  {/* Yeni Eser Ekle Butonu */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setEditingArtwork({
                        title: "",
                        collectionName: "nonvalue — object (2025)",
                        category: "Heykel & Obje",
                        price: "₺4.200",
                        rawPrice: 4200,
                        stock: 1,
                        isUniquePiece: true,
                        year: "2025",
                        material: "925 Som Gümüş & Döküm Bronz",
                        dimensions: "18 x 12 x 8 cm",
                        weight: "240 gr",
                        technique: "Kayıp mum tekniği ve serbest ergitme",
                        description: "",
                        images: [PRESET_STUDIO_IMAGES[0].url],
                        isFeatured: false,
                        archiveCoords: { x: 50, y: 50 },
                      });
                      setIsArtworkModalOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000] shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni Eser Ekle</span>
                  </button>
                </div>

                {/* ESERLER TABLOSU / CMS LİSTESİ */}
                <div className="bg-[#171717] border border-neutral-800 shadow-[3px_3px_0px_#000] overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Görsel</th>
                        <th className="py-3 px-4">Eser Başlığı</th>
                        <th className="py-3 px-4">Koleksiyon & Malzeme</th>
                        <th className="py-3 px-4">Fiyat</th>
                        <th className="py-3 px-4 text-center">Stok</th>
                        <th className="py-3 px-4 text-center">Vitrin (Öne Çıkar)</th>
                        <th className="py-3 px-4 text-center">Tuval (X, Y)</th>
                        <th className="py-3 px-4 text-right">Aksiyonlar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {filteredArtworks.map((a) => (
                        <tr key={a.id} className="hover:bg-neutral-800/30 transition-colors">
                          {/* Görsel */}
                          <td className="py-3 px-4">
                            <div className="w-12 h-12 bg-neutral-900 relative overflow-hidden border border-neutral-700">
                              {a.images?.[0] ? (
                                <Image
                                  src={a.images[0]}
                                  alt={a.title}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[9px]">
                                  YOK
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Başlık & Edisyon */}
                          <td className="py-3 px-4">
                            <div className="font-serif text-sm font-bold text-neutral-100">
                              {a.title}
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              {a.isUniquePiece ? "1/1 — Tek ve Eşsiz Eser" : "Limitli Edisyon"}
                            </div>
                          </td>

                          {/* Koleksiyon & Malzeme */}
                          <td className="py-3 px-4 max-w-[220px]">
                            <div className="text-neutral-300 truncate">{a.collectionName}</div>
                            <div className="text-[10px] text-neutral-500 truncate">{a.material}</div>
                          </td>

                          {/* Fiyat */}
                          <td className="py-3 px-4 font-bold text-neutral-100">
                            {a.price}
                          </td>

                          {/* Stok Düzenleme */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center gap-1 border border-neutral-700 bg-neutral-900 p-0.5">
                              <button
                                onClick={() => handleStockChange(a.id, a.stock - 1)}
                                className="px-1.5 py-0.5 hover:bg-neutral-700 text-neutral-300"
                                title="Stok azalt"
                              >
                                -
                              </button>
                              <span className="px-2 font-bold text-neutral-100 min-w-[24px] text-center">
                                {a.stock}
                              </span>
                              <button
                                onClick={() => handleStockChange(a.id, a.stock + 1)}
                                className="px-1.5 py-0.5 hover:bg-neutral-700 text-neutral-300"
                                title="Stok artır"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Vitrin Toggle (isFeatured) */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleFeatured(a.id)}
                              className={`p-1.5 border transition-all ${
                                a.isFeatured
                                  ? "bg-amber-400 text-neutral-950 border-amber-400 shadow-[1px_1px_0px_#000]"
                                  : "bg-neutral-900 text-neutral-500 border-neutral-700 hover:text-neutral-300"
                              }`}
                              title={
                                a.isFeatured
                                  ? "Vitrinde gösteriliyor (kaldırmak için tıkla)"
                                  : "Vitrinde değil (öne çıkarmak için tıkla)"
                              }
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          </td>

                          {/* Tuval Koordinatları */}
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-400 text-[10px]">
                              {a.archiveCoords ? `${a.archiveCoords.x}, ${a.archiveCoords.y}` : "50, 50"}
                            </span>
                          </td>

                          {/* Aksiyonlar: Düzenle & Sil */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Link
                                href={`/koleksiyon/${a.slug || a.id}`}
                                target="_blank"
                                className="p-1.5 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white"
                                title="Ön yüzde incele"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => {
                                  soundFx.playClick();
                                  setCoaArtwork(a);
                                  setIsCoaOpen(true);
                                }}
                                className="p-1.5 bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-amber-400"
                                title="COA Özgünlük Sertifikası Oluştur/Yazdır"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                              </button>
                              <button
                                onClick={() => {
                                  soundFx.playClick();
                                  setEditingArtwork({ ...a });
                                  setIsArtworkModalOpen(true);
                                }}
                                className="p-1.5 bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-amber-400"
                                title="Eseri düzenle"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteArtwork(a.id, a.title)}
                                className="p-1.5 bg-neutral-900 border border-neutral-700 hover:border-rose-600 text-neutral-300 hover:text-rose-400"
                                title="Eseri sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SEKMELER: 3. ATÖLYELER VE BİLET YÖNETİMİ                                    */}
            {/* ========================================================================= */}
            {activeTab === "workshops" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-100">Atölye ve Etkinlik Takvimi</h2>
                    <p className="text-xs font-mono text-neutral-400">
                      Tüm atölye oturumları, kontenjanlar ve katılımcı kayıtları
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setEditingWorkshop({
                        title: "",
                        titleEn: "",
                        category: "casting",
                        categoryTitle: "Raku & Döküm",
                        instructor: "Derin Buse Demirkaya",
                        location: "Galata Açık Hava Heykel Stüdyosu, İstanbul",
                        locationEn: "Galata Open-Air Studio, Istanbul",
                        durationMinutes: 240,
                        price: "₺4.500",
                        rawPrice: 4500,
                        capacity: 8,
                        enrolledCount: 0,
                        dateOffsetDays: 7,
                        hour: 13,
                        description: "",
                        materialsIncluded: "Tüm zanaat malzemeleri dahildir.",
                        imageUrl: PRESET_STUDIO_IMAGES[3].url,
                      });
                      setIsWorkshopModalOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_#000]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni Atölye Aç</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workshops.map((w) => (
                    <div
                      key={w.id}
                      className="bg-[#171717] border border-neutral-800 p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-amber-400 uppercase tracking-wider">
                              {w.categoryTitle || w.category}
                            </span>
                            <h3 className="font-serif text-lg text-neutral-100 font-bold mt-1">
                              {w.title}
                            </h3>
                          </div>
                          <span className="font-mono text-sm font-bold text-neutral-200">
                            {w.price}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-400 font-sans line-clamp-2 mb-4">
                          {w.description}
                        </p>

                        <div className="space-y-1.5 text-xs font-mono text-neutral-400 border-t border-neutral-800 pt-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                            <span className="truncate">{w.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{w.durationMinutes} Dakika • Saat {w.hour}:00</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Eğitmen: {w.instructor}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between">
                        <div className="text-xs font-mono">
                          <span className="text-neutral-400">Kontenjan: </span>
                          <span className="text-neutral-100 font-bold">
                            {w.enrolledCount} / {w.capacity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleWorkshopEnrollmentDelta(w.id, -1)}
                            disabled={w.enrolledCount <= 0}
                            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs border border-neutral-700 disabled:opacity-40"
                          >
                            -1 Katılımcı
                          </button>
                          <button
                            onClick={() => handleWorkshopEnrollmentDelta(w.id, 1)}
                            disabled={w.enrolledCount >= w.capacity}
                            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs border border-neutral-700 disabled:opacity-40"
                          >
                            +1 Katılımcı
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SEKMELER: 4. SİPARİŞLER & BİLETLER                                         */}
            {/* ========================================================================= */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="pb-4 border-b border-neutral-800">
                  <h2 className="font-serif text-xl text-neutral-100">Siparişler ve Katılımcı Listesi</h2>
                  <p className="text-xs font-mono text-neutral-400">
                    E-ticaret eser siparişleri ve atölye dijital biletleri
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Eser Siparişleri */}
                  <div>
                    <h3 className="font-mono text-xs text-amber-400 uppercase tracking-wider mb-3">
                      Eser Siparişleri ({orders.length})
                    </h3>
                    <div className="bg-[#171717] border border-neutral-800 shadow-[3px_3px_0px_#000] overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                            <th className="py-2.5 px-3">Sipariş No</th>
                            <th className="py-2.5 px-3">Tarih</th>
                            <th className="py-2.5 px-3">Koleksiyoner</th>
                            <th className="py-2.5 px-3">Adres</th>
                            <th className="py-2.5 px-3">Tutar</th>
                            <th className="py-2.5 px-3">Durum</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {orders.map((o) => (
                            <tr key={o.id}>
                              <td className="py-3 px-3 font-bold text-neutral-200">{o.orderNumber}</td>
                              <td className="py-3 px-3 text-neutral-400">
                                {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                              </td>
                              <td className="py-3 px-3">
                                <div>{o.customerName}</div>
                                <div className="text-[10px] text-neutral-500">{o.customerEmail}</div>
                              </td>
                              <td className="py-3 px-3 max-w-[200px] truncate text-neutral-400">
                                {o.shippingAddress}
                              </td>
                              <td className="py-3 px-3 font-bold text-neutral-100">
                                ₺{o.totalAmount.toLocaleString("tr-TR")}
                              </td>
                              <td className="py-3 px-3">
                                <select
                                  value={o.status}
                                  onChange={(e) =>
                                    handleOrderStatusChange(
                                      o.id,
                                      e.target.value as AdminOrder["status"]
                                    )
                                  }
                                  className="bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs px-2 py-1 font-mono focus:border-amber-400 outline-none"
                                >
                                  <option value="pending">BEKLİYOR</option>
                                  <option value="paid">ÖDENDİ</option>
                                  <option value="shipped">KARGOLANDI</option>
                                  <option value="completed">TAMAMLANDI</option>
                                  <option value="cancelled">İPTAL</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bilet Rezervasyonları */}
                  <div>
                    <h3 className="font-mono text-xs text-amber-400 uppercase tracking-wider mb-3">
                      Atölye Rezervasyon Biletleri ({bookings.length})
                    </h3>
                    <div className="bg-[#171717] border border-neutral-800 shadow-[3px_3px_0px_#000] overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                            <th className="py-2.5 px-3">Bilet Kodu</th>
                            <th className="py-2.5 px-3">Atölye</th>
                            <th className="py-2.5 px-3">Katılımcı</th>
                            <th className="py-2.5 px-3">Kişi Sayısı</th>
                            <th className="py-2.5 px-3">Tutar</th>
                            <th className="py-2.5 px-3">Durum</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {bookings.map((b) => (
                            <tr key={b.id}>
                              <td className="py-3 px-3 font-bold text-amber-300">{b.ticketCode}</td>
                              <td className="py-3 px-3 text-neutral-200">{b.workshopTitle}</td>
                              <td className="py-3 px-3">
                                <div>{b.attendeeName}</div>
                                <div className="text-[10px] text-neutral-500">{b.attendeeEmail}</div>
                              </td>
                              <td className="py-3 px-3">{b.seatCount} Kişi</td>
                              <td className="py-3 px-3 font-bold text-neutral-100">
                                ₺{b.totalPrice.toLocaleString("tr-TR")}
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[10px]">
                                  {b.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SEKMELER: 5. ARŞİV TUVALİ KOORDİNAT EDİTÖRÜ ÖNİZLEMESİ (FAZ 4.4)            */}
            {/* ========================================================================= */}
            {activeTab === "canvas" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="pb-4 border-b border-neutral-800 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-100">
                      Faz 4.4: Arşiv Tuval Konumlandırma & Uzamsal Izgara
                    </h2>
                    <p className="text-xs font-mono text-neutral-400">
                      /arsiv sayfasındaki 3D sonsuz tuval üzerinde her eserin X ve Y koordinatları
                    </p>
                  </div>
                  <Link
                    href="/arsiv"
                    target="_blank"
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-200 font-mono text-xs flex items-center gap-1.5"
                  >
                    <span>Canlı Tuvali Aç</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                </div>

                {/* İnteraktif Mini Tuval Önizleme Sahnesi */}
                <div className="bg-[#161616] border border-neutral-800 p-4 shadow-[3px_3px_0px_#000]">
                  <div className="text-[11px] font-mono text-neutral-400 mb-3 flex items-center justify-between">
                    <span>Tuval Koordinat Sahnesi (Önizleme 100x100 Izgara)</span>
                    <span className="text-amber-400">Eserlerin uzamsal dağılım haritası</span>
                  </div>

                  <div className="relative w-full h-[460px] bg-[#0E0E0E] border border-neutral-800 overflow-hidden">
                    {/* Arka plan ızgara çizgileri */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(#FFF 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />

                    {artworks.map((a, idx) => {
                      // Varsayılan koordinatlar
                      const defaultX = (idx * 22) % 80 + 10;
                      const defaultY = ((idx * 17) % 70) + 15;
                      const x = a.archiveCoords?.x ?? defaultX;
                      const y = a.archiveCoords?.y ?? defaultY;

                      return (
                        <div
                          key={a.id}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          className="absolute z-10 group cursor-pointer"
                          onClick={() => {
                            soundFx.playClick();
                            setEditingArtwork({ ...a });
                            setIsArtworkModalOpen(true);
                          }}
                        >
                          <div className="w-14 h-14 bg-neutral-900 border border-neutral-700 group-hover:border-amber-400 group-hover:scale-110 transition-all shadow-md relative overflow-hidden">
                            {a.images?.[0] && (
                              <Image
                                src={a.images[0]}
                                alt={a.title}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            )}
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/90 border border-neutral-700 px-1.5 py-0.5 whitespace-nowrap text-[9px] font-mono text-neutral-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            {a.title} ({x}, {y})
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ESER EKLEME / DÜZENLEME (FAZ 4.1 HEADLESS CMS STUDIO)               */}
      {/* ========================================================================= */}
      {isArtworkModalOpen && editingArtwork && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181818] border border-neutral-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[6px_6px_0px_#000] p-6 text-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-700 mb-6">
              <div>
                <h3 className="font-serif text-xl text-neutral-100">
                  {editingArtwork.id ? "Eseri Düzenle" : "Yeni Eser Ekle (CMS Studio)"}
                </h3>
                <p className="font-mono text-xs text-neutral-400 mt-0.5">
                  Tüm sanat eseri özellikleri, medya havuzu ve vitrin durumları
                </p>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsArtworkModalOpen(false);
                  setEditingArtwork(null);
                }}
                className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArtwork} className="space-y-6 font-mono text-xs">
              {/* 1. Temel Bilgiler */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Eser Başlığı (TR) *</label>
                  <input
                    type="text"
                    required
                    value={editingArtwork.title || ""}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="Örn: selflove (Heykelsi Form)"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Koleksiyon Adı</label>
                  <input
                    type="text"
                    value={editingArtwork.collectionName || ""}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({ ...prev, collectionName: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="Örn: nonvalue — object (2025)"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Kategori (TR)</label>
                  <input
                    type="text"
                    value={editingArtwork.category || ""}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="Örn: Heykel & Obje / Takı & Yüzük"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Kategori (EN)</label>
                  <input
                    type="text"
                    value={editingArtwork.categoryEn || ""}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({ ...prev, categoryEn: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="Örn: Sculpture & Object"
                  />
                </div>
              </div>

              {/* 2. Fiyat, Stok ve Edisyon */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Fiyat Metni *</label>
                  <input
                    type="text"
                    required
                    value={editingArtwork.price || ""}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="₺4.200"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Sayısal Fiyat (₺)</label>
                  <input
                    type="number"
                    value={editingArtwork.rawPrice || 0}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({
                        ...prev,
                        rawPrice: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Stok Adedi</label>
                  <input
                    type="number"
                    value={editingArtwork.stock ?? 1}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Eser Yılı</label>
                  <input
                    type="text"
                    value={editingArtwork.year || "2025"}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({ ...prev, year: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Edisyon & Vitrin Checkboxları */}
              <div className="flex flex-wrap items-center gap-6 p-3 bg-neutral-900 border border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArtwork.isUniquePiece)}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({
                        ...prev,
                        isUniquePiece: e.target.checked,
                      }))
                    }
                    className="accent-amber-400 w-4 h-4"
                  />
                  <span>1/1 — Tek ve Eşsiz Eser (Unique Piece)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-amber-300">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArtwork.isFeatured)}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="accent-amber-400 w-4 h-4"
                  />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Ana Sayfa Editoryal Vitrinde Öne Çıkar (Featured)</span>
                </label>
              </div>

              {/* 3. Malzeme, Teknik, Boyutlar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Malzeme (TR)</label>
                  <input
                    type="text"
                    value={editingArtwork.material || ""}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({ ...prev, material: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="925 Gümüş & Döküm Bronz"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Teknik (TR)</label>
                  <input
                    type="text"
                    value={editingArtwork.technique || ""}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({ ...prev, technique: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="Kayıp mum dökümü"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Boyutlar</label>
                  <input
                    type="text"
                    value={editingArtwork.dimensions || ""}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({ ...prev, dimensions: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="18 x 12 x 8 cm"
                  />
                </div>
              </div>

              {/* 4. Küratöryel Açıklama */}
              <div>
                <label className="block text-neutral-400 mb-1">Küratöryel Açıklama (TR)</label>
                <textarea
                  rows={3}
                  value={editingArtwork.description || ""}
                  onChange={(e) =>
                    setEditingArtwork((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  placeholder="Eserin kavramsal felsefesi ve üretim hikayesi..."
                />
              </div>

              {/* 5. Görsel / Medya Havuzu */}
              <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-amber-400 font-bold flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4" />
                    <span>Medya Havuzu & Görsel URL</span>
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    Aşağıdaki hazır stüdyo fotoğraflarından da seçebilirsiniz:
                  </span>
                </div>

                {/* Hızlı Seçim Butonları */}
                <div className="flex flex-wrap gap-2">
                  {PRESET_STUDIO_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setEditingArtwork((prev) => {
                          const currentImages = prev?.images || [];
                          if (!currentImages.includes(img.url)) {
                            return { ...prev, images: [...currentImages, img.url] };
                          }
                          return prev;
                        });
                      }}
                      className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 text-[10px]"
                    >
                      + {img.label}
                    </button>
                  ))}
                </div>

                {/* Ana Görsel URL */}
                <div>
                  <input
                    type="text"
                    value={editingArtwork.images?.[0] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingArtwork((prev) => ({
                        ...prev,
                        images: val ? [val, ...(prev?.images?.slice(1) || [])] : [],
                      }));
                    }}
                    placeholder="https://... veya /artworks/... kapak görseli URL"
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                {/* Canlı Görsel Önizleme */}
                {editingArtwork.images && editingArtwork.images.length > 0 && (
                  <div className="flex items-center gap-3 pt-2">
                    {editingArtwork.images.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 bg-neutral-950 border border-neutral-700 relative overflow-hidden group"
                      >
                        <Image
                          src={imgUrl}
                          alt="Önizleme"
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArtwork((prev) => ({
                              ...prev,
                              images: prev?.images?.filter((_, idx) => idx !== i),
                            }));
                          }}
                          className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Arşiv Tuvali Koordinatları (X, Y) */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-neutral-900 border border-neutral-800">
                <div>
                  <label className="block text-neutral-400 mb-1">
                    Arşiv Tuval X Koordinatı (%0 - 100)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="95"
                    value={editingArtwork.archiveCoords?.x ?? 50}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({
                        ...prev,
                        archiveCoords: {
                          x: Number(e.target.value),
                          y: prev?.archiveCoords?.y ?? 50,
                        },
                      }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-1.5 text-white focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">
                    Arşiv Tuval Y Koordinatı (%0 - 100)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="95"
                    value={editingArtwork.archiveCoords?.y ?? 50}
                    onChange={(e) =>
                      setEditingArtwork((prev) => ({
                        ...prev,
                        archiveCoords: {
                          x: prev?.archiveCoords?.x ?? 50,
                          y: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-1.5 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-700">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setIsArtworkModalOpen(false);
                    setEditingArtwork(null);
                  }}
                  className="px-4 py-2 border border-neutral-700 hover:bg-neutral-800 text-neutral-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold uppercase tracking-wider shadow-[2px_2px_0px_#000]"
                >
                  {editingArtwork.id ? "Güncellemeleri Kaydet" : "Kataloğa Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ATÖLYE EKLEME / DÜZENLEME                                          */}
      {/* ========================================================================= */}
      {isWorkshopModalOpen && editingWorkshop && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181818] border border-neutral-700 w-full max-w-2xl shadow-[6px_6px_0px_#000] p-6 text-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-700 mb-6">
              <div>
                <h3 className="font-serif text-xl text-neutral-100">
                  {editingWorkshop.id ? "Atölyeyi Düzenle" : "Yeni Atölye Aç"}
                </h3>
                <p className="font-mono text-xs text-neutral-400 mt-0.5">
                  Tarih, kontenjan, eğitmen ve fiyatlandırma
                </p>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsWorkshopModalOpen(false);
                  setEditingWorkshop(null);
                }}
                className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                soundFx.playClick();
                try {
                  const res = await fetch("/api/admin/workshops", {
                    method: editingWorkshop.id ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editingWorkshop),
                  });
                  if (res.ok) {
                    setIsWorkshopModalOpen(false);
                    setEditingWorkshop(null);
                    showToast("Atölye başarıyla kaydedildi.");
                    fetchAllData(true);
                  }
                } catch (err) {
                  console.error("Save workshop error:", err);
                }
              }}
              className="space-y-4 font-mono text-xs"
            >
              <div>
                <label className="block text-neutral-400 mb-1">Atölye Başlığı *</label>
                <input
                  type="text"
                  required
                  value={editingWorkshop.title || ""}
                  onChange={(e) =>
                    setEditingWorkshop((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  placeholder="Örn: Seramik Heykel & Raku Pişirimi"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Fiyat Metni</label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.price || ""}
                    onChange={(e) =>
                      setEditingWorkshop((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="₺4.500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Kapasite (Kişi)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingWorkshop.capacity || 8}
                    onChange={(e) =>
                      setEditingWorkshop((prev) => ({
                        ...prev,
                        capacity: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Süre (Dakika)</label>
                  <input
                    type="number"
                    value={editingWorkshop.durationMinutes || 240}
                    onChange={(e) =>
                      setEditingWorkshop((prev) => ({
                        ...prev,
                        durationMinutes: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Eğitmen</label>
                  <input
                    type="text"
                    value={editingWorkshop.instructor || "Derin Buse Demirkaya"}
                    onChange={(e) =>
                      setEditingWorkshop((prev) => ({ ...prev, instructor: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Lokasyon</label>
                  <input
                    type="text"
                    value={editingWorkshop.location || ""}
                    onChange={(e) =>
                      setEditingWorkshop((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="Galata Heykel Stüdyosu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Açıklama</label>
                <textarea
                  rows={3}
                  value={editingWorkshop.description || ""}
                  onChange={(e) =>
                    setEditingWorkshop((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full bg-[#111] border border-neutral-700 px-3 py-2 text-white focus:border-amber-400 outline-none"
                  placeholder="Atölye içeriği ve kazanımlar..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-700">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setIsWorkshopModalOpen(false);
                    setEditingWorkshop(null);
                  }}
                  className="px-4 py-2 border border-neutral-700 hover:bg-neutral-800 text-neutral-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold uppercase tracking-wider"
                >
                  Atölyeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COA Özgünlük Sertifikası Yazdır/Görüntüle Modalı */}
      <CertificateOfAuthenticityModal
        artwork={coaArtwork}
        isOpen={isCoaOpen}
        onClose={() => {
          setIsCoaOpen(false);
          setCoaArtwork(null);
        }}
      />
    </div>
  );
}
