'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  LogOut,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  Edit3,
  QrCode,
  Ticket,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';
import { ARTWORKS_DATA } from '@/lib/artworks-data';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, cancelReservation, updateProfile, demoLogin } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'reservations' | 'account' | 'saved'>('reservations');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Form state for account edit
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'İstanbul, TR');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Giriş Yapılmamışsa Gösterilecek Karşılama Ekranı
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[80vh] bg-[#f5f3ef] py-20 px-6 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white border-2 border-neutral-950 p-8 shadow-[8px_8px_0px_#000] text-center">
          <div className="w-12 h-12 bg-neutral-950 text-white mx-auto flex items-center justify-center mb-4">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl uppercase tracking-tight text-neutral-950">
            {language === 'TR' ? 'Giriş Yapınız' : 'Sign In Required'}
          </h2>
          <p className="mt-3 text-xs text-neutral-600 leading-relaxed font-sans">
            {language === 'TR'
              ? 'Atölye rezervasyonlarınızı, dijital biletlerinizi ve özel koleksiyonunuzu görüntülemek için lütfen oturum açınız.'
              : 'Please sign in to view your workshop reservations, digital passes, and curated archive.'}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/giris"
              onClick={() => soundFx.playClick()}
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest py-3 px-4 transition-all shadow-[3px_3px_0px_#666]"
            >
              {t('auth.signIn')}
            </Link>

            <button
              onClick={() => demoLogin()}
              className="w-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-950 text-neutral-950 font-mono text-xs uppercase tracking-widest py-3 px-4 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('auth.quickDemo')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, city });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelReservation = (id: string) => {
    cancelReservation(id);
    setCancellingId(null);
  };

  const savedArtworks = ARTWORKS_DATA.filter((art) => user.savedArtworkIds.includes(art.id));

  return (
    <div className="min-h-screen bg-[#f5f3ef] text-neutral-950 py-12 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-6">

        {/* ========================================================================= */}
        {/* 🏛️ ÜST KOLEKSİYONER KİMLİK KARTI (BRUTALIST PROFILE BANNER) */}
        {/* ========================================================================= */}
        <div className="border-2 border-neutral-950 bg-white p-6 sm:p-10 shadow-[8px_8px_0px_#000] mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-neutral-950">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-950 text-white flex items-center justify-center border-2 border-neutral-950 shrink-0 font-serif text-2xl sm:text-3xl font-bold shadow-[4px_4px_0px_#aaa]">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
                  <span className="bg-neutral-950 text-amber-300 px-2 py-0.5 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {user.membershipTier}
                  </span>
                  <span>{'//'}</span>
                  <span>ÜYELİK: {user.memberSince}</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-tight text-neutral-950">
                  {user.name}
                </h1>
                <p className="text-xs font-mono text-neutral-600 mt-1">
                  {user.email} • {user.city}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/atolye"
                onClick={() => soundFx.playClick()}
                className="bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest px-5 py-3 transition-all shadow-[3px_3px_0px_#666] flex items-center gap-2"
              >
                <span>{language === 'TR' ? '+ Yeni Atölye Randevusu' : '+ New Booking'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  logout();
                }}
                title={t('nav.logout')}
                className="border-2 border-neutral-950 hover:bg-neutral-100 p-3 text-neutral-950 transition-colors shadow-[2px_2px_0px_#000]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hızlı İstatistik Metrikleri */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono uppercase">
            <div className="border-r border-neutral-200 pr-4">
              <span className="text-neutral-400 block text-[9px]">AKTİF BİLETLER</span>
              <span className="font-serif text-2xl font-bold text-neutral-950">
                {user.reservations.filter((r) => r.status === 'confirmed').length}
              </span>
            </div>
            <div className="border-r border-neutral-200 pr-4">
              <span className="text-neutral-400 block text-[9px]">GEÇMİŞ KATILIMLAR</span>
              <span className="font-serif text-2xl font-bold text-neutral-950">
                {user.reservations.filter((r) => r.status === 'completed').length}
              </span>
            </div>
            <div className="border-r border-neutral-200 pr-4">
              <span className="text-neutral-400 block text-[9px]">KAYITLI ESERLER</span>
              <span className="font-serif text-2xl font-bold text-neutral-950">
                {user.savedArtworkIds.length}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[9px]">DÖKÜM SEVİYESİ</span>
              <span className="font-serif text-lg font-bold text-neutral-950">
                ORGANİK BRONZ
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📑 SEKME BUTONLARI (BRUTALIST TAB SWITCHER) */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 border-b border-neutral-300">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('reservations');
            }}
            className={`font-mono text-xs uppercase tracking-widest px-5 py-3 border-2 transition-all flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-neutral-950 text-white border-neutral-950 shadow-[4px_4px_0px_#888]'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-950'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{t('profile.tabReservations')} ({user.reservations.length})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('account');
            }}
            className={`font-mono text-xs uppercase tracking-widest px-5 py-3 border-2 transition-all flex items-center gap-2 ${
              activeTab === 'account'
                ? 'bg-neutral-950 text-white border-neutral-950 shadow-[4px_4px_0px_#888]'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-950'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t('profile.tabAccount')}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('saved');
            }}
            className={`font-mono text-xs uppercase tracking-widest px-5 py-3 border-2 transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-neutral-950 text-white border-neutral-950 shadow-[4px_4px_0px_#888]'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-950'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t('profile.tabSaved')} ({user.savedArtworkIds.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 🎟️ SEKME 1: ATÖLYE REZERVASYONLARI & DİJİTAL BİLETLER */}
        {/* ========================================================================= */}
        {activeTab === 'reservations' && (
          <div>
            {user.reservations.length === 0 ? (
              <div className="bg-white border-2 border-neutral-950 p-12 text-center shadow-[6px_6px_0px_#000]">
                <Calendar className="w-10 h-10 text-neutral-400 mx-auto mb-4" />
                <h3 className="font-serif text-2xl uppercase tracking-tight text-neutral-950">
                  {t('profile.emptyReservations')}
                </h3>
                <p className="text-xs text-neutral-600 mt-2 max-w-md mx-auto">
                  {language === 'TR'
                    ? 'Kayıp mum dökümü, gümüş sıvama ve organik form şekillendirme takvimlerini inceleyerek yerinizi ayırtabilirsiniz.'
                    : 'Explore the lost-wax casting and sculptural form sessions to reserve your seat.'}
                </p>
                <Link
                  href="/atolye"
                  onClick={() => soundFx.playClick()}
                  className="mt-6 inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 shadow-[3px_3px_0px_#666]"
                >
                  <span>{t('profile.browseWorkshops')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {user.reservations.map((res) => {
                  const isConfirmed = res.status === 'confirmed';
                  const isCancelled = res.status === 'cancelled';

                  return (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border-2 border-neutral-950 bg-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all ${
                        isConfirmed
                          ? 'shadow-[6px_6px_0px_#000]'
                          : 'opacity-70 border-neutral-400 shadow-[3px_3px_0px_#ccc]'
                      }`}
                    >
                      {/* Bilet Üst Şeridi */}
                      <div>
                        <div className="flex items-center justify-between border-b-2 border-neutral-950 pb-3 mb-4 text-xs font-mono uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-950">[ TICKET ]</span>
                            <span className="font-bold">{res.ticketCode}</span>
                          </div>
                          <div>
                            {isConfirmed && (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                {language === 'TR' ? 'ONAYLANDI' : 'CONFIRMED'}
                              </span>
                            )}
                            {res.status === 'completed' && (
                              <span className="bg-neutral-100 text-neutral-700 border border-neutral-400 px-2 py-0.5 text-[10px]">
                                {language === 'TR' ? 'TAMAMLANDI' : 'COMPLETED'}
                              </span>
                            )}
                            {isCancelled && (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-900 border border-red-800 px-2 py-0.5 text-[10px]">
                                <XCircle className="w-3 h-3" />
                                {language === 'TR' ? 'İPTAL EDİLDİ' : 'CANCELLED'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Atölye Başlığı */}
                        <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-tight text-neutral-950 mb-3">
                          {res.workshopTitle}
                        </h3>

                        {/* Tarih, Saat, Lokasyon */}
                        <div className="space-y-2 text-xs font-mono text-neutral-700 my-4 bg-neutral-50 p-4 border border-neutral-200">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                            <span className="font-bold text-neutral-950">{res.workshopDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{res.workshopTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                            <span className="truncate">{res.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{language === 'TR' ? 'Eğitmen' : 'Instructor'}: {res.instructor}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bilet Alt Kısmı: Barkod / QR ve İptal Eylemi */}
                      <div className="pt-4 border-t-2 border-dashed border-neutral-950 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-950 text-white flex items-center justify-center p-1 shrink-0">
                            <QrCode className="w-8 h-8" />
                          </div>
                          <div>
                            <span className="block text-[9px] font-mono text-neutral-400 uppercase">
                              {res.seatCount} {language === 'TR' ? 'KATILIMCI' : 'SEAT'} • {res.totalPrice}
                            </span>
                            <span className="font-mono text-xs font-bold text-neutral-950">
                              PASS ID: {res.ticketCode}
                            </span>
                          </div>
                        </div>

                        {isConfirmed && (
                          <div>
                            {cancellingId === res.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleCancelReservation(res.id)}
                                  className="bg-red-800 hover:bg-red-900 text-white text-[10px] font-mono uppercase px-2.5 py-1.5"
                                >
                                  {language === 'TR' ? 'Evet, İptal Et' : 'Confirm Cancel'}
                                </button>
                                <button
                                  onClick={() => setCancellingId(null)}
                                  className="border border-neutral-400 text-neutral-700 text-[10px] font-mono uppercase px-2.5 py-1.5"
                                >
                                  {language === 'TR' ? 'Vazgeç' : 'Back'}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  soundFx.playClick();
                                  setCancellingId(res.id);
                                }}
                                className="text-[10px] font-mono uppercase tracking-wider text-red-700 hover:text-red-950 underline"
                              >
                                {t('profile.cancelReservation')}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📝 SEKME 2: PROFİL BİLGİLERİ VE DÜZENLEME */}
        {/* ========================================================================= */}
        {activeTab === 'account' && (
          <div className="max-w-2xl bg-white border-2 border-neutral-950 p-8 sm:p-10 shadow-[6px_6px_0px_#000]">
            <div className="border-b-2 border-neutral-950 pb-4 mb-6">
              <h2 className="font-serif text-2xl uppercase tracking-tight text-neutral-950">
                {t('profile.tabAccount')}
              </h2>
              <p className="text-xs text-neutral-600 mt-1 font-mono">
                {language === 'TR' ? 'Atölye iletişim ve sertifika bilgilerinizi güncelleyin.' : 'Update your studio pass and contact details.'}
              </p>
            </div>

            {saveSuccess && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-900 text-emerald-900 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{language === 'TR' ? 'Profil bilgileri başarıyla güncellendi.' : 'Profile updated successfully.'}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1.5">
                  {t('auth.name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-950 px-4 py-3 text-sm font-sans text-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1.5">
                  {t('auth.email')} ({language === 'TR' ? 'Değiştirilemez' : 'Immutable'})
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-neutral-200 border border-neutral-400 px-4 py-3 text-sm font-mono text-neutral-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1.5">
                  {t('auth.phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-950 px-4 py-3 text-sm font-sans text-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1.5">
                  {language === 'TR' ? 'Şehir / Ülke' : 'City / Country'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-950 px-4 py-3 text-sm font-sans text-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                />
              </div>

              <button
                type="submit"
                onMouseEnter={() => soundFx.playHover()}
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest py-3.5 px-4 transition-all shadow-[3px_3px_0px_#666] flex items-center justify-center gap-2 mt-6"
              >
                <span>{t('profile.saveChanges')}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 💍 SEKME 3: KAYDEDİLEN ESERLER (ÖZEL KOLEKSİYONUM) */}
        {/* ========================================================================= */}
        {activeTab === 'saved' && (
          <div>
            {savedArtworks.length === 0 ? (
              <div className="bg-white border-2 border-neutral-950 p-12 text-center shadow-[6px_6px_0px_#000]">
                <Bookmark className="w-10 h-10 text-neutral-400 mx-auto mb-4" />
                <h3 className="font-serif text-2xl uppercase tracking-tight text-neutral-950">
                  {language === 'TR' ? 'Henüz Kaydedilmiş Eser Yok' : 'No Saved Artworks Yet'}
                </h3>
                <p className="text-xs text-neutral-600 mt-2">
                  {language === 'TR'
                    ? 'Koleksiyon arşivi ve sinematik galeriden beğendiğiniz parçaları listenize ekleyebilirsiniz.'
                    : 'Add pieces you appreciate from the collection archive to your private list.'}
                </p>
                <Link
                  href="/koleksiyon"
                  onClick={() => soundFx.playClick()}
                  className="mt-6 inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 shadow-[3px_3px_0px_#666]"
                >
                  <span>{language === 'TR' ? 'Koleksiyonu İncele' : 'Browse Collection'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedArtworks.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white border-2 border-neutral-950 p-6 flex flex-col justify-between shadow-[5px_5px_0px_#000]"
                  >
                    <div>
                      <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden border border-neutral-950 mb-4">
                        <Image
                          src={art.images[0]}
                          alt={art.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                      <div className="flex items-baseline justify-between text-xs font-mono uppercase text-neutral-500 mb-1">
                        <span>{art.category}</span>
                        <span className="font-serif font-bold text-neutral-950 text-base">{art.price}</span>
                      </div>
                      <h3 className="font-serif text-2xl uppercase tracking-tight text-neutral-950">
                        {art.title}
                      </h3>
                      <p className="text-xs font-sans text-neutral-600 mt-2 line-clamp-2">
                        {art.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-neutral-400">
                        {art.collectionName}
                      </span>
                      <Link
                        href={`/koleksiyon/${art.id}`}
                        onClick={() => soundFx.playClick()}
                        className="bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase px-4 py-2 shadow-[2px_2px_0px_#666]"
                      >
                        <span>3D İncele</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
