'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, KeyRound, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zaten giriş yapılmışsa profil sayfasına yönlendir
  if (isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/profil');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (!email || !password) {
      setErrorMsg(language === 'TR' ? 'Lütfen tüm alanları doldurunuz.' : 'Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push('/profil');
    } else {
      setErrorMsg(res.message || (language === 'TR' ? 'Giriş yapılamadı.' : 'Login failed.'));
    }
  };

  const handleDemoLogin = () => {
    demoLogin();
    router.push('/profil');
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
              <span className="font-bold text-neutral-950">[ PORTAL GİRİŞİ ]</span>
              <span>REF: AUTH-2026</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-tight text-neutral-950">
              {t('auth.welcomeBack')}
            </h1>
            <p className="mt-2 text-xs text-neutral-600 font-sans leading-relaxed">
              {t('auth.welcomeBackSub')}
            </p>
          </div>

          {/* TEK TIKLA DEMO KOLEKSİYONER GİRİŞİ (Önerilen Hızlı Erişim) */}
          <div className="mb-8 p-5 bg-neutral-100 border border-neutral-950 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase bg-neutral-950 text-amber-300 px-2 py-0.5 mb-2">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {language === 'TR' ? 'HIZLI ÖNİZLEME' : 'QUICK ACCESS'}
                </span>
                <p className="text-xs text-neutral-800 font-medium">
                  {language === 'TR'
                    ? 'Atölye biletlerini ve koleksiyon arşivini doğrudan deneyimlemek için tek tıkla demo hesabına bağlanın.'
                    : 'Instant 1-click access to explore active workshop passes and collection curation.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              onMouseEnter={() => soundFx.playHover()}
              className="mt-4 w-full bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest py-3 px-4 flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_#666] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('auth.quickDemo')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] bg-neutral-300 flex-grow" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              {language === 'TR' ? 'VEYA E-POSTA İLE' : 'OR VIA EMAIL'}
            </span>
            <div className="h-[1px] bg-neutral-300 flex-grow" />
          </div>

          {/* Hata Bildirimi */}
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border border-red-900 text-red-900 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Giriş Formu */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@koleksiyoner.com"
                  className="w-full bg-neutral-50 border border-neutral-950 px-4 py-3 pl-10 text-sm font-sans text-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  required
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700">
                  {t('auth.password')}
                </label>
                <button
                  type="button"
                  onClick={() => soundFx.playClick()}
                  className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-950"
                >
                  {language === 'TR' ? 'Şifremi Unuttum' : 'Forgot Password?'}
                </button>
              </div>
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

            <button
              type="submit"
              disabled={isSubmitting}
              onMouseEnter={() => soundFx.playHover()}
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest py-3.5 px-4 transition-all shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 mt-4"
            >
              <span>{isSubmitting ? '...' : t('auth.signIn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Alt Kayıt Ol Yönlendirmesi */}
          <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-xs font-sans text-neutral-600 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>{t('auth.noAccount')}</span>
            <Link
              href="/kayit"
              onClick={() => soundFx.playClick()}
              className="font-mono font-bold uppercase tracking-wider text-neutral-950 hover:underline inline-flex items-center gap-1"
            >
              <span>{t('auth.signUp')}</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
