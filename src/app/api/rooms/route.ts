import "server-only";

import { CreateRoomDtoSchema } from "@/database/dtos/CreateRoomDtoSchema";
import { RoomsService } from "@/database/services";

export async function POST(request: Request) {
  try {
    const req = Object.fromEntries(await request.formData());
    const { success, error, data } = CreateRoomDtoSchema.safeParse(req);

    if (!success) {
      console.log(error);
      return Response.json({ error: "Something went wrong" }, { status: 422 });
    }

    const res = await RoomsService.createRoom(data);
    if (res === null) {
      return Response.json({ error: "Something went wrong" }, { status: 422 });
    }
    return Response.json(res);
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
