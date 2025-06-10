import "server-only";

import { PREDEFINED_VOTE_TYPES } from "@/backend/consts/predefinedVoteTypes";
import { usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { CreateRoomForm } from "@/components/widgets/CreateRoomForm/CreateRoomForm";
import { PublicRoomsList } from "@/components/widgets/PublicRoomsList";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { Room, User } from "@/types";
import { redirect, RedirectType } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/cn";

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
  const { userUUID, roomUUID } = session;

  if (roomUUID && userUUID) {
    async function getData(
      roomUUID: string,
      userUUID: string
    ): Promise<{ user?: User; room?: Room }> {
      try {
        const result = await usersService.checkIfUserExistsInRoom(
          roomUUID,
          userUUID
        );
        return result;
      } catch (err) {
        console.error(err);
        return {};
      }
    }
    const { user, room } = await getData(roomUUID, userUUID);
    if (user && room) {
      redirect(`/${lang}/rooms/${roomUUID}`, RedirectType.replace);
    }
  }

  return (
    <div className="m-auto card relative max-w-[500px] flex flex-col">
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
