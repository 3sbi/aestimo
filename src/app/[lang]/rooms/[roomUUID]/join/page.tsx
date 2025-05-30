import "server-only";

import { getSession } from "@/backend/session";
import JoinRoomForm from "@/components/widgets/JoinRoomForm";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { Room, User } from "@/types";
import { redirect, RedirectType } from "next/navigation";
import { UserRepository } from "../../../../../backend/repositories";

type Props = {
  params: Promise<{ roomUUID: string; lang: I18nLocale }>;
};

export default async function Page(props: Props) {
  const { roomUUID, lang } = await props.params;
  const session = await getSession();
  if (session && session.roomUUID && session.userUUID) {
    const res = await UserRepository.getByUUID(session.userUUID);
    const user: User | undefined = res?.users;
    const room: Room | undefined | null = res?.rooms;

    if (session.userUUID === user?.uuid && session.roomUUID === room?.uuid) {
      redirect(`/rooms/${roomUUID}`, RedirectType.replace);
    }
  }

  const dictionary = getDictionary(lang);
  const i18n = dictionary.joinRoomForm;

  return (
    <div className="m-auto card w-[400px] h-[400px] flex flex-col">
      <JoinRoomForm i18n={i18n} roomUUID={roomUUID} />
    </div>
  );
}
