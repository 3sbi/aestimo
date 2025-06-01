import "server-only";

import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import type { I18nLocale } from "@/i18n/get-dictionary";
import {
  getDictionary
} from "@/i18n/get-dictionary";
import { ClientUser, Room, User } from "@/types";
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
      return usersService.checkIfUserExistsInRoom(roomUUID, userUUID);
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
  const index = await usersService.getVoteIndex(user.id, room.id, room.round);

  const dictionary = getDictionary(lang);
  return (
    <>
      <RoomWrapper
        initialRoom={room}
        initialUsersList={usersList}
        voteOptions={voteOptions}
        user={{ id: user.id, role: user.role }}
        i18n={dictionary.room}
        initialSelectedIndex={index}
      />
    </>
  );
}
