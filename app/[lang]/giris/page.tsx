'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LocalizedGirisPage() {
  const router = useRouter();
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await login(email, password);
    if (res.success) {
      router.push('/profil');
    } else {
      setErrorMsg(res.message || 'Giriş yapılamadı.');
    }
  };

  const handleDemo = () => {
    demoLogin();
    router.push('/profil');
  };

  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 flex items-center justify-center px-4 pt-16 pb-20">
      <div className="w-full max-w-md border border-neutral-800 bg-neutral-950/90 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] text-amber-400 tracking-[0.3em] uppercase">
            COLLECTOR VAULT // ACCESS
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
          Koleksiyoner Girişi
        </h1>
        <p className="font-mono text-xs text-neutral-400 mb-6">
          Atölye kayıtlarınız, edisyon sertifikalarınız ve özel arşiv erişiminiz için oturum açın.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 border border-red-500/40 bg-red-950/30 text-red-400 font-mono text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              Parola
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
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
            <span>{isLoading ? 'Doğrulanıyor...' : 'Oturum Aç'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-800 space-y-3">
          <button
            type="button"
            onClick={handleDemo}
            className="w-full border border-neutral-700 hover:border-amber-400/80 bg-neutral-900/60 py-2.5 font-mono text-[10px] uppercase text-amber-300 tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hızlı Demo Koleksiyoner Hesabı</span>
          </button>

          <div className="text-center font-mono text-xs text-neutral-500">
            Hesabınız yok mu?{' '}
            <Link href="/kayit" className="text-white hover:underline">
              Kayıt Olun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
