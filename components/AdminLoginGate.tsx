'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, Sparkles, KeyRound, AlertCircle } from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';

interface AdminLoginGateProps {
  onSuccess: (user: { fullName: string; email: string; role: string }) => void;
}

export default function AdminLoginGate({ onSuccess }: AdminLoginGateProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Lütfen stüdyo erişim parolasını giriniz.');
      soundFx.playClick();
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    soundFx.playClick();

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        soundFx.playClick();
        setErrorMessage(data.error || 'Geçersiz parola. Erişim reddedildi.');
        setIsLoading(false);
        return;
      }

      soundFx.playSuccess();
      onSuccess(data.user);
    } catch (err) {
      console.error('Admin auth error:', err);
      soundFx.playClick();
      setErrorMessage('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  const handleQuickFill = (key: string) => {
    setPassword(key);
    soundFx.playHover();
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-neutral-200 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Arka Plan Atmosferik Işık & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f10_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ÜST BAR: Marka & Durum */}
      <header className="relative z-10 flex items-center justify-between border-b border-neutral-800/80 pb-6">
        <Link
          href="/"
          className="flex items-center gap-3 group text-neutral-400 hover:text-white transition-colors"
          onClick={() => soundFx.playClick()}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-neutral-300">
            nonvalue studio // 2026
          </span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          <span>CRYPTOGRAPHIC BARRIER // RESTRICTED</span>
        </div>
      </header>

      {/* MERKEZ: Brutalist Güvenli Giriş Kartı */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto py-12 max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#121212]/90 border border-neutral-800 p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative"
        >
          {/* Köşe Brutalist Aksanları */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-white" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-white" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-white" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-white" />

          {/* Logo / Mühür */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-full border border-neutral-700 bg-neutral-900/80 flex items-center justify-center mb-4 text-neutral-300">
              <Lock className="w-5 h-5 text-neutral-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-white">
              Studio Master
            </h1>
            <p className="font-mono text-[11px] text-neutral-400 tracking-wider mt-2 uppercase">
              Sanatçı Yönetim & CMS Girişi
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="admin-password"
                  className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase flex items-center gap-1.5"
                >
                  <KeyRound className="w-3 h-3 text-neutral-500" />
                  Erişim Anahtarı / Parola
                </label>
              </div>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoFocus
                  placeholder="••••••••••••"
                  className="w-full bg-[#181818] border border-neutral-700 text-white font-mono text-sm px-4 py-3.5 pr-11 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-neutral-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    soundFx.playClick();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                  tabIndex={-1}
                  aria-label="Şifreyi Göster/Gizle"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Hata Mesajı */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-800/80 text-red-300 font-mono text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-black font-mono text-xs font-semibold tracking-[0.2em] uppercase hover:bg-neutral-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Stüdyo Panelini Aç</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Stüdyo Hızlı Erişim İpuçları (Site Sahibine Kolaylık) */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-400">
            <div className="flex items-center gap-1.5 text-neutral-300 mb-2 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Stüdyo Anahtarları (Tıklayıp Doldurun):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('derinsem2026')}
                className="px-2.5 py-1 bg-neutral-900 border border-neutral-700/80 hover:border-neutral-400 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                derinsem2026
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('nonvalue2026!')}
                className="px-2.5 py-1 bg-neutral-900 border border-neutral-700/80 hover:border-neutral-400 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                nonvalue2026!
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ALT BAR: Güvenlik İmzası & Geri Dönüş */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800/80 pt-6 text-neutral-400 font-mono text-[10px] tracking-wider uppercase">
        <Link
          href="/"
          className="hover:text-white transition-colors flex items-center gap-1.5 text-neutral-300 hover:underline"
          onClick={() => soundFx.playClick()}
        >
          ← Vitrine Dön (Ana Sayfa)
        </Link>
        <div>
          PROTECTED BY AES-256 SESSION COOKIE // DERİN BUSE DEMİRKAYA
        </div>
      </footer>
    </div>
  );
}
