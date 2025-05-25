import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";

// only admin can hit this endpoint
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  const { roomUUID } = await params;
  const { userUUID } = await getSession();
  const user = await usersService.getOne(userUUID);
  const room = await roomsService.getOne(roomUUID);
  const isAdmin = user?.role === "admin" && room.uuid === roomUUID;
  if (!isAdmin) {
    return Response.json({ error: "Not admin" }, { status: 403 });
  }
  const result = await roomsService.openCards(roomUUID);
  return Response.json(result);
}
