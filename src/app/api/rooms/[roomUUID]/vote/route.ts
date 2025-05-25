import { CreateVoteDtoSchema } from "@/backend/dtos/CreateVoteDtoSchema";
import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  const { roomUUID } = await params;
  const { userUUID } = await getSession();

  try {
    const req = await request.json();
    const { success, error, data } = CreateVoteDtoSchema.safeParse(req);
    if (!success || !data) {
      console.log(error);
      return Response.json({ error: error.message }, { status: 422 });
    }

    const voteTypes = await roomsService.getVoteTypes(roomUUID);
    const vote = voteTypes.values[data.voteIndex];

    const room = await roomsService.getOne(roomUUID);
    if (!room) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    const user = await usersService.getOne(userUUID);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const result: boolean = await roomsService.addVote(room.id, user.id, vote);
    return Response.json({ success: result });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
