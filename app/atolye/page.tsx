"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  ArrowRight,
  XCircle,
  QrCode,
  X,
  Search,
} from "lucide-react";
import { useAuth, UserReservation } from "@/lib/auth-context";
import { soundFx } from "@/lib/sound-fx";
import { useLanguage } from "@/lib/language-context";
import { WORKSHOPS_DATA } from "@/lib/workshops-data";

interface Workshop {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  instructor: string;
  location: string;
  date: string;
  durationMinutes: number;
  price: string;
  capacity: number;
  enrolledCount: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  imageUrl: string | null;
  materialsIncluded: string | null;
  remainingSpots: number;
  isFull: boolean;
  fillPercentage: number;
}

const MONTH_NAMES_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEK_DAYS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const WEEK_DAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WorkshopsCalendarPage() {
  const { isAuthenticated, addReservation, demoLogin } = useAuth();
  const { language } = useLanguage();
  const isEn = language === "EN";

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

  // Arama filtresi
  const [searchQuery, setSearchQuery] = useState("");

  // Rezervasyon Onay Modalı
  const [confirmedTicket, setConfirmedTicket] = useState<UserReservation | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Takvim ay ve yılı
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "full">("all");

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/workshops");
      if (!res.ok) throw new Error("Atölyeler yüklenemedi");
      const data = await res.json();
      const list: Workshop[] = data.workshops || [];
      setWorkshops(list);

      if (list.length > 0 && !selectedWorkshopId) {
        setSelectedWorkshopId(list[0].id);
        const firstDate = new Date(list[0].date);
        if (!isNaN(firstDate.getTime())) {
          setCurrentDate(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
        }
      }
    } catch (err) {
      console.error("Atölye yükleme hatası:", err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    fetch("/api/workshops")
      .then((res) => res.json())
      .then((data) => {
        if (!isSubscribed) return;
        const list: Workshop[] = data.workshops || [];
        setWorkshops(list);
        if (list.length > 0) {
          setSelectedWorkshopId(list[0].id);
          const firstDate = new Date(list[0].date);
          if (!isNaN(firstDate.getTime())) {
            setCurrentDate(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isSubscribed) return;
        console.error("Atölye yükleme hatası:", err);
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Atölye başlık/açıklama eşleştirme (İngilizce veritabanı eşleştirmesi)
  const getLocalizedWorkshopDetails = useCallback((w: Workshop) => {
    if (!isEn) {
      return {
        title: w.title,
        description: w.description || "",
        location: w.location,
        materialsIncluded: w.materialsIncluded || "",
      };
    }
    const match = WORKSHOPS_DATA.find(
      (item) => item.slug === w.slug || item.title === w.title
    );
    if (match) {
      return {
        title: match.titleEn,
        description: match.descriptionEn,
        location: match.locationEn,
        materialsIncluded: match.materialsIncludedEn,
      };
    }
    return {
      title: w.title,
      description: w.description || "",
      location: w.location,
      materialsIncluded: w.materialsIncluded || "",
    };
  }, [isEn]);

  // Filtrelenmiş atölyeler (Kapasite + Kelime Arama)
  const filteredWorkshops = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return workshops.filter((w) => {
      // 1. Kapasite filtresi
      if (availabilityFilter === "available" && w.isFull) return false;
      if (availabilityFilter === "full" && !w.isFull) return false;

      // 2. Arama filtresi
      if (q) {
        const localized = getLocalizedWorkshopDetails(w);
        const matchTitle = localized.title.toLowerCase().includes(q);
        const matchDesc = localized.description.toLowerCase().includes(q);
        const matchLocation = localized.location.toLowerCase().includes(q);
        const matchInstructor = w.instructor.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLocation && !matchInstructor) {
          return false;
        }
      }

      return true;
    });
  }, [workshops, availabilityFilter, searchQuery, getLocalizedWorkshopDetails]);

  // Seçili atölye
  const selectedWorkshop = workshops.find((w) => w.id === selectedWorkshopId) || filteredWorkshops[0] || workshops[0] || null;
  const selectedLocalized = selectedWorkshop ? getLocalizedWorkshopDetails(selectedWorkshop) : null;

  const handleBooking = () => {
    soundFx.playClick();
    if (!selectedWorkshop || !selectedLocalized) return;

    if (!isAuthenticated) {
      demoLogin();
    }

    const ticket = addReservation({
      workshopId: selectedWorkshop.id,
      workshopTitle: selectedLocalized.title,
      workshopDate: formatDateString(selectedWorkshop.date),
      workshopTime: isEn
        ? `${selectedWorkshop.durationMinutes} Minutes Studio Session`
        : `${selectedWorkshop.durationMinutes} Dakika Atölye Seansı`,
      location: selectedLocalized.location,
      instructor: selectedWorkshop.instructor,
      seatCount: 1,
      totalPrice: `₺${Number(selectedWorkshop.price).toLocaleString("tr-TR")}`,
    });

    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === selectedWorkshop.id
          ? {
              ...w,
              enrolledCount: w.enrolledCount + 1,
              remainingSpots: Math.max(0, w.remainingSpots - 1),
              isFull: w.remainingSpots - 1 <= 0,
              fillPercentage: Math.min(100, Math.round(((w.enrolledCount + 1) / w.capacity) * 100)),
            }
          : w
      )
    );

    setConfirmedTicket(ticket);
    setShowModal(true);
    soundFx.playSuccess();
  };

  // Takvim matrisini hesapla
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const totalDays = lastDayOfMonth.getDate();
    const days = [];

    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i),
      });
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push({
        dayNumber: day,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, day),
      });
    }

    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        dayNumber: day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, day),
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const getWorkshopsForDate = (date: Date) => {
    return filteredWorkshops.filter((w) => {
      const wDate = new Date(w.date);
      return (
        wDate.getDate() === date.getDate() &&
        wDate.getMonth() === date.getMonth() &&
        wDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handlePrevMonth = () => {
    soundFx.playClick();
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    soundFx.playClick();
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const formatDateString = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat(isEn ? "en-US" : "tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  // Schema.org EducationEvent Structured Data
  const schemaEvents = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": workshops.map((w, index) => {
        const details = getLocalizedWorkshopDetails(w);
        const startDate = new Date(w.date).toISOString();
        const endDate = new Date(
          new Date(w.date).getTime() + w.durationMinutes * 60 * 1000
        ).toISOString();

        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "EducationEvent",
            "name": details.title,
            "description": details.description,
            "startDate": startDate,
            "endDate": endDate,
            "eventStatus": w.isFull
              ? "https://schema.org/EventMovedOnline"
              : "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": details.location,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Istanbul",
                "addressCountry": "TR",
              },
            },
            "performer": {
              "@type": "Person",
              "name": w.instructor,
            },
            "organizer": {
              "@type": "Organization",
              "name": "nonvalue jewel",
              "url": "https://nonvaluejewel.com",
            },
            "offers": {
              "@type": "Offer",
              "price": w.price,
              "priceCurrency": "TRY",
              "availability": w.isFull
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
              "validFrom": new Date().toISOString(),
            },
          },
        };
      }),
    };
  }, [workshops, getLocalizedWorkshopDetails]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#171717] selection:bg-black selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaEvents) }}
      />

      {/* Üst Editoryal Navigasyon */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F5F5F5]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="text-xs font-semibold tracking-widest text-[#8C8C8C] uppercase transition-colors hover:text-black"
            >
              ← {isEn ? "Home" : "Ana Sayfa"}
            </Link>
            <span className="text-black/20">/</span>
            <span className="text-xs font-bold tracking-widest text-black uppercase">
              {isEn ? "Workshop Calendar" : "Atölye Takvimi"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                loadData(true);
              }}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:border-black/30 disabled:opacity-50"
              title={isEn ? "Refresh real-time capacity" : "Gerçek zamanlı kontenjan durumunu yenile"}
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{isEn ? "Refresh Capacity" : "Anlık Kontenjanı Yenile"}</span>
            </button>
            <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white p-0.5">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setViewMode("calendar");
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === "calendar"
                    ? "bg-black text-white"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                {isEn ? "Calendar" : "Takvim"}
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setViewMode("list");
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-black text-white"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                {isEn ? "List" : "Liste"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero & Başlık Bölümü */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold tracking-wider text-black uppercase">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500" />
              {isEn ? "Real-Time Studio Capacity Engine" : "Gerçek Zamanlı Kapasite Motoru"}
            </div>
            <h1 className="mt-3 text-3xl font-light tracking-tight text-black sm:text-4xl md:text-5xl">
              {isEn ? "Studio & Craft Calendar" : "Stüdyo & Atölye Takvimi"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8C8C8C] sm:text-base">
              {isEn
                ? "From Raku outdoor reduction to porcelain wheel throwing, natural glaze chemistry, and Kintsugi philosophy: explore real-time session capacity at Derin Demirkaya studio and reserve your place."
                : "Raku pişiriminden porselen torna pratiğine, doğal sır kimyasından kintsugi felsefesine kadar Derin Demirkaya stüdyosundaki kontenjanları anlık olarak keşfedin ve yerinizi ayırtın."}
            </p>
          </div>

          {/* Hızlı Filtreleme & Arama Araç Çubuğu */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Canlı Anahtar Kelime Arama */}
            <div className="relative flex items-center border border-black/15 bg-white rounded-full px-3 py-1.5 shadow-xs">
              <Search className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Filter sessions..." : "Oturum ara..."}
                className="bg-transparent text-xs text-neutral-900 placeholder-neutral-400 outline-none w-32 sm:w-40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-neutral-400 hover:text-neutral-900 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Durum Filtreleme Çipleri */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setAvailabilityFilter("all");
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  availabilityFilter === "all"
                    ? "border border-black bg-black text-white"
                    : "border border-black/10 bg-white text-zinc-600 hover:border-black/30"
                }`}
              >
                {isEn ? "All" : "Tümü"} ({workshops.length})
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setAvailabilityFilter("available");
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  availabilityFilter === "available"
                    ? "border border-emerald-600 bg-emerald-600 text-white"
                    : "border border-black/10 bg-white text-zinc-600 hover:border-emerald-500"
                }`}
              >
                {isEn ? "Available" : "Müsait"} ({workshops.filter((w) => !w.isFull).length})
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setAvailabilityFilter("full");
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  availabilityFilter === "full"
                    ? "border border-zinc-900 bg-zinc-800 text-white"
                    : "border border-black/10 bg-white text-zinc-600 hover:border-black/30"
                }`}
              >
                {isEn ? "Booked" : "Doldu"} ({workshops.filter((w) => w.isFull).length})
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-black/40" />
            <p className="text-sm font-medium text-[#8C8C8C]">
              {isEn ? "Loading workshop data and seat capacity..." : "Atölye ve kontenjan verileri yükleniyor..."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* SOL SÜTUN: Takvim veya Liste Görünümü (7 Kolon) */}
            <div className="lg:col-span-7">
              {viewMode === "calendar" ? (
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                  {/* Ay Değiştirme Başlığı */}
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-black">
                        {isEn ? MONTH_NAMES_EN[currentMonth] : MONTH_NAMES_TR[currentMonth]} {currentYear}
                      </h2>
                      <p className="text-xs text-[#8C8C8C]">
                        {isEn ? "Select a day to view workshop details" : "Günü seçerek atölye ayrıntılarını görüntüleyin"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrevMonth}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-black/5"
                        aria-label={isEn ? "Previous Month" : "Önceki Ay"}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-black/5"
                        aria-label={isEn ? "Next Month" : "Sonraki Ay"}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hafta Günleri */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#8C8C8C]">
                    {(isEn ? WEEK_DAYS_EN : WEEK_DAYS_TR).map((d) => (
                      <div key={d} className="py-2">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* 42 Hücrelik Takvim Izgarası */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cell, idx) => {
                      const dayWorkshops = getWorkshopsForDate(cell.date);
                      const hasWorkshops = dayWorkshops.length > 0;
                      const hasSelected = dayWorkshops.some((w) => w.id === selectedWorkshopId);

                      const allFull = hasWorkshops && dayWorkshops.every((w) => w.isFull);
                      const hasLastSpots =
                        hasWorkshops &&
                        dayWorkshops.some((w) => !w.isFull && w.remainingSpots <= 2);

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (hasWorkshops) {
                              soundFx.playClick();
                              setSelectedWorkshopId(dayWorkshops[0].id);
                            }
                          }}
                          className={`group relative flex min-h-[76px] flex-col justify-between rounded-lg border p-1.5 transition-all sm:min-h-[90px] sm:p-2 ${
                            !cell.isCurrentMonth
                              ? "border-transparent bg-zinc-50/50 text-zinc-300"
                              : "border-black/[0.04] bg-white text-zinc-800"
                          } ${
                            hasWorkshops
                              ? "cursor-pointer hover:border-black/30 hover:shadow-sm"
                              : ""
                          } ${
                            hasSelected
                              ? "ring-2 ring-black ring-offset-2 border-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-medium ${
                                !cell.isCurrentMonth
                                  ? "text-zinc-300"
                                  : hasSelected
                                  ? "font-bold text-black"
                                  : "text-zinc-700"
                              }`}
                            >
                              {cell.dayNumber}
                            </span>
                            {hasWorkshops && (
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  allFull
                                    ? "bg-zinc-400"
                                    : hasLastSpots
                                    ? "bg-amber-500 animate-pulse"
                                    : "bg-emerald-500"
                                }`}
                              />
                            )}
                          </div>

                          {/* Günlük Atölye Önizleme Rozetleri */}
                          {hasWorkshops && (
                            <div className="mt-1 flex flex-col gap-1">
                              {dayWorkshops.map((w) => {
                                const details = getLocalizedWorkshopDetails(w);
                                return (
                                  <div
                                    key={w.id}
                                    className={`truncate rounded px-1 py-0.5 text-[9px] sm:text-[10px] font-medium leading-tight transition-colors ${
                                      selectedWorkshopId === w.id
                                        ? "bg-black text-white"
                                        : w.isFull
                                        ? "bg-zinc-100 text-zinc-500 line-through"
                                        : w.remainingSpots <= 2
                                        ? "bg-amber-50 text-amber-900 border border-amber-200"
                                        : "bg-emerald-50 text-emerald-900 border border-emerald-200"
                                    }`}
                                    title={`${details.title} (${w.remainingSpots} ${isEn ? "seats left" : "yer kaldı"})`}
                                  >
                                    {details.title}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Takvim Renk Açıklaması (Legend) */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-4 text-xs text-[#8C8C8C]">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {isEn ? "Available" : "Kontenjan Açık"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        {isEn ? "Last 2 Seats" : "Son 2 Yer"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-zinc-400" />
                        {isEn ? "Booked" : "Doldu"}
                      </span>
                    </div>
                    <span>{isEn ? `Total ${workshops.length} Sessions` : `Toplam ${workshops.length} Oturum`}</span>
                  </div>
                </div>
              ) : (
                /* Liste / Zaman Çizelgesi Görünümü */
                <div className="space-y-4">
                  {filteredWorkshops.map((w) => {
                    const isSelected = selectedWorkshopId === w.id;
                    const wDate = new Date(w.date);
                    const details = getLocalizedWorkshopDetails(w);

                    return (
                      <div
                        key={w.id}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedWorkshopId(w.id);
                        }}
                        className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                          isSelected
                            ? "border-black bg-white shadow-md ring-1 ring-black"
                            : "border-black/10 bg-white hover:border-black/30"
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-4">
                            {/* Tarih Kartı */}
                            <div className="flex flex-col items-center justify-center rounded-xl bg-black text-white px-3 py-2 min-w-[64px]">
                              <span className="text-xs uppercase tracking-wider text-zinc-400">
                                {(isEn ? MONTH_NAMES_EN : MONTH_NAMES_TR)[wDate.getMonth()].slice(0, 3)}
                              </span>
                              <span className="text-xl font-bold">{wDate.getDate()}</span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-black text-base">{details.title}</h3>
                                {w.isFull ? (
                                  <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 uppercase">
                                    {isEn ? "Booked" : "Doldu"}
                                  </span>
                                ) : w.remainingSpots <= 2 ? (
                                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 uppercase">
                                    {isEn ? `Last ${w.remainingSpots} Seats` : `Son ${w.remainingSpots} Yer`}
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase">
                                    {w.remainingSpots} {isEn ? "Seats" : "Kontenjan"}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-[#8C8C8C] flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {w.durationMinutes} {isEn ? "Min" : "Dk"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {details.location.split(",")[0]}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                            <span className="text-lg font-light text-black">
                              ₺{Number(w.price).toLocaleString("tr-TR")}
                            </span>
                            <div className="w-32 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  w.isFull
                                    ? "bg-zinc-400"
                                    : w.remainingSpots <= 2
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${w.fillPercentage}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[#8C8C8C]">
                              {w.enrolledCount}/{w.capacity} {isEn ? `Filled (${w.fillPercentage}%)` : `Dolu (%${w.fillPercentage})`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SAĞ SÜTUN: Seçili Atölye Detayı & Gerçek Zamanlı Kapasite Paneli (5 Kolon) */}
            <div className="lg:col-span-5">
              {selectedWorkshop && selectedLocalized ? (
                <div id={selectedWorkshop.slug} className="sticky top-24 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                  {/* Görsel */}
                  {selectedWorkshop.imageUrl && (
                    <div className="relative mb-5 h-48 w-full overflow-hidden rounded-xl bg-zinc-100">
                      <Image
                        src={selectedWorkshop.imageUrl}
                        alt={selectedLocalized.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 500px"
                      />
                      <div className="absolute top-3 right-3">
                        {selectedWorkshop.isFull ? (
                          <span className="flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <XCircle className="h-3 w-3 text-red-400" /> {isEn ? "Fully Booked" : "Kontenjan Doldu"}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-emerald-900 shadow-sm backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                            {isEn ? `Remaining: ${selectedWorkshop.remainingSpots} Seats` : `Kalan: ${selectedWorkshop.remainingSpots} Kişi`}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Atölye Başlığı */}
                  <h3 className="text-xl font-medium tracking-tight text-black sm:text-2xl">
                    {selectedLocalized.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#8C8C8C] sm:text-sm">
                    {selectedLocalized.description}
                  </p>

                  {/* GERÇEK ZAMANLI KAPASİTE MOTORU KARTI */}
                  <div className="mt-5 rounded-xl border border-black/5 bg-[#F9F9F9] p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-black flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-zinc-600" />
                        {isEn ? "Live Seat Capacity" : "Canlı Kontenjan Durumu"}
                      </span>
                      <span className="font-mono font-medium text-zinc-700">
                        {selectedWorkshop.enrolledCount} / {selectedWorkshop.capacity} {isEn ? "Enrolled" : "Katılımcı"}
                      </span>
                    </div>

                    {/* İlerleme Çubuğu */}
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className={`h-full transition-all duration-500 ${
                          selectedWorkshop.isFull
                            ? "bg-zinc-500"
                            : selectedWorkshop.remainingSpots <= 2
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${selectedWorkshop.fillPercentage}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#8C8C8C]">
                      <span>{isEn ? "Fill Ratio" : "Doluluk Oranı"}: %{selectedWorkshop.fillPercentage}</span>
                      {selectedWorkshop.isFull ? (
                        <span className="font-medium text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> {isEn ? "Registration closed" : "Yeni kayıtlar kapandı"}
                        </span>
                      ) : (
                        <span className="font-medium text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {isEn ? `Open (${selectedWorkshop.remainingSpots} spots available)` : `Kayıt Açık (${selectedWorkshop.remainingSpots} boş koltuk)`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ayrıntılı Bilgi Listesi */}
                  <div className="mt-5 space-y-3 text-xs text-zinc-700 border-t border-black/5 pt-4">
                    <div className="flex items-center gap-2.5">
                      <CalendarIcon className="h-4 w-4 text-[#8C8C8C]" />
                      <span>{formatDateString(selectedWorkshop.date)}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-[#8C8C8C]" />
                      <span>{isEn ? "Duration" : "Süre"}: {selectedWorkshop.durationMinutes} {isEn ? "Minutes" : "Dakika"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <User className="h-4 w-4 text-[#8C8C8C]" />
                      <span>{isEn ? "Instructor" : "Eğitmen"}: {selectedWorkshop.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-[#8C8C8C]" />
                      <span>{isEn ? "Location" : "Lokasyon"}: {selectedLocalized.location}</span>
                    </div>
                    {selectedLocalized.materialsIncluded && (
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="h-4 w-4 text-[#8C8C8C] shrink-0 mt-0.5" />
                        <span className="text-[#8C8C8C]">
                          <strong className="text-zinc-700">{isEn ? "Materials Included" : "Dahil Olanlar"}: </strong>
                          {selectedLocalized.materialsIncluded}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Fiyat & Rezervasyon Çağrısı */}
                  <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
                    <div>
                      <span className="block text-[11px] text-[#8C8C8C] uppercase tracking-wider">
                        {isEn ? "Fee per Attendee" : "Kişi Başı Ücret"}
                      </span>
                      <span className="text-2xl font-light text-black">
                        ₺{Number(selectedWorkshop.price).toLocaleString("tr-TR")}
                      </span>
                    </div>

                    {selectedWorkshop.isFull ? (
                      <button
                        disabled
                        className="flex cursor-not-allowed items-center gap-2 rounded-full bg-zinc-200 px-5 py-2.5 text-xs font-medium text-zinc-500"
                      >
                        {isEn ? "Fully Booked" : "Kontenjan Doldu"}
                      </button>
                    ) : (
                      <button
                        onClick={handleBooking}
                        className="flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 hover:bg-zinc-800"
                      >
                        <span>{isEn ? "Book Reservation" : "Rezervasyon Yap"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-black/20 p-8 text-center text-xs text-[#8C8C8C]">
                  {isEn ? "Please select a workshop from the calendar or list." : "Lütfen takvimden veya listeden bir atölye seçiniz."}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* DİJİTAL ATÖLYE BİLETİ ONAY MODALI (BRUTALIST PASS MODAL) */}
      {showModal && confirmedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border-2 border-neutral-950 p-6 sm:p-8 shadow-[10px_10px_0px_#000] animate-in fade-in zoom-in-95 duration-200">
            {/* Kapat Butonu */}
            <button
              onClick={() => {
                soundFx.playClick();
                setShowModal(false);
              }}
              className="absolute top-4 right-4 p-1.5 border border-neutral-950 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-950" />
            </button>

            {/* Bilet Başlığı */}
            <div className="border-b-2 border-neutral-950 pb-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
                <span className="bg-neutral-950 text-amber-300 px-2 py-0.5 font-bold">
                  {isEn ? "CONFIRMED" : "ONAYLANDI"}
                </span>
                <span>{isEn ? "RESERVATION REF" : "REZERVASYON NO"}: {confirmedTicket.ticketCode}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-tight text-neutral-950">
                {isEn ? "Workshop Seat Reserved" : "Atölye Yeri Rezerve Edildi"}
              </h2>
            </div>

            {/* Bilet Ayrıntıları */}
            <div className="bg-neutral-50 border border-neutral-200 p-5 space-y-3 text-xs font-mono text-neutral-800 mb-6">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">
                  {isEn ? "WORKSHOP TITLE" : "ATÖLYE BAŞLIĞI"}
                </span>
                <span className="font-serif text-lg font-bold text-neutral-950">{confirmedTicket.workshopTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    {isEn ? "DATE & TIME" : "TARİH & SAAT"}
                  </span>
                  <span className="font-bold text-neutral-950">{confirmedTicket.workshopDate}</span>
                  <span className="text-neutral-600 block">{confirmedTicket.workshopTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    {isEn ? "INSTRUCTOR" : "EĞİTMEN"}
                  </span>
                  <span className="font-bold text-neutral-950">{confirmedTicket.instructor}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <span className="text-[10px] text-neutral-400 block uppercase">
                  {isEn ? "LOCATION" : "LOKASYON"}
                </span>
                <span className="font-bold text-neutral-950">{confirmedTicket.location}</span>
              </div>
            </div>

            {/* QR ve Profil Yönlendirmesi */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-dashed border-neutral-950">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 bg-neutral-950 text-white flex items-center justify-center p-1.5 shrink-0">
                  <QrCode className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    {isEn ? "DIGITAL PASS BARCODE" : "DİJİTAL GİRİŞ BARKODU"}
                  </span>
                  <span className="font-mono text-xs font-bold text-neutral-950">{confirmedTicket.ticketCode}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/profil"
                  onClick={() => soundFx.playClick()}
                  className="w-full sm:w-auto text-center bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest px-4 py-2.5 shadow-[2px_2px_0px_#666]"
                >
                  {isEn ? "Go to My Profile →" : "Profilime Git →"}
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

