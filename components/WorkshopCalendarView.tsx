'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  ArrowUpRight,
  X,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { WORKSHOPS_DATA, type WorkshopItem } from '@/lib/workshops-data';
import { useAuth } from '@/lib/auth-context';
import { soundFx } from '@/lib/sound-fx';
import type { Locale } from '@/lib/i18n-config';

interface WorkshopCalendarViewProps {
  lang?: Locale;
}

export default function WorkshopCalendarView({ lang = 'tr' }: WorkshopCalendarViewProps) {
  const isEn = lang === 'en';
  const { addReservation, user } = useAuth();

  // Takvim Ay Durumu (Varsayılan: Kasım 2026)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // 10 = Kasım (0-indexed)
  const currentYear = 2026;

  // Seçili Gün Filtresi (null = tüm günler)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Kategori Filtresi
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal Durumları
  const [activeModalWorkshop, setActiveModalWorkshop] = useState<WorkshopItem | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [confirmedBooking, setConfirmedBooking] = useState<{
    workshop: WorkshopItem;
    ticketCode: string;
    seats: number;
    totalPrice: string;
    dateStr: string;
  } | null>(null);

  const monthNames = useMemo(
    () => (isEn
      ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      : ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']),
    [isEn]
  );

  const weekDayNames = useMemo(
    () => (isEn
      ? ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
      : ['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PAZ']),
    [isEn]
  );

  // Atölyeleri Takvim Günlerine Eşleme
  // WorkshopItem.dateOffsetDays -> Gün (1-30)
  const workshopsByDay = useMemo(() => {
    const map: Record<number, WorkshopItem[]> = {};
    WORKSHOPS_DATA.forEach((ws) => {
      const day = ws.dateOffsetDays;
      if (!map[day]) map[day] = [];
      map[day].push(ws);
    });
    return map;
  }, []);

  // Filtrelenmiş Atölye Listesi
  const displayedWorkshops = useMemo(() => {
    let list = WORKSHOPS_DATA;
    if (selectedCategory !== 'all') {
      list = list.filter((w) => w.category === selectedCategory);
    }
    if (selectedDay !== null) {
      list = list.filter((w) => w.dateOffsetDays === selectedDay);
    }
    return list;
  }, [selectedCategory, selectedDay]);

  const handleOpenBooking = (ws: WorkshopItem) => {
    soundFx.playClick();
    setActiveModalWorkshop(ws);
    setSelectedSeats(1);
    setConfirmedBooking(null);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalWorkshop) return;

    soundFx.playSuccess();
    const totalPrice = `₺${(activeModalWorkshop.rawPrice * selectedSeats).toLocaleString('tr-TR')}`;
    const dateStr = `${activeModalWorkshop.dateOffsetDays} ${monthNames[currentMonthIndex]} ${currentYear}`;

    const newRes = addReservation({
      workshopId: activeModalWorkshop.id,
      workshopTitle: activeModalWorkshop.title,
      workshopDate: dateStr,
      workshopTime: `${activeModalWorkshop.hour}:00 - ${activeModalWorkshop.hour + Math.floor(activeModalWorkshop.durationMinutes / 60)}:00`,
      location: activeModalWorkshop.location,
      instructor: activeModalWorkshop.instructor,
      seatCount: selectedSeats,
      totalPrice,
    });

    setConfirmedBooking({
      workshop: activeModalWorkshop,
      ticketCode: newRes.ticketCode,
      seats: selectedSeats,
      totalPrice,
      dateStr,
    });
  };

  // 30 Günlük Ay Izgarası Oluşturma
  const daysInMonth = 30; // Kasım 30 gün
  const startDayOffset = 6; // Pazar gününe denk gelen offset

  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 pt-24 sm:pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto selection:bg-white selection:text-black">
      {/* 1. ÜST BAŞLIK */}
      <header className="border-b border-neutral-800 pb-8 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] sm:text-[10px] text-amber-400 tracking-[0.3em] uppercase">
            ATELIER // 2026 CALENDAR & SESSIONS
          </span>
        </div>
        <h1 className="font-serif text-[14px] text-white tracking-widest uppercase font-normal">
          {isEn ? 'Atelier & Masterclasses' : 'Atölye & Takvim'}
        </h1>
        <p className="mt-2 font-sans text-[12px] text-neutral-400 max-w-2xl leading-relaxed font-light">
          {isEn
            ? 'Interactive monthly schedule for lost-wax casting, molten silver pouring, and contemporary sculptural jewelry.'
            : 'Kayıp mum döküm, akkor gümüş akıtma ve heykelsi takı tasarımı üzerine interaktif takvim ve seans rezervasyonu.'}
        </p>

        {/* Kategori Filtre Butonları */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-neutral-900">
          {[
            { id: 'all', label: isEn ? 'ALL DISCIPLINES' : 'TÜM DİSİPLİNLER' },
            { id: 'casting', label: isEn ? 'RAKU & CASTING' : 'RAKU & DÖKÜM' },
            { id: 'wheel', label: isEn ? 'PORCELAIN WHEEL' : 'PORSELEN TORNA' },
            { id: 'chemistry', label: isEn ? 'GLAZE CHEMISTRY' : 'SIR KİMYASI' },
            { id: 'sculpture', label: isEn ? 'SCULPTURE' : 'HEYKEL İNŞASI' },
            { id: 'kintsugi', label: isEn ? 'KINTSUGI' : 'KINTSUGI' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* 2. İNTERAKTİF AY TAKVİMİ (CALENDAR GRID) */}
      <section className="mb-14 border border-neutral-800 bg-neutral-950/70 p-5 sm:p-8 shadow-2xl">
        {/* Ay Başlığı ve İleri/Geri Navigasyonu */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800/80 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="font-serif text-[14px] text-white uppercase tracking-wider font-normal">
              {monthNames[currentMonthIndex]} {currentYear}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            {selectedDay !== null && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setSelectedDay(null);
                }}
                className="px-2.5 py-1 text-amber-400 hover:text-white border border-amber-400/40 hover:border-white transition-colors cursor-pointer mr-2"
              >
                {isEn ? 'SHOW ALL DAYS' : 'TÜM GÜNLERİ GÖSTER'}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setCurrentMonthIndex((m) => (m === 0 ? 11 : m - 1));
              }}
              className="p-1.5 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Önceki Ay"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setCurrentMonthIndex((m) => (m === 11 ? 0 : m + 1));
              }}
              className="p-1.5 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Sonraki Ay"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Gün İsimleri (PZT ... PAZ) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center font-mono text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest">
          {weekDayNames.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* 7-Kolon Gün Hücreleri */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Boş Günler (Ay Başlangıç Offseti) */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-14 sm:h-20 border border-neutral-900/40 bg-neutral-950/20 opacity-30"
            />
          ))}

          {/* Gün Hücreleri (1 - 30) */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const workshopsOnDay = workshopsByDay[dayNum] || [];
            const hasWorkshops = workshopsOnDay.length > 0;
            const isSelected = selectedDay === dayNum;

            return (
              <div
                key={dayNum}
                onClick={() => {
                  if (hasWorkshops) {
                    soundFx.playClick();
                    setSelectedDay(isSelected ? null : dayNum);
                  }
                }}
                className={`h-14 sm:h-20 p-1.5 sm:p-2 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                    : hasWorkshops
                    ? 'border-neutral-700 bg-neutral-900/60 hover:border-neutral-500 cursor-pointer'
                    : 'border-neutral-900/60 bg-neutral-950/40 text-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs sm:text-sm font-semibold ${
                      isSelected ? 'text-amber-300' : hasWorkshops ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {hasWorkshops && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>

                {hasWorkshops && (
                  <div className="hidden sm:block">
                    <span className="font-mono text-[8px] text-amber-300/90 truncate block uppercase">
                      {workshopsOnDay[0].title}
                    </span>
                    <span className="font-mono text-[7px] text-neutral-500">
                      {workshopsOnDay[0].hour}:00 • {workshopsOnDay[0].capacity - workshopsOnDay[0].enrolledCount} YER
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SEÇİLİ SEANSLAR LİSTESİ */}
      <section>
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <h2 className="font-serif text-[14px] text-white uppercase tracking-widest font-normal">
              {selectedDay !== null
                ? `${selectedDay} ${monthNames[currentMonthIndex]} ${isEn ? 'Sessions' : 'Seansları'}`
                : isEn
                ? 'All Scheduled Workshops'
                : 'Tüm Planlanan Atölyeler'}
            </h2>
          </div>
          <span className="font-mono text-[10px] text-neutral-400">
            {displayedWorkshops.length} {isEn ? 'SESSIONS AVAILABLE' : 'SEANS MEVCUT'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedWorkshops.map((ws) => {
            const remainingCapacity = ws.capacity - ws.enrolledCount;
            const isSoldOut = remainingCapacity <= 0;
            const sessionDate = `${ws.dateOffsetDays} ${monthNames[currentMonthIndex]} ${currentYear}`;

            return (
              <article
                key={ws.id}
                className="group border border-neutral-800 bg-neutral-950/80 p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 border border-neutral-800 mb-4">
                    <Image
                      src={ws.imageUrl}
                      alt={ws.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.05]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-black/85 px-2 py-0.5 border border-neutral-800 text-[8px] font-mono tracking-widest text-amber-400 uppercase">
                      {sessionDate} • {ws.hour}:00
                    </div>
                    {isSoldOut ? (
                      <div className="absolute top-2 right-2 bg-red-950/90 text-red-400 border border-red-800 px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase">
                        DOLU
                      </div>
                    ) : (
                      <div className="absolute top-2 right-2 bg-neutral-950/90 text-emerald-400 border border-neutral-800 px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase">
                        {remainingCapacity} KONTENJAN
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {ws.durationMinutes} DK
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-neutral-400" />
                      {ws.capacity} KİŞİ
                    </span>
                  </div>

                  <h3 className="font-serif text-[12px] text-white uppercase tracking-wider mb-2 group-hover:text-amber-300 transition-colors font-normal">
                    {isEn ? ws.titleEn : ws.title}
                  </h3>

                  <p className="font-sans text-[12px] text-neutral-400 line-clamp-3 leading-relaxed mb-4 font-light">
                    {isEn ? ws.descriptionEn : ws.description}
                  </p>

                  <div className="space-y-1.5 border-t border-neutral-900 pt-3 text-[10px] font-mono text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{isEn ? ws.locationEn : ws.location}</span>
                    </div>
                    <div className="text-neutral-400">
                      Eğitmen: {ws.instructor}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 block uppercase">Ücret</span>
                    <span className="font-mono text-[10px] font-semibold text-white">{ws.price}</span>
                  </div>

                  <button
                    type="button"
                    disabled={isSoldOut}
                    onClick={() => handleOpenBooking(ws)}
                    className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSoldOut
                        ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                        : 'bg-white hover:bg-neutral-200 text-black font-semibold'
                    }`}
                  >
                    <span>{isSoldOut ? 'Tükendi' : 'Rezerve Et'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. İNTERAKTİF REZERVASYON MODALI */}
      {activeModalWorkshop && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveModalWorkshop(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {confirmedBooking ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-[14px] text-white uppercase tracking-wider font-normal">Rezervasyon Onaylandı</h3>
                <p className="font-sans text-[12px] text-neutral-400 font-light">
                  {confirmedBooking.workshop.title} seansınız için kaydınız başarıyla oluşturuldu.
                </p>

                {/* Bilet Kartı */}
                <div className="border border-neutral-800 bg-neutral-900/60 p-4 text-left font-mono text-[10px] space-y-2 mt-4">
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-500">BİLET KODU:</span>
                    <span className="text-white font-bold">{confirmedBooking.ticketCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">TARİH & SAAT:</span>
                    <span className="text-white">{confirmedBooking.dateStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">KATILIMCI:</span>
                    <span className="text-white">{confirmedBooking.seats} Kişi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">TOPLAM TUTAR:</span>
                    <span className="text-white font-semibold">{confirmedBooking.totalPrice}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalWorkshop(null)}
                  className="w-full bg-white text-black py-2.5 font-mono text-[10px] uppercase tracking-wider font-bold mt-4 cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                  <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block">
                    SEANS REZERVASYONU
                  </span>
                  <h3 className="font-serif text-[14px] text-white uppercase mt-1 tracking-wider font-normal">
                    {activeModalWorkshop.title}
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-400 mt-1">
                    Tarih: {activeModalWorkshop.dateOffsetDays} {monthNames[currentMonthIndex]} {currentYear} • {activeModalWorkshop.hour}:00
                  </p>
                </div>

                {/* Kontenjan Seçici */}
                <div>
                  <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1.5">
                    Katılımcı Sayısı
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedSeats((s) => Math.max(1, s - 1))}
                      className="w-8 h-8 border border-neutral-800 bg-neutral-900 text-white font-mono flex items-center justify-center cursor-pointer hover:border-neutral-600"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-semibold text-white px-2">
                      {selectedSeats}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSeats((s) =>
                          Math.min(activeModalWorkshop.capacity - activeModalWorkshop.enrolledCount, s + 1)
                        )
                      }
                      className="w-8 h-8 border border-neutral-800 bg-neutral-900 text-white font-mono flex items-center justify-center cursor-pointer hover:border-neutral-600"
                    >
                      +
                    </button>
                    <span className="font-mono text-xs text-neutral-500 ml-auto">
                      Toplam: ₺{(activeModalWorkshop.rawPrice * selectedSeats).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="İsminiz"
                    className="w-full bg-neutral-900 border border-neutral-800 py-2 px-3 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                    E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="derinbusedemirkaya@gmail.com"
                    className="w-full bg-neutral-900 border border-neutral-800 py-2 px-3 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full bg-neutral-900 border border-neutral-800 py-2 px-3 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-neutral-200 text-black py-3 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Rezervasyonu Onayla & Bilet Al</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
