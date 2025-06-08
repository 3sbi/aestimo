import "server-only";

import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { getLanguageNames, i18nConfig } from "@/i18n/get-dictionary";
import { LOCALE_HEADER_KEY } from "@/middleware";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
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
};

export default async function RootLayout(props: Readonly<Props>) {
  const headersList = await headers();
  const lang: string =
    headersList.get(LOCALE_HEADER_KEY) ?? i18nConfig.defaultLocale;

  return (
    <html
      lang={lang}
      className={`${geist.variable} antialiased`}
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
          <div className="flex flex-col gap-1 absolute left-2 bottom-2">
            <LocaleSwitcher
              i18nConfig={i18nConfig}
              languageNames={getLanguageNames()}
            />
            <ThemeSwitcher />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
