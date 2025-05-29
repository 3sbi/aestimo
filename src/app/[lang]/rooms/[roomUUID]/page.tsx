import "server-only";

import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { RoomWrapper } from "./_components/RoomWrapper";

type Props = {
  params: Promise<{ roomUUID: string }>;
};

export default async function Page({ params }: Props) {
  const { roomUUID } = await params;
  const cookieStore = await cookies();
  const session = await getSession();

  // TODO: add middleware for setting lang value
  const lang: I18nLocale = cookieStore.get("lang")?.value as I18nLocale;
  const dictionary = getDictionary(lang);

  const { userUUID } = session;
  if (!userUUID) {
    const room = await roomsService.getOne(roomUUID);
    if (!room) return notFound();
    redirect(`/rooms/${roomUUID}/join`);
  }

  const { user, room } = await usersService.checkIfUserExistsInRoom(
    roomUUID,
    userUUID
  );
  if (!room) return notFound();
  if (!user) redirect(`/rooms/${roomUUID}/join`);

  const { values } = await roomsService.getVoteTypes(roomUUID);
  const usersList = await roomsService.getUsers(room.id, room.round);
  const index = await usersService.getVoteIndex(user.id, room.id, room.round);

  return (
    <RoomWrapper
      initialRoom={room}
      initialUsersList={usersList}
      cards={values}
      user={{ id: user.id, role: user.role }}
      i18n={dictionary.room}
      initialSelectedIndex={index}
    />
  );
}
