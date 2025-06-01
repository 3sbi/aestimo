import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { sseStore } from "@/backend/eventEmitter";
import { usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { User } from "@/types";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { roomUUID } = session;
    if (!roomUUID) {
      throw new RoomNotFoundError();
    }

    const id = Number((await params).id);
    if (Number.isNaN(id)) {
      throw new UserNotFoundError();
    }
    const { isAdmin, userUUID } = await usersService.isAdmin();
    const user: User = await usersService.getOne(id);
    const isMyself: boolean = userUUID === user.uuid;

    if (!isAdmin && !isMyself) {
      return Response.json({ error: "Not allowed" }, { status: 403 });
    }

    const kickedUser = await usersService.kick(id);
    const data = {
      type: "kick",
      data: { success: !!kickedUser },
    } as const;
    sseStore.broadcast(roomUUID, data, userUUID);
    return Response.json({ success: !!user });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}
