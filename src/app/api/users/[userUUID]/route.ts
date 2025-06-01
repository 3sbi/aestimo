import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ userUUID: string }> }
) {
  try {
    const { userUUID } = await params;
    const session = await getSession();
    const isMyself = session.userUUID === userUUID;
    const isAdmin = usersService.isAdmin();

    if (!isAdmin && isMyself) {
      return Response.json({ error: "Not allowed" }, { status: 403 });
    }

    const success = await usersService.kick(userUUID);
    return Response.json({ success });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }
    return Response.json({ error: err }, { status: 500 });
  }
}
