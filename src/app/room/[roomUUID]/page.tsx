import "server-only";

import { i18nConfig } from "@/i18n/get-dictionary";
import { Rooms } from "@/services";
import { notFound } from "next/navigation";
import CardsHand from "./_components/CardsHand";
import Toolbar from "./_components/Toolbar";
import UsersList from "./_components/UsersList";

type Props = {
  params: Promise<{ roomUUID: string }>;
};

export default async function Page({ params }: Props) {
  const { roomUUID } = await params;
  const room = await Rooms.getOne(roomUUID);
  if (!room) return notFound();

  const cards = await Rooms.getVoteTypes(room.id);
  return (
    <>
      <UsersList roomId={room.id} votingRound={room.votingRound} />
      <CardsHand cards={cards.values} />
      <Toolbar locale={i18nConfig.defaultLocale} />
    </>
  );
}
