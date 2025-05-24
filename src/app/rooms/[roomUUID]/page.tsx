import "server-only";

import { getDictionary, I18nLocale } from "@/i18n/get-dictionary";
import { RoomsService, UsersService } from "@/server/services";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import CardsHand from "./_components/CardsHand";
import Toolbar from "./_components/Toolbar";
import UsersList from "./_components/UsersList";

type Props = {
  params: Promise<{ roomUUID: string }>;
};

export default async function Page({ params }: Props) {
  const cookieStore = await cookies();
  const { roomUUID } = await params;

  // TODO: add middleware for setting lang value
  const lang: I18nLocale = cookieStore.get("lang")?.value as I18nLocale;
  const dictionary = getDictionary(lang);

  const userUUID = cookieStore.get("user-uuid")?.value;
  if (!userUUID) {
    const room = await RoomsService.getOne(roomUUID);
    if (!room) return notFound();
    redirect(`/rooms/${roomUUID}/join`);
  }

  const { user, room } = await UsersService.checkIfUserExistsInRoom(
    roomUUID,
    userUUID
  );
  if (!room) return notFound();
  if (!user) redirect(`/rooms/${roomUUID}/join`);

  const cards = await RoomsService.getVoteTypes(room.id);
  return (
    <>
      <UsersList roomId={room.id} votingRound={room.round} />
      <CardsHand cards={cards.values} />
      <Toolbar i18n={dictionary.room.toolbar} />
    </>
  );
}
