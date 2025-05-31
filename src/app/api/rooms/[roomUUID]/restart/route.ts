import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import emitter from "@/backend/eventEmitter";
import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { ClientRoom } from "@/types";

// only admin can hit this endpoint
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const { roomUUID } = await params;
    const { userUUID } = await getSession();
    if (!userUUID) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isAdmin = await usersService.isAdmin(userUUID, roomUUID);
    if (!isAdmin) {
      return Response.json({ error: "Not admin" }, { status: 403 });
    }

    const updatedRoom = await roomsService.restart(roomUUID);

    const clientRoom: ClientRoom = {
      uuid: updatedRoom.uuid,
      name: updatedRoom.name,
      private: updatedRoom.private,
      round: updatedRoom.round,
      status: updatedRoom.status,
    };
    const users = await roomsService.getUsers(
      updatedRoom.id,
      updatedRoom.round
    );

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
