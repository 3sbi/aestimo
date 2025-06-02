import "server-only";

import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import type { I18nLocale } from "@/i18n/get-dictionary";
import { getDictionary } from "@/i18n/get-dictionary";
import { ClientUser, ClientVote, Room, User, Vote } from "@/types";
import { notFound, redirect, RedirectType } from "next/navigation";
import { RoomWrapper } from "./_components/RoomWrapper";

type Props = {
  params: Promise<{ roomUUID: string; lang: I18nLocale }>;
};

export default async function Page({ params }: Props) {
  const { roomUUID, lang } = await params;
  const session = await getSession();
  const { userUUID } = session;

  if (!userUUID) {
    redirect(`/${lang}`, RedirectType.replace);
  }

  async function getData(
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

  const { user, room } = await getData(userUUID);

  if (!room) {
    return notFound();
  }

  if (!user) {
    redirect(`/rooms/${roomUUID}/join`, RedirectType.replace);
  }

  const voteOptions = await roomsService.getVoteTypes(roomUUID);
  const showVotes: boolean = room.status === "finished";
  const usersList: ClientUser[] = await roomsService.getUsers(
    room.id,
    room.round,
    showVotes
  );
  const votesHistory: Record<Vote["round"], ClientVote[]> =
    await roomsService.getVotesHistory(room.id, room.round);
  const index = await usersService.getVoteIndex(user.id, room.id, room.round);

  const dictionary = getDictionary(lang);
  return (
    <>
      <RoomWrapper
        i18n={dictionary.room}
        user={{ id: user.id, role: user.role }}
        voteOptions={voteOptions}
        initialRoom={room}
        initialUsersList={usersList}
        initialSelectedIndex={index}
        initialVotesHistory={votesHistory}
      />
    </>
  );
}
