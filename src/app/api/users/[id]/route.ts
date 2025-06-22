import {
  TransferAdminRightsDtoSchema,
  UpdateUserDtoSchema,
} from "@/server/dtos";
import { ClientUserSchema } from "@/server/dtos/ClientUserSchema";
import { RoomNotFoundError, UserNotFoundError } from "@/server/errors";
import { sseStore } from "@/server/eventEmitter";
import { usersService } from "@/server/services";
import { getSession } from "@/server/session";
import type { User } from "@/types";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const req = await request.json();
    const session = await getSession();
    const { roomSlug } = session;
    if (!roomSlug) {
      throw new RoomNotFoundError();
    }

    const id = Number((await params).id);
    if (Number.isNaN(id)) {
      throw new UserNotFoundError();
    }

    const { success, data, error } = UpdateUserDtoSchema.safeParse(req);
    if (!success) {
      console.error(error);
      throw new Error();
    }

    const updatedUser = await usersService.update(id, data);
    const connected = sseStore.isConnected(updatedUser.id);
    const clientUser = ClientUserSchema.parse({
      ...updatedUser,
      connected,
    });

    return Response.json({ user: clientUser });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { roomSlug } = session;
    if (!roomSlug) {
      throw new RoomNotFoundError();
    }

    const id = Number((await params).id);
    if (Number.isNaN(id)) {
      throw new UserNotFoundError();
    }
    const { isAdmin, userId } = await usersService.isAdmin();
    const user: User = await usersService.getOne(id);
    const isMyself: boolean = userId === user.id;

    if (!isAdmin && !isMyself) {
      return Response.json({ error: "Not allowed" }, { status: 403 });
    }

    if (isAdmin && isMyself) {
      const req = await request.json();
      const newAdminId = req.newAdminId;
      const { success, data, error } = TransferAdminRightsDtoSchema.safeParse({
        oldAdminId: id,
        newAdminId,
      });

      if (!success) {
        console.error(error);
        return Response.json(
          { error: "Failed to change room admin" },
          { status: 422 }
        );
      }

      const user = await usersService.transferAdminRights(data);
      const event = {
        type: "transfer-admin",
        data: { newAdminId: user.id },
      } as const;

      sseStore.broadcast(roomSlug, event, userId);
    }

    const kickedUser = await usersService.leave(id);
    const data = {
      type: "kick",
      data: { userId: kickedUser.id },
    } as const;
    sseStore.broadcast(roomSlug, data, userId);

    if (isMyself) {
      session.destroy();
    }

    return Response.json({ success: !!user });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}
