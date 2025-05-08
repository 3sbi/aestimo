import "server-only";

import Toolbar from "@/app/room/[roomUUID]/_components/Toolbar";
import CardsHand from "./_components/CardsHand";
import UsersList from "./_components/UsersList";
import { Rooms } from "@/database";
import { notFound } from "next/navigation";

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
      <Toolbar />
    </>
  );
}
