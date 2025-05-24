import "server-only";

import { CreateRoomDto } from "@/server/dtos/CreateRoomDtoSchema";
import { JoinRoomDto } from "@/server/dtos/JoinRoomDtoSchema";
import {
  RoomRepository,
  UserRepository,
  VoteTypeRepository,
} from "@/server/repositories";
import { Room, User } from "@/server/types";

class RoomsService {
  async getOne(uuid: string) {
    return RoomRepository.getByUUID(uuid);
  }

  async createRoom(values: CreateRoomDto): Promise<{ room: Room; user: User }> {
    const { username, name, voteOptions } = values;
    const voteType = await VoteTypeRepository.create(voteOptions);

    const room = await RoomRepository.create({
      name,
      voteTypeId: voteType.id,
    });

    const user = await UserRepository.create({
      roomId: room.id,
      name: username,
      role: "admin",
    });
    return { room, user };
  }

  async joinRoom(
    values: JoinRoomDto
  ): Promise<{ room: Room; user: User } | null> {
    const { uuid, username } = values;
    const room = await this.getOne(uuid);
    if (!room) return null;

    const user = await UserRepository.create({
      roomId: room.id,
      name: username,
      role: "basic",
    });
    return { room, user };
  }

  async getUsers(roomId: number) {
    return UserRepository.getAllByRoomId(roomId);
  }

  async getVoteTypes(id: number) {
    const { votyTypeId } = await RoomRepository.getById(id);
    const voteType = await VoteTypeRepository.getById(votyTypeId);
    return voteType;
  }

  async openCards(id: number) {
    return RoomRepository.update(id, { status: "finished" });
  }

  async goToNextRound(id: number) {
    const item = await RoomRepository.getById(id);
    const room = await RoomRepository.update(id, {
      round: item.round + 1,
      status: "started",
    });

    return room;
  }

  async changeRoomPrivacy(id: number, newPrivate: boolean) {
    const room = RoomRepository.update(id, { private: newPrivate });
    return room;
  }
}

const roomsService = new RoomsService();
export default roomsService;
