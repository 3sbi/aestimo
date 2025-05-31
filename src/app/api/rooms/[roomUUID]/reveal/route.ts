import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import emitter from "@/backend/eventEmitter";
import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";

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

    const user = await usersService.getOne(userUUID);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const room = await roomsService.getOne(roomUUID);
    if (!room) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    const isAdmin = user.role === "admin" && room.uuid === roomUUID;
    if (!isAdmin) {
      return Response.json({ error: "Not admin" }, { status: 403 });
    }

    const users = await roomsService.openCards(roomUUID);

    emitter.emit("reveal", { type: "reveal", data: users });
    return Response.json(users);
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
