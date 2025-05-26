import "server-only";

import { RoomNotFoundError } from "@/backend/errors/Rooms";
import {
  RoomRepository,
  UserRepository,
  VoteRepository,
} from "@/backend/repositories";
import { UserNotFoundError } from "../errors/Users";
import { Room, User } from "../types";

class UsersService {
  async getOne(userUUID: string): Promise<User> {
    const user = await UserRepository.getByUUID(userUUID);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  async checkIfUserExistsInRoom(
    roomUUID: string,
    userUUID: string
  ): Promise<{ user?: User; room?: Room }> {
    const room = await RoomRepository.getByUUID(roomUUID);
    if (!room) {
      throw new RoomNotFoundError();
    }
    const users = await UserRepository.getAllByRoomId(room.id);
    const user = users.find((user) => user.uuid === userUUID);
    return { user, room };
  }

  async getVoteIndex(
    userId: number,
    roomId: number,
    round: number
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
