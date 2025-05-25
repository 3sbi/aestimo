import "server-only";

import { RoomRepository, UserRepository } from "@/backend/repositories";
import { Room, User } from "../types";

class UsersService {
  async getOne(userUUID: string): Promise<User | undefined> {
    return UserRepository.getByUUID(userUUID);
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
