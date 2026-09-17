import { isValidLocale, type Locale } from '@/lib/i18n-config';
import { getDictionary } from '@/lib/get-dictionary';
import CollectionPageClient from '@/components/CollectionPageClient';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn
      ? "nonvalue • archive & collection — Derin Buse Demirkaya"
      : "nonvalue • arşiv & koleksiyon — Derin Buse Demirkaya",
    description: isEn
      ? "Process-based contemporary jewelry, spatial sculptures, and sketch archive (2018–2026)."
      : "Süreç odaklı çağdaş takı, mekansal heykel ve eskiz arşivi. Ateşin dönüştürücü gücüyle şekillenen 2018–2026 eserleri.",
  };
}

export default async function LocalizedCollectionPage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang.toLowerCase() as Locale) : 'tr';
  const dict = await getDictionary(locale);

  return <CollectionPageClient lang={locale} dict={dict} />;
}
