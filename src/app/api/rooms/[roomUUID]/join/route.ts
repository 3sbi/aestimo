import "server-only";

import { JoinRoomDtoSchema } from "@/backend/dtos/JoinRoomDtoSchema";
import { roomsService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { broadcast } from "../route";
import { ClientUser } from "@/backend/types";

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
      console.log(error.message);
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

    const joinedUser: ClientUser = {
      id: user.id,
      name: user.name,
      voted: false,
    };
    broadcast({ type: "join", data: joinedUser });
    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
