import "server-only";

import { JoinRoomDtoSchema } from "@/server/dtos/JoinRoomDtoSchema";
import { RoomsService } from "@/server/services";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { success, data, error } = JoinRoomDtoSchema.safeParse(req);

    if (!success) {
      return Response.json(
        { success: false },
        { status: 422, statusText: error.message }
      );
    }

    const res = await RoomsService.joinRoom(data);
    if (res === null) {
      return Response.json(
        { success: false },
        { status: 404, statusText: "Room not found" }
      );
    }
    const cookieStore = await cookies();
    cookieStore.set("user-uuid", res.user.uuid, { secure: true });
    cookieStore.set("user-name", res.user.name, { secure: true });
    cookieStore.set("room-uuid", res.room.uuid, { secure: true });
    cookieStore.set("room-name", res.room.name, { secure: true });

    return Response.json(res.room.uuid);
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
