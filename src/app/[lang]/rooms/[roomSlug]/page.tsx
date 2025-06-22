import "server-only";

import type { I18nLocale } from "@/i18n/getDictionary";
import { getDictionary } from "@/i18n/getDictionary";
import { roomsService, usersService } from "@/server/services";
import { getSession } from "@/server/session";
import type { ClientUser, ClientVote, Room, User, Vote } from "@/types";
import { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import { RoomWrapper } from "./_components/RoomWrapper";

type Props = {
  params: Promise<{ roomSlug: string; lang: I18nLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomSlug } = await params;
  const room = await roomsService.getOne(roomSlug);

  return { title: room.name };
}

export default async function Page({ params }: Props) {
  const { roomSlug, lang } = await params;
  const session = await getSession();
  const { userId } = session;

  if (!userId) {
    redirect(`/${lang}`, RedirectType.replace);
  }

  async function getData(
    userId: number
  ): Promise<{ user?: User; room?: Room }> {
    try {
      const result = await usersService.checkIfUserExistsInRoom(
        roomSlug,
        userId
      );
      return result;
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  const { user, room } = await getData(userId);

  if (!room) {
    return notFound();
  }

  if (!user) {
    redirect(`/rooms/${roomSlug}/join`, RedirectType.replace);
  }

  const voteOptions = await roomsService.getVoteTypes(roomSlug);
  const showVotes: boolean = room.status === "finished";
  const usersList: ClientUser[] = await roomsService.getUsers(
    room.id,
    room.round,
    showVotes
  );

  const votesHistory: Record<Vote["round"], ClientVote[]> =
    await roomsService.getVotesHistory(room.id, room.round);
  const index = await usersService.getVoteIndex(user.id, room.id, room.round);

  const i18n = getDictionary(lang).pages.room;
  return (
    <>
      <RoomWrapper
        i18n={i18n}
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
