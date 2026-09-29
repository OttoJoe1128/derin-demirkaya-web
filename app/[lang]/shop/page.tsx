import { isValidLocale, type Locale } from '@/lib/i18n-config';
import FramelessShopGrid from '@/components/FramelessShopGrid';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn
      ? "nonvalue • Shop — Derin Buse Demirkaya"
      : "nonvalue • Mağaza — Derin Buse Demirkaya",
    description: isEn
      ? "Silent exhibition gallery of bespoke contemporary jewelry and molten silver objects."
      : "Süreç odaklı çağdaş takı, mekansal heykel ve erimiş gümüş nesneler sergisi.",
  };
}

export default async function LocalizedShopPage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang.toLowerCase() as Locale) : 'tr';

  return <FramelessShopGrid lang={locale} />;
}
