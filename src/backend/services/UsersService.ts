import "server-only";

import {
  RoomRepository,
  UserRepository,
  VoteRepository,
} from "@/backend/repositories";
import { Room, User } from "@/types";
import { RoomNotFoundError, UserNotFoundError } from "../errors";
import { getSession } from "../session";

class UsersService {
  async getOne(userUUID: User["uuid"]): Promise<User> {
    const data = await UserRepository.getByUUID(userUUID);
    if (!data || !data.users) {
      throw new UserNotFoundError();
    }
    return data.users;
  }

  async isAdmin(): Promise<boolean> {
    const { userUUID, roomUUID } = await getSession();
    if (typeof roomUUID !== "string") {
      throw new RoomNotFoundError();
    }
    if (typeof userUUID !== "string") {
      throw new UserNotFoundError();
    }
    const data = await UserRepository.getByUUID(userUUID);
    if (!data || !data.users) {
      throw new UserNotFoundError();
    }
    const user = data.users;
    const isAdmin: boolean =
      user.role === "admin" && roomUUID === data.rooms?.uuid;
    return isAdmin;
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

  async kick(id: User["uuid"]) {
    UserRepository.kick(id);
  }
}

const usersService = new UsersService();
export default usersService;
