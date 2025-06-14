import "server-only";

import {
  RoomRepository,
  UserRepository,
  VoteRepository,
} from "@/backend/repositories";
import { Room, User } from "@/types";
import { TransferAdminRightsDto } from "../dtos";
import { RoomNotFoundError, UserNotFoundError } from "../errors";
import { UserNotAdminError } from "../errors/Users";
import { getSession } from "../session";

class UsersService {
  async getOne(id: User["id"]): Promise<User> {
    const user = await UserRepository.getById(id);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  async getOneByUUID(uuid: User["uuid"]): Promise<User> {
    const user = await UserRepository.getByUUID(uuid);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user.users;
  }

  async isAdmin(): Promise<{ isAdmin: boolean; userUUID: User["uuid"] }> {
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
    return { isAdmin, userUUID };
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

  /* basically soft-delete */
  async leave(id: User["id"]): Promise<User> {
    const user = await UserRepository.update(id, { deleted: false });
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  async transferAdminRights(data: TransferAdminRightsDto): Promise<User> {
    const { newAdminId, oldAdminId } = data;
    const oldAdmin = await UserRepository.getById(oldAdminId);
    const newAdmin = await UserRepository.getById(newAdminId);
    if (!oldAdmin || !newAdmin) {
      throw new UserNotFoundError();
    }

    if (oldAdmin?.roomId !== newAdmin?.roomId) {
      // if user is from another room, it is basically not found, isn't it? =)
      throw new UserNotFoundError();
    }

    if (oldAdmin.role !== "admin") {
      throw new UserNotAdminError();
    }

    await UserRepository.update(oldAdmin.id, { role: "basic" });
    const user = await UserRepository.update(newAdmin.id, { role: "admin" });
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  async update(
    id: User["id"],
    data: Partial<Pick<User, "name">>
  ): Promise<User> {
    const user = await UserRepository.update(id, data);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }
}

const usersService = new UsersService();
export default usersService;
