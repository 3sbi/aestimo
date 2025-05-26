import "server-only";

import { CreateRoomDto } from "@/backend/dtos/CreateRoomDtoSchema";
import { JoinRoomDto } from "@/backend/dtos/JoinRoomDtoSchema";
import { RoomIsPrivateError, RoomNotFoundError } from "@/backend/errors/Rooms";
import {
  RoomRepository,
  UserRepository,
  VoteRepository,
  VoteTypeRepository,
} from "@/backend/repositories";
import { Room, User, VoteCard, VoteType } from "@/backend/types";

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
    const voteType = await VoteTypeRepository.create(voteOptions);

    const room = await RoomRepository.create({
      name,
      voteTypeId: voteType.id,
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

  async getUsers(
    roomId: number,
    round: number
  ): Promise<{ id: number; name: string; voted: boolean }[]> {
    const users = await UserRepository.getAllByRoomId(roomId);
    const usersList: { id: number; name: string; voted: boolean }[] = [];
    const votes = await VoteRepository.getAllRoundVotes(roomId, round);
    for (const user of users) {
      const voted: boolean =
        votes.find((vote) => vote.userId === user.id) !== undefined;
      usersList.push({ id: user.id, name: user.name, voted });
    }
    return usersList;
  }

  async getVoteTypes(roomUUID: string): Promise<VoteType> {
    const room = await RoomRepository.getByUUID(roomUUID);
    if (!room) {
      throw new RoomNotFoundError();
    }
    const voteType = await VoteTypeRepository.getById(room.votyTypeId);
    return voteType;
  }

  async openCards(
    roomUUID: string
  ): Promise<{ userId: number; name: string | null; value: VoteCard }[]> {
    const room = await RoomRepository.update(roomUUID, { status: "finished" });
    if (!room) {
      throw new RoomNotFoundError();
    }
    const votes = await VoteRepository.getAllRoundVotes(room.id, room.round);
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

  async addVote(
    roomId: number,
    userId: number,
    value: VoteCard
  ): Promise<boolean> {
    const vote = await VoteRepository.create(roomId, userId, value);
    return !!vote;
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
