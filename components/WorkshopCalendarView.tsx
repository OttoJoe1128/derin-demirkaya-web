'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Clock,
  MapPin,
  Users,
  Check,
  ArrowUpRight,
  X,
  Ticket,
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

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
  } | null>(null);

  // Kategori Listesi
  const categories = useMemo(() => [
    { id: 'all', label: isEn ? 'ALL SESSIONS' : 'TÜM SEANSLAR' },
    { id: 'casting', label: isEn ? 'RAKU & CASTING' : 'RAKU & DÖKÜM' },
    { id: 'wheel', label: isEn ? 'PORCELAIN WHEEL' : 'PORSELEN TORNA' },
    { id: 'chemistry', label: isEn ? 'GLAZE CHEMISTRY' : 'SIR KİMYASI' },
    { id: 'sculpture', label: isEn ? 'SCULPTURE' : 'HEYKEL İNŞASI' },
    { id: 'kintsugi', label: isEn ? 'KINTSUGI' : 'KINTSUGI' },
  ], [isEn]);

  // Filtrelenmiş Atölyeler
  const filteredWorkshops = useMemo(() => {
    if (selectedCategory === 'all') return WORKSHOPS_DATA;
    return WORKSHOPS_DATA.filter((w) => w.category === selectedCategory);
  }, [selectedCategory]);

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
    const newRes = addReservation({
      workshopId: activeModalWorkshop.id,
      workshopTitle: activeModalWorkshop.title,
      workshopDate: '28 Ekim 2026',
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
    });
  };

  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 pt-24 sm:pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* 1. ÜST BAŞLIK */}
      <header className="border-b border-neutral-800 pb-8 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] sm:text-[10px] text-amber-400 tracking-[0.3em] uppercase">
            STÜDYO & AKADEMİ // 2026 SCHEDULE
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase font-light">
          {isEn ? 'Atelier & Workshops' : 'Atölye & Pratik'}
        </h1>
        <p className="mt-3 font-mono text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
          {isEn
            ? 'Intimate studio sessions on lost-wax casting, glaze alchemy, porcelain wheel throwing, and philosophical metalcraft.'
            : 'Kayıp mum döküm, sır kimyası, porselen torna ve felsefi heykel zanaatı üzerine sınırlı kontenjanlı stüdyo pratikleri.'}
        </p>

        {/* Kategori Filtre Butonları */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-neutral-900">
          {categories.map((cat) => (
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

      {/* 2. ATÖLYE LİSTESİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredWorkshops.map((ws) => {
          const remainingCapacity = ws.capacity - ws.enrolledCount;
          const isSoldOut = remainingCapacity <= 0;

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
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 border border-neutral-800 text-[8px] font-mono tracking-widest text-amber-400 uppercase">
                    {isEn ? ws.categoryTitleEn : ws.categoryTitle}
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
                    {ws.capacity} KİŞİLİK GRUP
                  </span>
                </div>

                <h2 className="font-serif text-lg sm:text-xl text-white uppercase tracking-tight mb-2 group-hover:text-amber-300 transition-colors">
                  {isEn ? ws.titleEn : ws.title}
                </h2>

                <p className="font-sans text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-4">
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
                  <span className="font-mono text-sm sm:text-base font-semibold text-white">{ws.price}</span>
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

      {/* 3. İNTERAKTİF REZERVASYON MODALI */}
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
                <h3 className="font-serif text-2xl text-white uppercase">Rezervasyon Onaylandı</h3>
                <p className="font-mono text-xs text-neutral-400">
                  {confirmedBooking.workshop.title} seansınız için kaydınız başarıyla oluşturuldu.
                </p>

                {/* Bilet Kartı */}
                <div className="border border-neutral-800 bg-neutral-900/60 p-4 text-left font-mono text-xs space-y-2 mt-4">
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-500">BİLET KODU:</span>
                    <span className="text-amber-400 font-bold">{confirmedBooking.ticketCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">KATILIMCI:</span>
                    <span className="text-white">{selectedSeats} Kişi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">TOPLAM TUTAR:</span>
                    <span className="text-white font-semibold">{confirmedBooking.totalPrice}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalWorkshop(null)}
                  className="w-full bg-white text-black py-2.5 font-mono text-xs uppercase tracking-wider font-semibold mt-4 cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                  <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest block">
                    SEANS REZERVASYONU
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white uppercase mt-1">
                    {activeModalWorkshop.title}
                  </h3>
                  <p className="font-mono text-xs text-neutral-400 mt-1">
                    Birim Ücret: {activeModalWorkshop.price}
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
                    placeholder="eposta@adresiniz.com"
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
