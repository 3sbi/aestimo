import "server-only";

import { i18nConfig, I18nLocale } from "@/i18n/get-dictionary";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
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
      className={`${geist.variable} antialiased`}
    >
      <body>{props.children}</body>
    </html>
  );
}
