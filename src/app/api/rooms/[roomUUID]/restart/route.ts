import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import emitter from "@/backend/eventEmitter";
import { roomsService, usersService } from "@/backend/services";
import { ClientRoom } from "@/types";

// only admin can hit this endpoint
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const { roomUUID } = await params;
    const isAdmin = usersService.isAdmin();
    if (!isAdmin) {
      return Response.json({ error: "Not admin" }, { status: 403 });
    }

    const updatedRoom = await roomsService.restart(roomUUID);
    const users = await roomsService.getUsers(
      updatedRoom.id,
      updatedRoom.round,
      false
    );

    const clientRoom: ClientRoom = {
      uuid: updatedRoom.uuid,
      name: updatedRoom.name,
      private: updatedRoom.private,
      round: updatedRoom.round,
      status: updatedRoom.status,
    };

    const data = { room: clientRoom, users };

    emitter.emit("restart", { type: "restart", data });
    return Response.json(data);
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
