import { CreateVoteDtoSchema } from "@/backend/dtos/CreateVoteDtoSchema";
import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { sseStore } from "@/backend/eventEmitter";
import { roomsService, usersService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { ClientUser, Vote, VoteCard } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const { roomUUID } = await params;
    const { userUUID } = await getSession();

    if (!userUUID) {
      throw new UserNotFoundError();
    }

    const req = await request.json();
    const { success, error, data } = CreateVoteDtoSchema.safeParse(req);
    if (!success || !data) {
      console.error(error);
      return Response.json({ error: error.message }, { status: 422 });
    }

    const voteOptions: VoteCard[] = await roomsService.getVoteTypes(roomUUID);
    const voteValue: VoteCard | undefined = voteOptions[data.voteIndex];

    if (!voteValue) {
      return Response.json({ error: "Vote not found" }, { status: 404 });
    }

    const { user, room } = await usersService.checkIfUserExistsInRoom(
      roomUUID,
      userUUID
    );

    const vote: Vote = await roomsService.addVote(room, user.id, voteValue);
    const connected: boolean =
      sseStore.clients.find((u) => u.UUID === user.uuid) !== undefined;
    const votedUser: ClientUser = {
      id: user.id,
      name: user.name,
      role: user.role,
      voted: true,
      connected,
    };

    sseStore.broadcast(roomUUID, { type: "vote", data: votedUser }, user.uuid);
    return Response.json({ success: !!vote });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
