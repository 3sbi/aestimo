import { RoomNotFoundError, UserNotFoundError } from "@/server/errors";
import { sseStore } from "@/server/eventEmitter";
import { roomsService, usersService } from "@/server/services";
import type { NextRoundEvent } from "@/types/EventData";
import { NextRequest } from "next/server";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const { roomSlug } = await params;
    const { isAdmin, userId } = await usersService.isAdmin();
    if (isAdmin === false) {
      return Response.json({ error: "Not admin" }, { status: 403 });
    }

    const data = await roomsService.goToNextRound(roomSlug);
    const event: NextRoundEvent = { type: "next-round", data };
    sseStore.broadcast(roomSlug, event, userId);
    return Response.json(event["data"]);
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}
