import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { sseStore } from "@/backend/eventEmitter";
import { roomsService, usersService } from "@/backend/services";
import { NextRequest } from "next/server";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const { roomUUID } = await params;
    const { isAdmin, userUUID } = await usersService.isAdmin();
    if (isAdmin === false) {
      return Response.json({ error: "Not admin" }, { status: 403 });
    }

    const room = await roomsService.goToNextRound(roomUUID);
    sseStore.broadcast(roomUUID, { type: "next-round", data: room }, userUUID);

    return Response.json({ room });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}
