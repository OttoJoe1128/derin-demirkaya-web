import type { Metadata } from 'next';
import WorkshopCalendarView from '@/components/WorkshopCalendarView';
import { isValidLocale, type Locale } from '@/lib/i18n-config';

interface Props {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: "Atölye & Pratik — Derin Buse Demirkaya | nonvalue jewel",
  description: "Kayıp mum döküm, sır kimyası, porselen torna ve felsefi heykel zanaatı üzerine stüdyo pratikleri ve rezervasyon.",
};

export default async function LocalizedAtolyePage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang.toLowerCase() as Locale) : 'tr';

  return <WorkshopCalendarView lang={locale} />;
}
