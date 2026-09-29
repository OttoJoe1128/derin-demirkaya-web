import type { Metadata } from 'next';
import ArchiveCanvasView from '@/components/ArchiveCanvasView';
import { isValidLocale, type Locale } from '@/lib/i18n-config';

interface Props {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: "Sinematik Arşiv — Derin Buse Demirkaya | nonvalue jewel",
  description: "Ateşin dönüştürücü gücüyle şekillenen uzamsal nesne ve heykelsi takı arşivi.",
};

export default async function LocalizedArchivePage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang.toLowerCase() as Locale) : 'tr';

  return <ArchiveCanvasView lang={locale} />;
}
