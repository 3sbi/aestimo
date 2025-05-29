import "server-only";

import { ColorSchemeSwitcher } from "@/components/ColorSchemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import {
  getLanguageNames,
  i18nConfig,
  I18nLocale,
} from "@/i18n/get-dictionary";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "planpoker.net",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: I18nLocale }>;
};

export default async function RootLayout(props: Readonly<Props>) {
  const { lang } = await props.params;
  return (
    <html
      lang={lang ?? i18nConfig.defaultLocale}
      className={`${geistSans.variable} antialiased`}
    >
      <body>
        {props.children}
        <div className="flex gap-1 absolute right-0 bottom-0">
          <LocaleSwitcher
            i18nConfig={i18nConfig}
            languageNames={getLanguageNames()}
          />
          <ColorSchemeSwitcher />
        </div>
      </body>
    </html>
  );
}
