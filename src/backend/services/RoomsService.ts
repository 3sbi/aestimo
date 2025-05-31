import "server-only";

import { CreateRoomDto, JoinRoomDto } from "@/backend/dtos";
import {
  RoomIsPrivateError,
  RoomNotFoundError,
  VoteNotFoundError,
} from "@/backend/errors";
import {
  RoomRepository,
  UserRepository,
  VoteRepository,
} from "@/backend/repositories";
import { ClientUser, Room, User, Vote, VoteCard } from "@/types";

class RoomsService {
  async getOne(uuid: string): Promise<Room> {
    const room = await RoomRepository.getByUUID(uuid);
    if (!room) {
      throw new RoomNotFoundError();
    }
    return room;
  }

  async createRoom(values: CreateRoomDto): Promise<{ room: Room; user: User }> {
    const { username, name, voteOptions } = values;

    const room = await RoomRepository.create({
      name,
      voteOptions,
    });
    if (!room) {
      throw new RoomNotFoundError();
    }

    const user = await UserRepository.create({
      roomId: room.id,
      name: username,
      role: "admin",
    });

    return { room, user };
  }

  async joinRoom(values: JoinRoomDto): Promise<{ room: Room; user?: User }> {
    const { roomUUID, username } = values;
    const room = await this.getOne(roomUUID);
    if (!room) throw new RoomNotFoundError();
    if (room.private) throw new RoomIsPrivateError();

    const user = await UserRepository.create({
      roomId: room.id,
      name: username,
      role: "basic",
    });
    return { room, user };
  }

  async getUsers(roomId: number, round: number): Promise<ClientUser[]> {
    const users = await UserRepository.getAllByRoomId(roomId);
    const usersList: ClientUser[] = [];
    const votes = await VoteRepository.getAllRoundVotes(roomId, round);
    for (const user of users) {
      const voted: boolean =
        votes.find((vote) => vote.userId === user.id) !== undefined;
      usersList.push({ id: user.id, name: user.name, role: user.role, voted });
    }
    return usersList;
  }

  async getVoteTypes(roomUUID: string): Promise<Room["voteOptions"]> {
    const room = await RoomRepository.getByUUID(roomUUID);
    if (!room) {
      throw new RoomNotFoundError();
    }
    return room.voteOptions;
  }

  async openCards(
    roomUUID: string
  ): Promise<{ userId: number; name: string | null; vote: VoteCard }[]> {
    const room = await RoomRepository.update(roomUUID, { status: "finished" });
    if (!room) {
      throw new RoomNotFoundError();
    }
    const votes = await VoteRepository.getAllRoundVotes(room.id, room.round);
    return votes;
  }

  /* for finished round */
  async getVotes(roomId: number, round: number) {
    const votes = await VoteRepository.getAllRoundVotes(roomId, round);
    return votes;
  }

  async goToNextRound(uuid: string): Promise<Room> {
    const item = await RoomRepository.getByUUID(uuid);
    if (!item) {
      throw new RoomNotFoundError();
    }
    const room = await RoomRepository.update(uuid, {
      round: item.round + 1,
      status: "started",
    });
    if (!room) {
      throw new RoomNotFoundError();
    }
    return room;
  }

  async addVote(room: Room, userId: number, value: VoteCard): Promise<Vote> {
    const existingVote = await VoteRepository.getOne(room.id, room.round);
    if (existingVote) {
      const vote = await VoteRepository.update(existingVote.id, value);
      if (!vote) {
        throw new VoteNotFoundError();
      }
      return vote;
    }
    const vote = await VoteRepository.create(room.id, userId, value);
    if (!vote) {
      throw new VoteNotFoundError();
    }
    return vote;
  }

  async restart(uuid: string): Promise<Room> {
    const room = await RoomRepository.update(uuid, { status: "started" });
    if (!room) {
      throw new RoomNotFoundError();
    }
    await VoteRepository.deleteAll(room.id, room.round);
    return room;
  }

  async changeRoomPrivacy(uuid: string, newPrivate: boolean) {
    const room = await RoomRepository.update(uuid, { private: newPrivate });
    if (!room) {
      throw new RoomNotFoundError();
    }
    return room;
  }

  async delete(uuid: string): Promise<boolean> {
    return RoomRepository.delete(uuid);
  }
}

const roomsService = new RoomsService();
export default roomsService;
