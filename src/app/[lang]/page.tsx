import "server-only";

import { usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import CreateRoomForm from "@/components/widgets/CreateRoomForm";
import {
  getDictionary,
  getLanguageNames,
  i18nConfig,
  I18nLocale,
} from "@/i18n/get-dictionary";
import { redirect, RedirectType } from "next/navigation";
import { PREDEFINED_VOTE_TYPES } from "../../backend/consts/predefinedVoteTypes";

type Props = {
  params: Promise<{ lang: I18nLocale }>;
};

export default async function Home(props: Props) {
  const { lang } = await props.params;
  const i18n = getDictionary(lang);
  const session = await getSession();
  const { userUUID, roomUUID } = session;

  if (roomUUID && userUUID) {
    const { user, room } = await usersService.checkIfUserExistsInRoom(
      roomUUID,
      userUUID
    );

    if (user && room) {
      redirect(`/${lang}/rooms/${roomUUID}`, RedirectType.replace);
    }
  }

  return (
    <div className="m-auto card w-[400px] h-[400px] flex flex-col">
      <CreateRoomForm
        i18n={i18n.createRoomForm}
        predefinedVoteTypes={PREDEFINED_VOTE_TYPES}
      />
      <div className="flex gap-1 absolute right-2 bottom-2">
        <LocaleSwitcher
          i18nConfig={i18nConfig}
          languageNames={getLanguageNames()}
        />
      </div>
    </div>
  );
}
