import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { sseStore } from "@/backend/eventEmitter";
import { roomsService } from "@/backend/services";
import { getSession } from "@/backend/session";
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
