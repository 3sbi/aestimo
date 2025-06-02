import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { sseStore } from "@/backend/eventEmitter";
import { roomsService, usersService } from "@/backend/services";
import { ClientRoom, Room } from "@/types";

// only admin can hit this endpoint
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const { roomUUID } = await params;
    const { isAdmin, userUUID } = await usersService.isAdmin();
    if (isAdmin === false) {
      return Response.json({ error: "Not admin" }, { status: 403 });
    }

    const updatedRoom: Room = await roomsService.restart(roomUUID);
    const users = await roomsService.getUsers(
      updatedRoom.id,
      updatedRoom.round,
      false
    );
    const room: ClientRoom = roomsService.convertToClientRoom(updatedRoom);
    const data = {
      type: "restart",
      data: { room, users },
    } as const;

    sseStore.broadcast(roomUUID, data, userUUID);
    return Response.json(data);
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
