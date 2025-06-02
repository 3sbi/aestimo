import "server-only";

import { CreateRoomDto, JoinRoomDto } from "@/backend/dtos";
import {
  RoomIsPrivateError,
  RoomNotFoundError,
  UserNotFoundError,
  VoteNotFoundError,
} from "@/backend/errors";
import {
  RoomRepository,
  UserRepository,
  VoteRepository,
} from "@/backend/repositories";
import {
  ClientRoom,
  ClientUser,
  ClientVote,
  Room,
  User,
  Vote,
  VoteCard,
} from "@/types";

class RoomsService {
  convertToClientRoom(room: Room): ClientRoom {
    const { name, round, status, uuid } = room;
    return { name, private: room.private, round, status, uuid };
  }

  private async getOne(uuid: string): Promise<Room> {
    const room = await RoomRepository.getByUUID(uuid);
    if (!room) {
      throw new RoomNotFoundError();
    }
    return room;
  }

  async createRoom(values: CreateRoomDto): Promise<{ room: Room; user: User }> {
    const room = await RoomRepository.create({
      name: values.name,
      voteOptions: values.voteOptions,
      private: values.private,
    });
    if (!room) {
      throw new RoomNotFoundError();
    }

    const user = await UserRepository.create({
      roomId: room.id,
      name: values.username,
      role: "admin",
    });

    if (!user) {
      throw new UserNotFoundError();
    }

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
    round: number,
    addVotes: boolean
  ): Promise<ClientUser[]> {
    const users = await UserRepository.getAllByRoomId(roomId);
    const usersList: ClientUser[] = [];
    const votes = await VoteRepository.getAllRoundVotes(roomId, round);
    for (const user of users) {
      const vote = votes.find((vote) => vote.userId === user.id);
      const voted = vote !== undefined;
      const clientUser: ClientUser = {
        id: user.id,
        name: user.name,
        role: user.role,
        voted,
      };
      if (addVotes) {
        clientUser.vote = vote?.option;
      }
      usersList.push(clientUser);
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

  async openCards(roomUUID: string): Promise<ClientUser[]> {
    const room = await RoomRepository.update(roomUUID, { status: "finished" });
    if (!room) {
      throw new RoomNotFoundError();
    }

    return this.getUsers(room.id, room.round, true);
  }

  /* for finished round */
  async getVotes(roomId: number, round: number): Promise<ClientVote[]> {
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
    uuid: string
  ): Promise<{ room: ClientRoom; roundHistory: ClientVote[] }> {
    const item = await RoomRepository.getByUUID(uuid);
    if (!item) {
      throw new RoomNotFoundError();
    }
    const currentRound: number = item.round;
    const roundHistory = await VoteRepository.getAllRoundVotes(
      item.id,
      currentRound
    );
    const room = await RoomRepository.update(uuid, {
      round: currentRound + 1,
      status: "started",
    });
    if (!room) {
      throw new RoomNotFoundError();
    }

    const clientRoom: ClientRoom = this.convertToClientRoom(room);
    return { room: clientRoom, roundHistory };
  }

  async addVote(room: Room, userId: number, value: VoteCard): Promise<Vote> {
    const existingVote = await VoteRepository.getOne(room.id, room.round);
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

  async restart(uuid: string): Promise<Room> {
    const room = await RoomRepository.update(uuid, { status: "started" });
    if (!room) {
      throw new RoomNotFoundError();
    }
    await VoteRepository.deleteAll(room.id, room.round);
    return room;
  }

  async changeRoomPrivacy(
    uuid: string,
    newPrivate: boolean
  ): Promise<ClientRoom> {
    const room = await RoomRepository.update(uuid, { private: newPrivate });
    if (!room) {
      throw new RoomNotFoundError();
    }
    return this.convertToClientRoom(room);
  }

  async delete(uuid: string): Promise<boolean> {
    return RoomRepository.delete(uuid);
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
