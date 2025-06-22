import { CreateVoteDtoSchema } from "@/server/dtos";
import { ClientUserSchema } from "@/server/dtos/ClientUserSchema";
import { RoomNotFoundError, UserNotFoundError } from "@/server/errors";
import { sseStore } from "@/server/eventEmitter";
import { roomsService, usersService } from "@/server/services";
import { getSession } from "@/server/session";
import type { ClientUser, Vote, VoteCard } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const { roomSlug } = await params;
    const { userId } = await getSession();

    if (typeof userId !== "number") {
      throw new UserNotFoundError();
    }

    const req = await request.json();
    const { success, error, data } = CreateVoteDtoSchema.safeParse(req);
    if (!success || !data) {
      console.error(error);
      return Response.json({ error: error.message }, { status: 422 });
    }

    const voteOptions: VoteCard[] = await roomsService.getVoteTypes(roomSlug);
    const voteValue: VoteCard | undefined = voteOptions[data.voteIndex];

    if (!voteValue) {
      return Response.json({ error: "Vote not found" }, { status: 404 });
    }

    const { user, room } = await usersService.checkIfUserExistsInRoom(
      roomSlug,
      userId
    );

    const vote: Vote = await roomsService.addVote(room, user.id, voteValue);
    const connected: boolean = sseStore.isConnected(user.id);

    const votedUser: ClientUser = ClientUserSchema.parse({
      ...user,
      connected,
      voted: true,
    });

    sseStore.broadcast(roomSlug, { type: "vote", data: votedUser }, user.id);
    return Response.json({ success: !!vote });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
