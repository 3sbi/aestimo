import "server-only";

import {
  getDictionary,
  i18nConfig
} from "@/i18n/getDictionary";
import { LOCALE_HEADER_KEY } from "@/proxy";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Roboto } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const lang: string =
    headersList.get(LOCALE_HEADER_KEY) ?? i18nConfig.defaultLocale;
  const dictionary = getDictionary(lang);

  return {
    title: {
      template: "%s | Aestimo",
      default: "Aestimo",
    },
    description: dictionary.metadata.description,
  };
}

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout(props: Readonly<Props>) {
  const headersList = await headers();
  const lang: string =
    headersList.get(LOCALE_HEADER_KEY) ?? i18nConfig.defaultLocale;

  return (
    <html
      lang={lang}
      className={`${roboto.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="theme"
          enableSystem={true}
          themes={["light", "dark"]}
        >
          {props.children}
        </ThemeProvider>
      </body>
    </html>
  );
}
