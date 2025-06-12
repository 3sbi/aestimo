import "server-only";

import { UserRepository } from "@/backend/repositories";
import { getSession } from "@/backend/session";
import { JoinRoomForm } from "@/components/widgets/JoinRoomForm";
import { getDictionary, I18nLocale } from "@/i18n/getDictionary";
import { Room, User } from "@/types";
import { notFound, redirect, RedirectType } from "next/navigation";

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

    if (room?.private) {
      return notFound();
    }

    if (
      session.userUUID === user?.uuid &&
      roomUUID === session.roomUUID &&
      roomUUID === room?.uuid
    ) {
      redirect(`/rooms/${roomUUID}`, RedirectType.replace);
    }
  }

  const dictionary = getDictionary(lang);
  const i18n = dictionary.pages.home.joinRoomForm;

  return (
    <div className="m-auto card w-[420px] flex flex-col">
      <div className="px-6 py-3">
        <h1 className="text-center font-semibold text-xl">{i18n.header}</h1>
      </div>
      <hr className="w-full" />
      <JoinRoomForm i18n={i18n} roomUUID={roomUUID} />
    </div>
  );
}
