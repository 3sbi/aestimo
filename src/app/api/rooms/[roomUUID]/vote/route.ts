import { CreateVoteDtoSchema } from "@/backend/dtos/CreateVoteDtoSchema";
import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { ClientUser, Vote, VoteCard } from "@/types";
import emitter from "@/backend/eventEmitter";

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
      role: user.role,
      voted: true,
    };

    emitter.emit("vote", { type: "vote", data: votedUser });
    console.log(vote);
    return Response.json({ success: !!vote });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
