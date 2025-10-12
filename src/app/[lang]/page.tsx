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
      <header className="flex gap-2 p-4 justify-between items-center m-auto w-full xl:max-w-6xl">
        <Link href={`/${lang}`} className="flex gap-2 items-center">
          <Image src="./icon.svg" alt="icon" width={32} height={32} />
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
      <section className="grow w-full flex flex-col items-center justify-center px-6 py-16 xl:max-w-6xl m-auto">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-4">
              {i18n.pages.home.header}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6">
              {i18n.pages.home.subheader}
            </p>

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
              width={550}
              height={458}
              alt="room"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
