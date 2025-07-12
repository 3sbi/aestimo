import { getDictionary, i18nConfig } from "@/i18n/getDictionary";
import { CreateVoteDtoSchema } from "@/server/dtos";
import { ClientUserSchema } from "@/server/dtos/ClientUserSchema";
import {
  RoomNotFoundError,
  UserNotAdminError,
  UserNotFoundError,
  VoteNotFoundError,
} from "@/server/errors";
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
      throw new VoteNotFoundError();
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

    const users = await roomsService.getUsers(room.id, room.round, true);
    const allVoted: boolean = users.every((user) => user.voted);
    if (room.autoreveal && allVoted) {
      const data = await roomsService.openCards(roomSlug);
      sseStore.broadcast(roomSlug, { type: "reveal", data });
    }
    return Response.json({ success: !!vote });
  } catch (err) {
    console.error(err);
    const locale = request.headers.get("referer") ?? i18nConfig.defaultLocale;
    const errors = getDictionary(locale).errors;
    if (
      err instanceof UserNotFoundError ||
      err instanceof RoomNotFoundError ||
      err instanceof VoteNotFoundError
    ) {
      return Response.json({ error: errors["Not found"] }, { status: 404 });
    }

    if (err instanceof UserNotAdminError) {
      Response.json({ error: errors["Not admin"] }, { status: 403 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
