import "server-only";

import { JoinRoomDtoSchema } from "@/backend/dtos";
import { ClientUserSchema } from "@/backend/dtos/ClientUserSchema";
import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { sseStore } from "@/backend/eventEmitter";
import { roomsService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { ClientUser } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const req = await request.json();
    const { roomUUID } = await params;

    const { success, data, error } = JoinRoomDtoSchema.safeParse({
      roomUUID,
      username: req.username,
    });

    if (!success) {
      console.error(error.message);
      return Response.json({ success: false }, { status: 422 });
    }
    const res = await roomsService.joinRoom(data);
    if (res === null) {
      return Response.json(
        { success: false },
        { status: 404, statusText: "Room not found" }
      );
    }

    const { room, user } = res;
    if (room.private || user === undefined) {
      return Response.json(
        { success: false },
        { status: 404, statusText: "Room not found" }
      );
    }

    const session = await getSession();
    session.userUUID = user.uuid;
    session.roomUUID = room.uuid;
    await session.save();

    const joinedUser: ClientUser = ClientUserSchema.parse({
      ...user,
      voted: false,
    });
    sseStore.broadcast(roomUUID, { type: "join", data: joinedUser });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
