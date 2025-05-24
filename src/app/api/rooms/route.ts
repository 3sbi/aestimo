import "server-only";

import { CreateRoomDtoSchema } from "@/server/dtos/CreateRoomDtoSchema";
import { RoomsService } from "@/server/services";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { success, error, data } = CreateRoomDtoSchema.safeParse(req);

    if (!success) {
      console.log(error);
      return Response.json({ error: error.message }, { status: 422 });
    }

    const res = await RoomsService.createRoom(data);
    if (res === null) {
      return Response.json({ error: "Something went wrong" }, { status: 422 });
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
