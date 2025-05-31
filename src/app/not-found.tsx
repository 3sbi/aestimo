import "server-only";

import { getDictionary, i18nConfig, I18nLocale } from "@/i18n/get-dictionary";
import { LOCALE_HEADER_KEY } from "@/middleware";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/Button";

export default async function ErrorPage() {
  const getLocale = async (): Promise<I18nLocale> => {
    // https://github.com/vercel/next.js/discussions/43179
    const headersList = await headers();
    const locale = headersList.get(LOCALE_HEADER_KEY);

    if (locale && i18nConfig.locales.includes(locale as I18nLocale)) {
      return locale as I18nLocale;
    }
    return i18nConfig.defaultLocale;
  };
  const lang = await getLocale();
  const i18n = getDictionary(lang)["not-found"];
  return (
    <div className="flex flex-col items-center justify-center grow gap-4">
      <h1 className="font-bold text-2xl">404 - {i18n.header}</h1>
      <Link href={`/${lang}`}>
        <Button>{i18n.button}</Button>
      </Link>
    </div>
  );
}
