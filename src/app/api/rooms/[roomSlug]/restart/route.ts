import { getDictionary, i18nConfig } from "@/i18n/getDictionary";
import {
  RoomNotFoundError,
  UserNotAdminError,
  UserNotFoundError,
} from "@/server/errors";
import { sseStore } from "@/server/eventEmitter";
import { roomsService, usersService } from "@/server/services";
import type { ClientRoom, Room } from "@/types";
import type { RestartEvent } from "@/types/EventData";

// only admin can hit this endpoint
export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const { roomSlug } = await params;
    const { isAdmin, userId } = await usersService.isAdmin();
    if (!isAdmin) {
      throw new UserNotAdminError();
    }

    const updatedRoom: Room = await roomsService.restart(roomSlug);
    const users = await roomsService.getUsers(
      updatedRoom.id,
      updatedRoom.round,
      false
    );
    const room: ClientRoom = roomsService.convertToClientRoom(updatedRoom);
    const data: RestartEvent = { type: "restart", data: { room, users } };
    sseStore.broadcast(roomSlug, data, userId);
    return Response.json(data["data"]);
  } catch (err) {
    console.error(err);
    const locale = request.headers.get("referer") ?? i18nConfig.defaultLocale;
    const errors = getDictionary(locale).errors;
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: errors["Not found"] }, { status: 404 });
    }

    if (err instanceof UserNotAdminError) {
      Response.json({ error: errors["Not admin"] }, { status: 403 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
