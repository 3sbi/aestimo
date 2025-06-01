import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import emitter from "@/backend/eventEmitter";
import { roomsService, usersService } from "@/backend/services";
import { NextRequest } from "next/server";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const { roomUUID } = await params;
    const isAdmin = usersService.isAdmin();
    if (!isAdmin) {
      return Response.json({ error: "Not admin" }, { status: 403 });
    }

    const room = await roomsService.goToNextRound(roomUUID);
    emitter.emit("next-round", { type: "next-round", data: room });

    return Response.json({ room });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}
