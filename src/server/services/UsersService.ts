import {
  RoomRepository,
  UserRepository,
  VoteRepository,
} from "@/server/repositories";
import { Room, User } from "../types";

class UsersService {
  async hasVoted(
    userId: number,
    roomId: number,
    round: number
  ): Promise<boolean> {
    const votes = await VoteRepository.get({ userId, roomId, round });
    return votes.length > 0;
  }

  async checkIfUserExistsInRoom(
    roomUUID: string,
    userUUID: string
  ): Promise<{ user?: User; room: Room }> {
    const room = await RoomRepository.getByUUID(roomUUID);
    const users = await UserRepository.getAllByRoomId(room.id);
    const user = users.find((user) => user.uuid === userUUID);
    return { user, room };
  }
}

const usersService = new UsersService();
export default usersService;
