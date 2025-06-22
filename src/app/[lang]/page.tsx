import "server-only";

import { CreateRoomForm } from "@/components/widgets/CreateRoomForm/CreateRoomForm";
import { PublicRoomsList } from "@/components/widgets/PublicRoomsList";
import { getDictionary, I18nLocale } from "@/i18n/getDictionary";
import { PREDEFINED_VOTE_TYPES } from "@/server/consts/predefinedVoteTypes";
import { usersService } from "@/server/services";
import { getSession } from "@/server/session";
import type { Room, User } from "@/types";
import { cn } from "@/utils/cn";
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

  const i18n = getDictionary(lang).pages.home;
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
    <div className="m-auto card relative max-w-[500px] flex flex-col max-h-3/5">
      <div className="tabs">
        {Object.entries(i18n.tabs).map(([value, label]) => (
          <div className={cn("tab", value === tab ? "active" : "")} key={value}>
            <Link href={`?tab=${value}`}>{label}</Link>
          </div>
        ))}
      </div>
      {tab === "create" && (
        <CreateRoomForm
          i18n={i18n.createRoomForm}
          predefinedVoteTypes={PREDEFINED_VOTE_TYPES}
        />
      )}
      {tab === "join" && (
        <PublicRoomsList lang={lang} i18n={i18n.joinRoomForm} />
      )}
    </div>
  );
}
