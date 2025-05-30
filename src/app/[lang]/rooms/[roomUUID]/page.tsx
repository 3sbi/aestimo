import "server-only";

import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { cookies } from "next/headers";
import { notFound, redirect, RedirectType } from "next/navigation";
import { RoomWrapper } from "./_components/RoomWrapper";
import { ClientUser } from "@/types";

type Props = {
  params: Promise<{ roomUUID: string }>;
};

export default async function Page({ params }: Props) {
  const { roomUUID } = await params;
  const cookieStore = await cookies();
  const session = await getSession();

  const lang: I18nLocale = cookieStore.get("lang")?.value as I18nLocale;
  const dictionary = getDictionary(lang);

  const { userUUID } = session;
  const { user, room } = await usersService.checkIfUserExistsInRoom(
    roomUUID,
    userUUID
  );
  if (!room) return notFound();
  if (!user) redirect(`/rooms/${roomUUID}/join`, RedirectType.replace);

  const { values } = await roomsService.getVoteTypes(roomUUID);
  let usersList: ClientUser[] = await roomsService.getUsers(
    room.id,
    room.round
  );
  const index = await usersService.getVoteIndex(user.id, room.id, room.round);

  if (room.status === "finished") {
    const votes = await roomsService.getVotes(room.id, room.round);
    usersList = usersList.map((user) => {
      const vote = votes.find((vote) => vote.userId === user.id)?.vote;
      return { ...user, vote, voted: true };
    });
  }

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
