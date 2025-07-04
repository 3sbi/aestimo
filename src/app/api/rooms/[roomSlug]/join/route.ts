import { JoinRoomDtoSchema } from "@/server/dtos";
import { ClientUserSchema } from "@/server/dtos/ClientUserSchema";
import { RoomNotFoundError, UserNotFoundError } from "@/server/errors";
import { sseStore } from "@/server/eventEmitter";
import { roomsService } from "@/server/services";
import { getSession } from "@/server/session";
import type { ClientUser } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const req = await request.json();
    const { roomSlug } = await params;

    const { success, data, error } = JoinRoomDtoSchema.safeParse({
      roomSlug,
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
    session.userId = user.id;
    session.roomSlug = room.slug;
    await session.save();

    const joinedUser: ClientUser = ClientUserSchema.parse({
      ...user,
      connected: true,
      voted: false,
    });
    sseStore.broadcast(roomSlug, { type: "join", data: joinedUser });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
