import "server-only";

import {
  RoomRepository,
  UserRepository,
  VoteRepository,
} from "@/backend/repositories";
import { Room, User } from "@/types";
import { RoomNotFoundError, UserNotFoundError } from "../errors";

class UsersService {
  async getOne(userUUID: User["uuid"]): Promise<User> {
    const res = await UserRepository.getByUUID(userUUID);
    if (!res || !res.users) {
      throw new UserNotFoundError();
    }
    return res.users;
  }

  async isAdmin(
    userUUID: User["uuid"],
    roomUUID: Room["uuid"]
  ): Promise<boolean> {
    const res = await UserRepository.getByUUID(userUUID);
    if (!res || !res.users) {
      throw new UserNotFoundError();
    }
    return (
      (await this.getOne(userUUID)).role === "admin" &&
      roomUUID === res.rooms?.uuid
    );
  }

  async checkIfUserExistsInRoom(
    roomUUID: Room["uuid"],
    userUUID: User["uuid"]
  ): Promise<{ user: User; room: Room }> {
    const room = await RoomRepository.getByUUID(roomUUID);
    if (!room) {
      throw new RoomNotFoundError();
    }

    const users = await UserRepository.getAllByRoomId(room.id);
    const user = users.find((user) => user.uuid === userUUID);
    if (!user) {
      throw new UserNotFoundError();
    }

    return { user, room };
  }

  async getVoteIndex(
    userId: User["id"],
    roomId: Room["id"],
    round: Room["round"]
  ): Promise<number | null> {
    const votes = await VoteRepository.getAllRoundVotes(roomId, round);
    const index = votes.findIndex((vote) => vote.userId === userId);
    if (index === -1) {
      return null;
    }
    return index;
  }
}

const usersService = new UsersService();
export default usersService;
