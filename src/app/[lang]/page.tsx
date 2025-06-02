import "server-only";

import { PREDEFINED_VOTE_TYPES } from "@/backend/consts/predefinedVoteTypes";
import { usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { CreateRoomForm } from "@/components/widgets/CreateRoomForm";
import { PublicRoomsList } from "@/components/widgets/PublicRoomsList";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { Room, User } from "@/types";
import { redirect, RedirectType } from "next/navigation";

type Props = {
  params: Promise<{ lang: I18nLocale }>;
};

export default async function Home(props: Props) {
  const { lang } = await props.params;
  const i18n = getDictionary(lang);
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
    <div className="m-auto card relative w-[720px] flex flex-col">
      <div className="grid grid-cols-2">
        <div className="border-[var(--border)] border-r">
          <CreateRoomForm
            i18n={i18n.createRoomForm}
            predefinedVoteTypes={PREDEFINED_VOTE_TYPES}
          />
        </div>
        <PublicRoomsList lang={lang} i18n={i18n.joinList} />
      </div>
    </div>
  );
}
