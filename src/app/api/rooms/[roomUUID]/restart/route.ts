import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { ClientRoom } from "@/backend/types";

// only admin can hit this endpoint
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  const { roomUUID } = await params;
  const { userUUID } = await getSession();
  const user = await usersService.getOne(userUUID);
  const room = await roomsService.getOne(roomUUID);
  const isAdmin = user?.role === "admin" && room?.uuid === roomUUID;
  if (!isAdmin) {
    return Response.json({ error: "Not admin" }, { status: 403 });
  }

  const updatedRoom = await roomsService.restart(roomUUID);

  const clientRoom: ClientRoom = {
    uuid: updatedRoom.uuid,
    name: updatedRoom.name,
    private: updatedRoom.private,
    round: updatedRoom.round,
    status: updatedRoom.status,
  };

  return Response.json({ room: clientRoom });
}
