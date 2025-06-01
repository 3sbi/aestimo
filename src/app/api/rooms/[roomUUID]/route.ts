import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { sseStore } from "@/backend/eventEmitter";
import { roomsService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const { roomUUID } = await params;
    const success = roomsService.delete(roomUUID);
    const session = await getSession();
    session.destroy();
    sseStore.broadcast(roomUUID, {
      type: "delete-room",
      data: { success, roomUUID },
    });

    return Response.json({ success });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}
