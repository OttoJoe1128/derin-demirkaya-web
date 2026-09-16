'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, Phone, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [receiveNews, setReceiveNews] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/profil');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg(language === 'TR' ? 'Lütfen zorunlu alanları doldurunuz.' : 'Please fill in required fields.');
      setIsSubmitting(false);
      return;
    }

    const res = await register(name, email, password, phone);
    setIsSubmitting(false);

    if (res.success) {
      router.push('/profil');
    } else {
      setErrorMsg(res.message || (language === 'TR' ? 'Kayıt başarısız oldu.' : 'Registration failed.'));
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f5f3ef] text-neutral-950 py-16 px-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-xl">

        {/* Üst Geri Dönüş Linki */}
        <div className="mb-6">
          <Link
            href="/"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'TR' ? 'Ana Sayfaya Dön' : 'Return Home'}</span>
          </Link>
        </div>

        {/* Ana Brutalist Kart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border-2 border-neutral-950 p-8 sm:p-10 shadow-[8px_8px_0px_#000]"
        >
          {/* Editoryal Başlık Şeridi */}
          <div className="border-b-2 border-neutral-950 pb-6 mb-8">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-neutral-500 mb-2">
              <span className="font-bold text-neutral-950">[ YENİ ÜYELİK ]</span>
              <span>KAYIT // 2026</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-tight text-neutral-950">
              {t('auth.createAccount')}
            </h1>
            <p className="mt-2 text-xs text-neutral-600 font-sans leading-relaxed">
              {t('auth.createAccountSub')}
            </p>
          </div>

          {/* Hata Bildirimi */}
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border border-red-900 text-red-900 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Kayıt Formu */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1.5">
                {t('auth.name')} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Deniz Kaya"
                  className="w-full bg-neutral-50 border border-neutral-950 px-4 py-3 pl-10 text-sm font-sans text-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  required
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1.5">
                {t('auth.email')} *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deniz@ornek.com"
                  className="w-full bg-neutral-50 border border-neutral-950 px-4 py-3 pl-10 text-sm font-sans text-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  required
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1.5">
                {t('auth.phone')}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 532 000 00 00"
                  className="w-full bg-neutral-50 border border-neutral-950 px-4 py-3 pl-10 text-sm font-sans text-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                />
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1.5">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 border border-neutral-950 px-4 py-3 pl-10 text-sm font-sans text-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  required
                />
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Tercih Onayı */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-700 select-none">
                <input
                  type="checkbox"
                  checked={receiveNews}
                  onChange={(e) => setReceiveNews(e.target.checked)}
                  className="mt-0.5 rounded-none border-neutral-950 text-neutral-950 focus:ring-0"
                />
                <span>
                  {language === 'TR'
                    ? 'Yeni döküm koleksiyonları ve sınırlı kontenjanlı atölye takvimlerinden öncelikli haberdar olmak istiyorum.'
                    : 'Receive priority announcements for new casting collections and limited workshop calendars.'}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onMouseEnter={() => soundFx.playHover()}
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest py-3.5 px-4 transition-all shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 mt-6"
            >
              <span>{isSubmitting ? '...' : t('auth.signUp')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Zaten Hesabı Olanlar İçin Giriş */}
          <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-xs font-sans text-neutral-600 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>{t('auth.haveAccount')}</span>
            <Link
              href="/giris"
              onClick={() => soundFx.playClick()}
              className="font-mono font-bold uppercase tracking-wider text-neutral-950 hover:underline inline-flex items-center gap-1"
            >
              <span>{t('auth.signIn')}</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
