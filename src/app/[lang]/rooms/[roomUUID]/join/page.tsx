import "server-only";

import { UserRepository } from "@/backend/repositories";
import { getSession } from "@/backend/session";
import { Room, User } from "@/backend/types";
import JoinRoomForm from "@/components/widgets/JoinRoomForm";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

type Props = {
  params: Promise<{ roomUUID: string }>;
};

export default async function Page(props: Props) {
  const { roomUUID } = await props.params;
  const session = await getSession();
  const res = await UserRepository.getByUUID(session.userUUID);
  const user: User | undefined = res?.users;
  const room: Room | undefined | null = res?.rooms;

  if (session.userUUID === user?.uuid && session.roomUUID === room?.uuid) {
    redirect(`/rooms/${roomUUID}`, RedirectType.replace);
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
