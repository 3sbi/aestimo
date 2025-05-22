import "server-only";

import { RoomsService } from "@/database/services";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";
import CardsHand from "./_components/CardsHand";
import Toolbar from "./_components/Toolbar";
import UsersList from "./_components/UsersList";

type Props = {
  params: Promise<{ lang: string; roomUUID: string }>;
};

export default async function Page({ params }: Props) {
  const { lang, roomUUID } = await params;
  const room = await RoomsService.getOne(roomUUID);
  const dictionary = getDictionary(lang);

  if (!room) return notFound();

  const cards = await RoomsService.getVoteTypes(room.id);
  return (
    <>
      <UsersList roomId={room.id} votingRound={room.votingRound} />
      <CardsHand cards={cards.values} roomId={room.id} />
      <Toolbar i18n={dictionary.room.toolbar} />
    </>
  );
}
