import "server-only";

import JoinRoomForm from "@/components/widgets/JoinRoomForm";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { cookies } from "next/headers";
import { getSession } from "@/backend/session";
import { usersService } from "@/backend/services";

type Props = {
  params: Promise<{ roomUUID: string }>;
};

export default async function Page(props: Props) {
  const { roomUUID } = await props.params;
  const session = await getSession();

  const user = await usersService.getOne(session.userUUID);
  if (user && session.roomUUID === roomUUID) {
  }

  const cookieStore = await cookies();
  const lang: I18nLocale = cookieStore.get("lang")?.value as I18nLocale;

  const dictionary = getDictionary(lang);
  const i18n = dictionary.joinRoomForm;

  return (
    <div className="m-auto card w-[400px] h-[400px] flex flex-col">
      <JoinRoomForm i18n={i18n} roomUUID={roomUUID} />
    </div>
  );
}
