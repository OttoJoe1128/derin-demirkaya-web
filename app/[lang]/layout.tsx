import { isValidLocale, type Locale } from '@/lib/i18n-config';
import { getDictionary } from '@/lib/get-dictionary';
import AppLayoutShell from '@/components/AppLayoutShell';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export default async function LocalizedLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang.toLowerCase() as Locale) : 'tr';
  const dict = await getDictionary(locale);

  return (
    <AppLayoutShell lang={locale} dict={dict}>
      {children}
    </AppLayoutShell>
  );
}
