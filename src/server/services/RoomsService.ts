import "server-only";

import { CreateRoomDto, JoinRoomDto } from "@/server/dtos";
import {
    RoomIsPrivateError,
    RoomNotFoundError,
    UserNotFoundError,
    VoteNotFoundError,
} from "@/server/errors";
import {
    RoomRepository,
    UserRepository,
    VoteRepository,
} from "@/server/repositories";
import type {
    ClientRoom,
    ClientUser,
    ClientVote,
    Room,
    User,
    Vote,
    VoteCard,
} from "@/types";
import { ClientUserSchema } from "../dtos/ClientUserSchema";
import { sseStore } from "../eventEmitter";

class RoomsService {
  convertToClientRoom(room: Room): ClientRoom {
    const { name, round, status, slug } = room;
    return { name, private: room.private, round, status, slug };
  }

  async getOne(slug: Room["slug"]): Promise<Room> {
    const room = await RoomRepository.getBySlug(slug);
    if (!room) {
      throw new RoomNotFoundError();
    }
    return room;
  }

  async createRoom({
    username,
    ...dto
  }: Omit<CreateRoomDto, "prefix"> & { slug: string }): Promise<{
    room: Room;
    user: User;
  }> {
    const room = await RoomRepository.create(dto);
    if (!room) {
      throw new RoomNotFoundError();
    }

    const user = await UserRepository.create({
      roomId: room.id,
      name: username,
      role: "admin",
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return { room, user };
  }

  async joinRoom(values: JoinRoomDto): Promise<{ room: Room; user?: User }> {
    const { roomSlug, username } = values;
    const room = await this.getOne(roomSlug);
    if (!room) throw new RoomNotFoundError();
    if (room.private) throw new RoomIsPrivateError();

    const user = await UserRepository.create({
      roomId: room.id,
      name: username,
      role: "basic",
    });
    return { room, user };
  }

  async getUsers(
    roomId: Room["id"],
    round: Room["round"],
    addVotes: boolean
  ): Promise<ClientUser[]> {
    const users = await UserRepository.getAllByRoomId(roomId);
    const usersList: ClientUser[] = [];
    const votes = await VoteRepository.getAllRoundVotes(roomId, round);
    for (const user of users) {
      const vote = votes.find((vote) => vote.userId === user.id);
      const voted = vote !== undefined;
      const connected: boolean = sseStore.isConnected(user.id);
      const clientUser = ClientUserSchema.parse({ ...user, voted, connected });
      if (addVotes) {
        clientUser.vote = vote?.option;
      }
      usersList.push(clientUser);
    }
    return usersList;
  }

  async getVoteTypes(slug: Room["slug"]): Promise<Room["voteOptions"]> {
    const room = await RoomRepository.getBySlug(slug);
    if (!room) {
      throw new RoomNotFoundError();
    }

    return room.voteOptions;
  }

  async openCards(slug: Room["slug"]): Promise<ClientUser[]> {
    const room = await RoomRepository.update(slug, { status: "finished" });
    if (!room) {
      throw new RoomNotFoundError();
    }

    return this.getUsers(room.id, room.round, true);
  }

  /* for finished round */
  async getVotes(
    roomId: Room["id"],
    round: Room["round"]
  ): Promise<ClientVote[]> {
    const votes = await VoteRepository.getAllRoundVotes(roomId, round);
    return votes;
  }

  async getVotesHistory(
    roomId: number,
    beforeRound: number
  ): Promise<Record<Vote["round"], ClientVote[]>> {
    const allVotes = await VoteRepository.getAllVotes(roomId);
    const history: Record<Vote["round"], ClientVote[]> = {};
    for (const vote of allVotes) {
      const { round, ...clientVote } = vote;
      if (round < beforeRound) {
        if (!Array.isArray(history[round])) {
          history[round] = [];
        }
        history[round].push(clientVote);
      }
    }
    return history;
  }

  async goToNextRound(
    slug: Room["slug"]
  ): Promise<{ room: ClientRoom; prevRoundVotes: ClientVote[] }> {
    const item = await RoomRepository.getBySlug(slug);
    if (!item) {
      throw new RoomNotFoundError();
    }
    const currentRound: number = item.round;
    const prevRoundVotes = await VoteRepository.getAllRoundVotes(
      item.id,
      currentRound
    );
    const room = await RoomRepository.update(slug, {
      round: currentRound + 1,
      status: "started",
    });
    if (!room) {
      throw new RoomNotFoundError();
    }

    const clientRoom: ClientRoom = this.convertToClientRoom(room);
    return { room: clientRoom, prevRoundVotes };
  }

  async addVote(
    room: Room,
    userId: User["id"],
    value: VoteCard
  ): Promise<Vote> {
    const existingVote = await VoteRepository.getOne(
      room.id,
      room.round,
      userId
    );
    if (existingVote) {
      const vote = await VoteRepository.update(
        existingVote.id,
        value,
        room.round
      );
      if (!vote) {
        throw new VoteNotFoundError();
      }
      return vote;
    }
    const vote = await VoteRepository.create(
      room.id,
      userId,
      value,
      room.round
    );
    if (!vote) {
      throw new VoteNotFoundError();
    }
    return vote;
  }

  async restart(slug: Room["slug"]): Promise<Room> {
    const room = await RoomRepository.update(slug, { status: "started" });
    if (!room) {
      throw new RoomNotFoundError();
    }
    await VoteRepository.deleteAll(room.id, room.round);
    return room;
  }

  async changeRoomPrivacy(
    slug: Room["slug"],
    newPrivate: boolean
  ): Promise<ClientRoom> {
    const room = await RoomRepository.update(slug, { private: newPrivate });
    if (!room) {
      throw new RoomNotFoundError();
    }
    return this.convertToClientRoom(room);
  }

  async delete(slug: Room["slug"]): Promise<boolean> {
    return RoomRepository.delete(slug);
  }

  async getPublicRooms(): Promise<ClientRoom[]> {
    const rooms = await RoomRepository.getAll();
    const clientRooms: ClientRoom[] = rooms
      .filter((room) => !room.private)
      .map(this.convertToClientRoom);
    return clientRooms;
  }
}

const roomsService = new RoomsService();
export default roomsService;
