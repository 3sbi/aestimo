import "server-only";

import en from "./dictionaries/en.json";
import ru from "./dictionaries/ru.json";

export const i18nConfig = {
  defaultLocale: "en",
  locales: ["en", "ru"],
} as const;

export type I18nLocale = (typeof i18nConfig)["locales"][number];

const dictionaries = { ru, en };

export const getDictionary = (locale: string) => {
  if (locale in dictionaries) {
    return dictionaries[locale as keyof typeof dictionaries];
  }
  return dictionaries[i18nConfig.defaultLocale];
};

export const getLanguageNames = (): Record<string, string> => {
  const languageNames: Record<string, string> = {};
  for (const locale of i18nConfig.locales) {
    const dictionary = getDictionary(locale);
    languageNames[locale] = dictionary.language;
  }
  return languageNames;
};
