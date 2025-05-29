import { CreateVoteDtoSchema } from "@/backend/dtos/CreateVoteDtoSchema";
import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { ClientUser, Vote, VoteCard } from "@/backend/types";
import { broadcast } from "../route";

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
    const voteValue: VoteCard | undefined = voteTypes.values[data.voteIndex];

    if (!voteValue) {
      return Response.json({ error: "Vote not found" }, { status: 404 });
    }

    const { room, user } = await usersService.checkIfUserExistsInRoom(
      roomUUID,
      userUUID
    );

    const vote: Vote = await roomsService.addVote(room, user.id, voteValue);

    const votedUser: ClientUser = {
      id: user.id,
      name: user.name,
      voted: true,
    };
    broadcast({ type: "voted", data: votedUser });

    return Response.json({ success: !!vote });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
