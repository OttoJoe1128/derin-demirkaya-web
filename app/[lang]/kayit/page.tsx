'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LocalizedKayitPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await register(name, email, password, phone);
    if (res.success) {
      router.push('/profil');
    } else {
      setErrorMsg(res.message || 'Kayıt oluşturulamadı.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 flex items-center justify-center px-4 pt-16 pb-20">
      <div className="w-full max-w-md border border-neutral-800 bg-neutral-950/90 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] text-amber-400 tracking-[0.3em] uppercase">
            MEMBERSHIP // REGISTRATION
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
          Koleksiyoner Kaydı
        </h1>
        <p className="font-mono text-xs text-neutral-400 mb-6">
          Sınırlı edisyon heykelsi takılar ve atölye öncelikleri için kulübe katılın.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 border border-red-500/40 bg-red-950/30 text-red-400 font-mono text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Derin Demirkaya"
                className="w-full bg-neutral-900 border border-neutral-800 py-2.5 pl-10 pr-3 font-mono text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
              E-Posta Adresi
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="koleksiyoner@nonvalue.com"
                className="w-full bg-neutral-900 border border-neutral-800 py-2.5 pl-10 pr-3 font-mono text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
              Telefon (Opsiyonel)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 5XX XXX XX XX"
                className="w-full bg-neutral-900 border border-neutral-800 py-2.5 pl-10 pr-3 font-mono text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
              Parola (En az 6 karakter)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-neutral-800 py-2.5 pl-10 pr-3 font-mono text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-neutral-200 text-black py-3 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
          >
            <span>{isLoading ? 'Kaydediliyor...' : 'Üyeliği Başlat'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-800 text-center font-mono text-xs text-neutral-500">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="text-white hover:underline">
            Giriş Yapın
          </Link>
        </div>
      </div>
    </div>
  );
}
