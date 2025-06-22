import "server-only";

import { TransferAdminRightsDto } from "@/server/dtos";
import { RoomNotFoundError, UserNotFoundError } from "@/server/errors";
import { UserNotAdminError } from "@/server/errors/Users";
import {
  RoomRepository,
  UserRepository,
  VoteRepository,
} from "@/server/repositories";
import { getSession } from "@/server/session";
import type { Room, User } from "@/types";

class UsersService {
  async getOne(id: User["id"]): Promise<User> {
    const user = await UserRepository.getById(id);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user.users;
  }

  async isAdmin(): Promise<{ isAdmin: boolean; userId: User["id"] }> {
    const { userId, roomSlug } = await getSession();
    if (typeof roomSlug !== "string") {
      throw new RoomNotFoundError();
    }
    if (typeof userId !== "number") {
      throw new UserNotFoundError();
    }
    const data = await UserRepository.getById(userId);
    if (!data || !data.users) {
      throw new UserNotFoundError();
    }
    const user = data.users;
    const isAdmin: boolean =
      user.role === "admin" && roomSlug === data.rooms?.slug;
    return { isAdmin, userId };
  }

  async checkIfUserExistsInRoom(
    slug: Room["slug"],
    userId: User["id"]
  ): Promise<{ user: User; room: Room }> {
    const room = await RoomRepository.getBySlug(slug);
    if (!room) {
      throw new RoomNotFoundError();
    }

    const users = await UserRepository.getAllByRoomId(room.id);
    const user = users.find((user) => user.id === userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    return { user, room };
  }

  async getVoteIndex(
    id: User["id"],
    roomId: Room["id"],
    round: Room["round"]
  ): Promise<number | null> {
    const votes = await VoteRepository.getAllRoundVotes(roomId, round);
    const index = votes.findIndex((vote) => vote.userId === id);
    if (index === -1) {
      return null;
    }
    return index;
  }

  /* basically soft-delete */
  async leave(id: User["id"]): Promise<User> {
    const user = await UserRepository.update(id, { deleted: true });
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  async transferAdminRights(data: TransferAdminRightsDto): Promise<User> {
    const { newAdminId, oldAdminId } = data;
    const oldAdmin = (await UserRepository.getById(oldAdminId))?.users;
    const newAdmin = (await UserRepository.getById(newAdminId))?.users;
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
