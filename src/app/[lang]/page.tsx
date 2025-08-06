import "server-only";

import { Button } from "@/components/Button";
import { GithubButton } from "@/components/GithubButton";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import type { I18nLocale } from "@/i18n/getDictionary";
import {
  getDictionary,
  getLanguageNames,
  i18nConfig,
} from "@/i18n/getDictionary";
import { usersService } from "@/server/services";
import { getSession } from "@/server/session";
import type { Room, User } from "@/types";
import { LinkIcon, RocketIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

type SearchParams = { [key: string]: string | string[] | undefined };

type Props = {
  params: Promise<{ lang: I18nLocale }>;
  searchParams: Promise<SearchParams>;
};

export default async function Home(props: Props) {
  const { lang } = await props.params;

  let { tab } = await props.searchParams;
  if (tab !== "create" && tab !== "join") {
    tab = "create";
  }

  const i18n = getDictionary(lang);
  const session = await getSession();
  const { userId, roomSlug } = session;

  if (roomSlug && userId) {
    async function getData(
      roomSlug: string,
      userId: number
    ): Promise<{ user?: User; room?: Room }> {
      try {
        const result = await usersService.checkIfUserExistsInRoom(
          roomSlug,
          userId
        );
        return result;
      } catch (err) {
        console.error(err);
        return {};
      }
    }
    const { user, room } = await getData(roomSlug, userId);
    if (user && room) {
      redirect(`/${lang}/rooms/${roomSlug}`, RedirectType.replace);
    }
  }

  return (
    <div className="flex flex-col h-full grow">
      <header className="flex gap-2 py-2 px-4 justify-between">
        <Link href={`/${lang}`} className="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            stroke="#1a1d23"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              strokeWidth="0"
              x="0"
              y="0"
              width="28"
              height="28"
              rx="8"
              ry="8"
              fill="#35975c"
            />
            <g transform="translate(2,2)">
              <path d="M19 2v3h3" />
              <path d="M13.4 10.6 22 2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M12.3 6H12a6 6 0 1 0 6 6v-.3" />
              <path d="M15 2.5A9.93 9.93 0 1 0 21.5 9" />
            </g>
          </svg>
          <div className="text-2xl">Aestimo</div>
        </Link>
        <div className="flex gap-2 items-center">
          <LocaleSwitcher
            i18nConfig={i18nConfig}
            languageNames={getLanguageNames()}
            title={i18n.pages.room.settings.language}
          />
          <ThemeSwitcher title={i18n.pages.room.settings.theme} />
          <GithubButton />
        </div>
      </header>
      <section className="grow w-full flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-4">
              {i18n.pages.home.header}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6">
              {i18n.pages.home.subheader}
            </p>

            <ul className="space-y-3 text-base md:text-lg text-foreground mb-8">
              {i18n.pages.home.advantages.map((advantage) => (
                <li key={advantage} className="flex items-center gap-2">
                  {advantage}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/new?tab=create">
                <Button variant="primary">
                  <RocketIcon />
                  {i18n.pages.home.buttons.new}
                </Button>
              </Link>
              <Link href="/new?tab=join">
                <Button variant="secondary">
                  <LinkIcon />
                  {i18n.pages.home.buttons.join}
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <Image
              src="/room.webp"
              alt="room"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
