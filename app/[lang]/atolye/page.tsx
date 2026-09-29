'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Clock, MapPin, Users, Check, ArrowUpRight } from 'lucide-react';
import { WORKSHOPS_DATA, type WorkshopItem } from '@/lib/workshops-data';
import { useAuth } from '@/lib/auth-context';
import { soundFx } from '@/lib/sound-fx';

export default function LocalizedAtolyePage() {
  const { addReservation } = useAuth();
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleBook = (ws: WorkshopItem) => {
    soundFx.playClick();
    addReservation({
      workshopId: ws.id,
      workshopTitle: ws.title,
      workshopDate: `Ekim 2026`,
      workshopTime: `${ws.hour}:00 - ${ws.hour + Math.floor(ws.durationMinutes / 60)}:00`,
      location: ws.location,
      instructor: ws.instructor,
      seatCount: 1,
      totalPrice: ws.price,
    });
    setBookingSuccess(ws.id);
    setTimeout(() => setBookingSuccess(null), 4000);
  };

  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 pt-20 sm:pt-28 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="border-b border-neutral-800 pb-8 mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] sm:text-[10px] text-amber-400 tracking-[0.3em] uppercase">
            ATELIER // WORKSHOPS 2026
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase font-light">
          Atölye & Pratik
        </h1>
        <p className="mt-4 font-mono text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
          Kayıp mum döküm, brutalist form inşası, seramik ve maden kimyası üzerine sınırlı kontenjanlı stüdyo seansları.
        </p>
      </header>

      {/* Workshop List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {WORKSHOPS_DATA.map((ws) => {
          const isBooked = bookingSuccess === ws.id;

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
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 border border-neutral-800 text-[8px] font-mono tracking-widest text-amber-400 uppercase">
                    {ws.categoryTitle}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    {ws.durationMinutes} DK
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-neutral-400" />
                    {ws.capacity - ws.enrolledCount} KONTENJAN
                  </span>
                </div>

                <h2 className="font-serif text-lg sm:text-xl text-white uppercase tracking-tight mb-2 group-hover:text-amber-300 transition-colors">
                  {ws.title}
                </h2>

                <p className="font-sans text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                  {ws.description}
                </p>

                <div className="space-y-1.5 border-t border-neutral-900 pt-3 text-[10px] font-mono text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{ws.location}</span>
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
                  onClick={() => handleBook(ws)}
                  className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    isBooked
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-white hover:bg-neutral-200 text-black'
                  }`}
                >
                  {isBooked ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Rezerve Edildi</span>
                    </>
                  ) : (
                    <>
                      <span>Kayıt Ol</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
