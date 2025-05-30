import "server-only";

import { CreateRoomDtoSchema } from "@/backend/dtos/CreateRoomDtoSchema";
import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { roomsService } from "@/backend/services";
import { getSession } from "@/backend/session";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { success, error, data } = CreateRoomDtoSchema.safeParse(req);

    if (!success) {
      console.log(error);
      return Response.json({ error: error.message }, { status: 422 });
    }

    const res = await roomsService.createRoom(data);
    if (res === null) {
      return Response.json({ error: "Something went wrong" }, { status: 422 });
    }
    const session = await getSession();
    session.userUUID = res.user.uuid;
    session.roomUUID = res.room.uuid;
    await session.save();

    return Response.json({ roomUUID: res.room.uuid });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
