import type { Metadata } from "next";
import { getDictionary } from "@/lib/get-dictionary";
import { isValidLocale, type Locale } from "@/lib/i18n-config";
import EditorialMagazinePage from "@/components/EditorialMagazinePage";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  return {
    title: isEn
      ? "Derin Demirkaya — nonvalue jewel | Contemporary Jewelry Archive"
      : "Derin Demirkaya — nonvalue jewel | Çağdaş Takı ve Heykel Arşivi",
    description: isEn
      ? "nonvalue • contemporary jewelry, spatial objects, and metallurgical archive by Derin Buse Demirkaya. Hand-forged silver, lost-wax casting, and situational craft."
      : "nonvalue • süreç odaklı çağdaş takı, mekansal heykel ve eskiz arşivi. Ateşin dönüştürücü gücüyle şekillenen 2018–2026 eserleri.",
  };
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang.toLowerCase() as Locale) : "tr";
  const dict = await getDictionary(locale);

  return <EditorialMagazinePage lang={locale} dict={dict} />;
}
