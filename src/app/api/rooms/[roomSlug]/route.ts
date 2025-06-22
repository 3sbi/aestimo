import { RoomNotFoundError, UserNotFoundError } from "@/server/errors";
import { sseStore } from "@/server/eventEmitter";
import { roomsService } from "@/server/services";
import { getSession } from "@/server/session";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const { roomSlug } = await params;
    const success = roomsService.delete(roomSlug);
    const session = await getSession();
    session.destroy();
    sseStore.broadcast(roomSlug, { type: "delete-room" });

    return Response.json({ success });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}
