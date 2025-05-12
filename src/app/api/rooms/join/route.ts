import "server-only";

import { JoinRoomDtoSchema } from "@/database/dtos/JoinRoomDtoSchema";
import { RoomsService } from "@/database/services";

export async function POST(request: Request) {
  const req = await request.json();
  const { success, data, error } =
    JoinRoomDtoSchema.safeParse(req);
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
  return Response.json({ res });
}
