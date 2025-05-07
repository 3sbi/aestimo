import "server-only";
import en from "./dictionaries/en.json";
import ru from "./dictionaries/ru.json";

export const i18nConfig = {
  defaultLocale: "en",
  locales: ["en", "ru"],
} as const;

export type i18nLocale = (typeof i18nConfig)["locales"][number];

const dictionaries = { ru, en };

export const getDictionary = (locale: string) => {
  if (locale in dictionaries) {
    return dictionaries[locale as keyof typeof dictionaries];
  }
  return dictionaries[i18nConfig.defaultLocale];
};
