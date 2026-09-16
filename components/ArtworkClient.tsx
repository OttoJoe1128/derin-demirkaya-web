'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  Share2,
  Maximize2,
  Mail,
  ChevronRight,
  Send,
} from 'lucide-react';
import type { ArtworkDetail } from '@/lib/artworks-data';

interface ArtworkClientProps {
  artwork: ArtworkDetail;
}

export default function ArtworkClient({ artwork }: ArtworkClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    note: '',
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${artwork.title} — Derin Demirkaya`,
          text: artwork.description,
          url: window.location.href,
        });
      } catch {
        // kullanıcı iptal etti
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simüle edilen güvenli atölye sipariş talebi akışı
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Üst Navigasyon Çubuğu */}
      <div className="border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/koleksiyon"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Koleksiyona Dön</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs font-sans uppercase tracking-widest text-neutral-400">
              {artwork.collectionName}
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-400 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Paylaş</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* SOL: GALERİ BÖLÜMÜ (7 Kolon) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Ana Büyük Görsel */}
            <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-200/60 group">
              <Image
                src={artwork.images[activeImageIndex] || artwork.images[0]}
                alt={artwork.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Büyütme Butonu */}
              <button
                onClick={() => setIsZoomOpen(true)}
                aria-label="Görseli büyüt"
                className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full text-neutral-900 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {artwork.isUniquePiece && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-900/90 text-white text-[10px] uppercase font-sans tracking-widest backdrop-blur-sm">
                  1/1 Eşsiz Eser (Unique)
                </div>
              )}
            </div>

            {/* Küçük Önizleme Thumbnail'leri */}
            {artwork.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {artwork.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square overflow-hidden border transition-all ${
                      activeImageIndex === idx
                        ? 'border-neutral-950 ring-2 ring-neutral-950/20'
                        : 'border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${artwork.title} görünüm ${idx + 1}`}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Malzeme & Dokusal Editoryal Not */}
            <div className="p-6 md:p-8 bg-white border border-neutral-200/70 rounded-none mt-4">
              <div className="flex items-center gap-2 mb-3 text-neutral-400">
                <Sparkles className="w-4 h-4 text-neutral-900" />
                <span className="text-xs uppercase tracking-widest font-sans text-neutral-900 font-medium">
                  Atölye ve Malzeme Notu
                </span>
              </div>
              <p className="font-sans text-sm text-neutral-600 leading-relaxed">
                {artwork.editorialNote}
              </p>
            </div>
          </div>

          {/* SAĞ: BAŞLIK, FİYAT, DETAYLAR & SATIN ALMA TALEBİ (5 Kolon) */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-36">
            <div>
              <span className="text-xs font-sans uppercase tracking-widest text-neutral-500 block mb-2">
                {artwork.category} — {artwork.year}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-950 leading-tight mb-4">
                {artwork.title}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="font-sans text-2xl md:text-3xl text-neutral-900 font-light">
                  {artwork.price}
                </span>
                <span className="text-xs font-sans text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 uppercase tracking-widest">
                  {artwork.stock > 0 ? `Atölyede Mevcut (${artwork.stock} Adet)` : 'Siparişe Göre Üretilir'}
                </span>
              </div>
            </div>

            {/* Açıklama */}
            <p className="font-sans text-sm md:text-base text-neutral-700 leading-relaxed border-t border-b border-neutral-200/80 py-6">
              {artwork.description}
            </p>

            {/* Eser Detay Özellikleri */}
            <div className="space-y-3 font-sans text-xs uppercase tracking-wider">
              {artwork.specs.map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-200/50">
                  <span className="text-neutral-500">{spec.label}</span>
                  <span className="text-neutral-900 font-medium text-right max-w-[60%] normal-case font-mono">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Eylem Butonları */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full py-4 px-6 bg-neutral-950 hover:bg-neutral-800 text-white font-sans text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Satın Al / Rezervasyon Talebi Oluştur</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="mailto:sircaedebiyat@gmail.com?subject=Eser%20Hakk%C4%B1nda%20Bilgi%3A%20${encodeURIComponent(artwork.title)}"
                className="w-full py-3.5 px-6 border border-neutral-300 hover:border-neutral-950 text-neutral-900 font-sans text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Sanatçıya Özel Soru Sor</span>
              </a>
            </div>

            {/* Güven ve Teslimat Güvenceleri */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-xs uppercase font-medium text-neutral-900">
                    Orijinallik Belgesi
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Sanatçı imzalı sertifika ve özel kutu ile sunulur.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-xs uppercase font-medium text-neutral-900">
                    Sigortalı Kargo
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Tüm eserler kırılmaya karşı sigortalı ulaştırılır.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* FULLSCREEN GÖRSEL BÜYÜTME MODALI */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-[99999] bg-neutral-950/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative w-full max-w-5xl aspect-[4/5] sm:aspect-square max-h-[90vh]">
              <Image
                src={artwork.images[activeImageIndex] || artwork.images[0]}
                alt={artwork.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white uppercase font-sans text-xs tracking-widest px-4 py-2 border border-white/20"
            >
              Kapat ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SATIN ALMA / REZERVASYON MODALI */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg border border-neutral-300 p-8 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsOrderModalOpen(false);
                  setIsSuccess(false);
                }}
                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 text-xs font-sans uppercase tracking-widest"
              >
                ✕ Kapat
              </button>

              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-neutral-900">
                    Talebiniz Alındı
                  </h3>
                  <p className="font-sans text-sm text-neutral-600 leading-relaxed max-w-sm mx-auto">
                    <strong>{artwork.title}</strong> eseri için rezervasyon talebiniz atölyemize ulaştı. 
                    Detaylar ve güvenli ödeme/teslimat adımları için 24 saat içinde <strong>{formData.email}</strong> adresine dönüş yapılacaktır.
                  </p>
                  <button
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setIsSuccess(false);
                    }}
                    className="mt-6 px-6 py-3 bg-neutral-950 text-white text-xs uppercase tracking-widest hover:bg-neutral-800"
                  >
                    Kapat
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 block mb-1">
                    Eser Rezervasyonu & Sipariş
                  </span>
                  <h2 className="font-serif text-2xl text-neutral-950 mb-1">
                    {artwork.title}
                  </h2>
                  <p className="font-sans text-sm text-neutral-700 mb-6">
                    Tutar: <span className="font-semibold">{artwork.price}</span> (KDV ve sigortalı kargo dahil)
                  </p>

                  <form onSubmit={handleOrderSubmit} className="space-y-4 font-sans text-xs">
                    <div>
                      <label className="block text-neutral-600 uppercase tracking-wider mb-1">
                        Adınız Soyadınız *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Örn: Selin Yılmaz"
                        className="w-full px-3 py-2.5 border border-neutral-300 focus:border-neutral-900 focus:outline-none rounded-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-600 uppercase tracking-wider mb-1">
                          E-posta *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ornek@alanadi.com"
                          className="w-full px-3 py-2.5 border border-neutral-300 focus:border-neutral-900 focus:outline-none rounded-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-600 uppercase tracking-wider mb-1">
                          Telefon *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+90 5XX XXX XX XX"
                          className="w-full px-3 py-2.5 border border-neutral-300 focus:border-neutral-900 focus:outline-none rounded-none text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-600 uppercase tracking-wider mb-1">
                        Teslimat Şehri
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Örn: İstanbul / Beşiktaş"
                        className="w-full px-3 py-2.5 border border-neutral-300 focus:border-neutral-900 focus:outline-none rounded-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 uppercase tracking-wider mb-1">
                        Sanatçıya Not veya Özel Ölçü İsteği
                      </label>
                      <textarea
                        rows={3}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="Varsa yüzük ölçünüz veya teslimat notunuz..."
                        className="w-full px-3 py-2.5 border border-neutral-300 focus:border-neutral-900 focus:outline-none rounded-none text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-neutral-950 text-white font-sans text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                    >
                      {isSubmitting ? (
                        <span>İletiliyor...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Talebi Tamamla ({artwork.price})</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-neutral-400 text-center mt-2">
                      Bu işlem kartınızdan anında çekim yapmaz. Atölye yetkilisi onay ve ödeme bağlantısı ile sizinle iletişime geçer.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
