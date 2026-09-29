'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ticket, Calendar, MapPin, LogOut, Bookmark } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { soundFx } from '@/lib/sound-fx';

export default function LocalizedProfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, cancelReservation } = useAuth();

  const handleLogout = async () => {
    soundFx.playClick();
    await logout();
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="w-full min-h-screen bg-black text-neutral-200 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <h1 className="font-serif text-2xl text-white uppercase">Oturum Açılmadı</h1>
          <p className="font-mono text-xs text-neutral-400">
            Koleksiyoner profilinizi ve rezervasyonlarınızı görüntülemek için lütfen giriş yapın.
          </p>
          <Link
            href="/giris"
            className="inline-block bg-white text-black px-6 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 pt-20 sm:pt-28 pb-24 px-4 sm:px-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <header className="border-b border-neutral-800 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="font-mono text-[9px] text-amber-400 tracking-[0.3em] uppercase">
              {user.membershipTier}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white uppercase tracking-tight">
            {user.name}
          </h1>
          <p className="font-mono text-xs text-neutral-500 mt-1">
            {user.email} • Üyelik: {user.memberSince}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="border border-neutral-800 hover:border-neutral-600 px-4 py-2 font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Çıkış Yap</span>
        </button>
      </header>

      {/* Content grid */}
      <div className="space-y-12">
        {/* Atölye Rezervasyonları */}
        <section>
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-neutral-800 text-xs font-mono text-neutral-400 uppercase tracking-widest">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Kayıtlı Atölye Seansları & Biletler ({user.reservations.length})</span>
          </div>

          {user.reservations.length === 0 ? (
            <div className="border border-neutral-900 bg-neutral-950/60 p-8 text-center space-y-3 font-mono text-xs text-neutral-500">
              <p>Henüz aktif bir atölye rezervasyonunuz bulunmuyor.</p>
              <Link href="/atolye" className="text-amber-400 hover:underline inline-block uppercase">
                Atölye Programını İnceleyin →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.reservations.map((res) => (
                <div
                  key={res.id}
                  className="border border-neutral-800 bg-neutral-950/80 p-5 flex flex-col justify-between"
                >
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                      <span>BİLET: {res.ticketCode}</span>
                      <span className="text-emerald-400 font-semibold">{res.status}</span>
                    </div>

                    <h2 className="font-serif text-lg text-white uppercase">{res.workshopTitle}</h2>

                    <div className="space-y-1 font-mono text-[10px] text-neutral-400 pt-2 border-t border-neutral-900">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        <span>{res.workshopDate} • {res.workshopTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span className="truncate">{res.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs font-mono">
                    <span className="text-white font-semibold">{res.totalPrice}</span>
                    {res.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => cancelReservation(res.id)}
                        className="text-[10px] text-red-400/80 hover:text-red-300 uppercase tracking-wider cursor-pointer"
                      >
                        İptal Et
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Kayıtlı Eserler */}
        <section>
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-neutral-800 text-xs font-mono text-neutral-400 uppercase tracking-widest">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Koleksiyon Takip Listesi ({user.savedArtworkIds.length})</span>
          </div>

          <div className="border border-neutral-900 bg-neutral-950/60 p-6 flex items-center justify-between font-mono text-xs">
            <span className="text-neutral-400">
              Kayıtlı Eserler: {user.savedArtworkIds.join(', ')}
            </span>
            <Link href="/shop" className="text-amber-400 hover:underline uppercase">
              Koleksiyon Galerisine Git →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
