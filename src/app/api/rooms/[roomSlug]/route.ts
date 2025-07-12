import { getDictionary, i18nConfig } from "@/i18n/getDictionary";
import { UpdateRoomDtoSchema } from "@/server/dtos/UpdateRoomDtoSchema";
import {
  RoomNotFoundError,
  UserNotAdminError,
  UserNotFoundError,
} from "@/server/errors";
import { sseStore } from "@/server/eventEmitter";
import { roomsService, usersService } from "@/server/services";
import { getSession } from "@/server/session";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const { roomSlug } = await params;
    const { isAdmin } = await usersService.isAdmin();
    if (!isAdmin) {
      throw new UserNotAdminError();
    }
    const success = roomsService.delete(roomSlug);
    const session = await getSession();
    session.destroy();
    sseStore.broadcast(roomSlug, { type: "room-delete" });

    return Response.json({ success });
  } catch (err) {
    console.error(err);
    const locale = req.headers.get("referer") ?? i18nConfig.defaultLocale;
    const errors = getDictionary(locale).errors;
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: errors["Not found"] }, { status: 404 });
    }
    if (err instanceof UserNotAdminError) {
      Response.json({ error: errors["Not admin"] }, { status: 403 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const { roomSlug } = await params;
    const { isAdmin } = await usersService.isAdmin();
    if (!isAdmin) {
      throw new UserNotAdminError();
    }

    const json = await req.json();
    const { success, error, data } = UpdateRoomDtoSchema.safeParse(json);
    if (!success) {
      console.error(error);
      return Response.json({ error: error.message }, { status: 422 });
    }
    const room = await roomsService.update(roomSlug, data);
    sseStore.broadcast(roomSlug, { type: "room-update", data: { room } });
    if (room.autoreveal) {
      const room = await roomsService.getOne(roomSlug);
      const users = await roomsService.getUsers(room.id, room.round, true);
      const allVoted: boolean = users.every((user) => user.voted);
      if (room.autoreveal && allVoted) {
        const data = await roomsService.openCards(roomSlug);
        sseStore.broadcast(roomSlug, { type: "reveal", data });
      }
    }
    return Response.json(room);
  } catch (err) {
    console.error(err);
    const locale = req.headers.get("referer") ?? i18nConfig.defaultLocale;
    const errors = getDictionary(locale).errors;
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: errors["Not found"] }, { status: 404 });
    }
    if (err instanceof UserNotAdminError) {
      Response.json({ error: errors["Not admin"] }, { status: 403 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}
