'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, Check } from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';

export default function LocalizedIletisimPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'Özel Sipariş / Komisyon', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 pt-20 sm:pt-28 pb-24 px-4 sm:px-8 max-w-5xl mx-auto">
      <header className="border-b border-neutral-800 pb-8 mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] sm:text-[10px] text-amber-400 tracking-[0.3em] uppercase">
            CONTACT // ATELIER VISITS
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase font-light">
          İletişim & Stüdyo
        </h1>
        <p className="mt-3 font-mono text-xs sm:text-sm text-neutral-400">
          Özel sipariş, heykelsi komisyonlar veya randevulu Karaköy stüdyo ziyaretleri için.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
        {/* Contact info */}
        <div className="md:col-span-5 space-y-8 font-mono text-xs text-neutral-400">
          <div>
            <span className="text-[10px] uppercase text-neutral-500 tracking-widest block mb-2">
              Atölye Lokasyonu
            </span>
            <div className="flex items-start gap-2.5 text-neutral-200">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">nonvalue studio</p>
                <p>Karaköy / Galata Zanaatkârlar Bölgesi</p>
                <p>İstanbul & İzmir, Türkiye</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-neutral-500 tracking-widest block mb-2">
              Doğrudan Yazışma
            </span>
            <div className="flex items-center gap-2.5 text-neutral-200">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="mailto:nonvaluejewel@gmail.com" className="text-white hover:text-amber-400 transition-colors">
                nonvaluejewel@gmail.com
              </a>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-neutral-500 tracking-widest block mb-2">
              Instagram Arşivi
            </span>
            <a
              href="https://instagram.com/nonvalue_jewel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-amber-400 transition-colors inline-block"
            >
              @nonvalue_jewel ↗
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-7 border border-neutral-800 bg-neutral-950/80 p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl text-white uppercase">Mesajınız İletildi</h2>
              <p className="font-mono text-xs text-neutral-400 max-w-sm mx-auto">
                Stüdyomuz en kısa sürede sizinle temasa geçecektir. Teşekkür ederiz.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  Adınız & Soyadınız
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="İsim"
                  className="w-full bg-neutral-900 border border-neutral-800 py-2.5 px-3 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  E-Posta Adresiniz
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="eposta@adresiniz.com"
                  className="w-full bg-neutral-900 border border-neutral-800 py-2.5 px-3 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  Konu
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 py-2.5 px-3 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Özel Sipariş / Komisyon">Özel Sipariş / Komisyon</option>
                  <option value="Stüdyo Randevusu">Stüdyo Randevusu</option>
                  <option value="Basın & Galeri İşbirliği">Basın & Galeri İşbirliği</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  Mesajınız
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Talebinizi detaylandırın..."
                  className="w-full bg-neutral-900 border border-neutral-800 py-2.5 px-3 font-mono text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-neutral-200 text-black py-3 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
              >
                <span>Gönder</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
