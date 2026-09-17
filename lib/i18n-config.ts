export type Locale = 'tr' | 'en';

export const i18nConfig = {
  defaultLocale: 'tr' as Locale,
  locales: ['tr', 'en'] as const,
};

export function isValidLocale(locale: string): locale is Locale {
  return (i18nConfig.locales as readonly string[]).includes(locale.toLowerCase());
}
