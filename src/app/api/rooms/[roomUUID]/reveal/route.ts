import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { broadcast } from "../route";

// only admin can hit this endpoint
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  const { roomUUID } = await params;
  const { userUUID } = await getSession();

  const user = await usersService.getOne(userUUID);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const room = await roomsService.getOne(roomUUID);
  if (!room) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  const isAdmin = user.role === "admin" && room.uuid === roomUUID;
  if (!isAdmin) {
    return Response.json({ error: "Not admin" }, { status: 403 });
  }

  const result = await roomsService.openCards(roomUUID);
  broadcast({ type: "reveal", data: result });
  return Response.json(result);
}
