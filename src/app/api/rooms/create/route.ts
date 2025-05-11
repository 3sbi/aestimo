import "server-only";

import { RoomsService } from "@/database/services";

export async function POST(request: Request) {
  const req: unknown = await request.json();
  const { success, error, data } =
    RoomsService.CreateRoomDtoSchema.safeParse(req);
  if (!success) {
    return Response.json(
      { success: false },
      { status: 422, statusText: error.message }
    );
  }
  const res = await RoomsService.createRoom(data);
  if (res === null) {
    return Response.json(
      { success: false },
      { status: 422, statusText: "Something went wrong" }
    );
  }
  return Response.json(res);
}
