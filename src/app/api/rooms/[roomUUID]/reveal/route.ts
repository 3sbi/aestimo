import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import emitter from "@/backend/eventEmitter";
import { roomsService, usersService } from "@/backend/services";

// only admin can hit this endpoint
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const { roomUUID } = await params;
    const isAdmin = usersService.isAdmin();
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
