import { RoomNotFoundError, UserNotFoundError } from "@/server/errors";
import { sseStore } from "@/server/eventEmitter";
import { roomsService, usersService } from "@/server/services";
import type { RevealEvent } from "@/types/EventData";

// only admin can hit this endpoint
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const { roomSlug } = await params;
    const { isAdmin, userId } = await usersService.isAdmin();
    if (isAdmin === false) {
      return Response.json({ error: "Not admin" }, { status: 403 });
    }

    const users = await roomsService.openCards(roomSlug);
    const data: RevealEvent = { type: "reveal", data: users };
    sseStore.broadcast(roomSlug, data, userId);
    return Response.json(data["data"]);
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
