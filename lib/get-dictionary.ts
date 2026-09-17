import type { Locale } from './i18n-config';
import trDict from '@/dictionaries/tr.json';
import enDict from '@/dictionaries/en.json';

export type Dictionary = typeof trDict;

const dictionaries: Record<Locale, Dictionary> = {
  tr: trDict,
  en: enDict,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] || dictionaries.tr;
}

export function getDictionarySync(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.tr;
}
