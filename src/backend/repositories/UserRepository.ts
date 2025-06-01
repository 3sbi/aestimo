import { db, roomsTable, usersTable } from "@/backend/db";
import { Room, User } from "@/types";
import { and, eq, sql } from "drizzle-orm";
import { CreateUserDto } from "../dtos/CreateUserDtoSchema";
import { UserNotFoundError } from "../errors";

class UserRepository {
  static async create(dto: CreateUserDto): Promise<User> {
    const res = await db
      .insert(usersTable)
      .values({
        ...dto,
        connected: true,
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .returning();
    const user = res.pop();
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  static async getByUUID(
    uuid: string
  ): Promise<{ users: User; rooms: Room | null }> {
    const res = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.uuid, uuid), eq(usersTable.kicked, false)))
      .leftJoin(roomsTable, eq(usersTable.roomId, roomsTable.id));
    const data = res.pop();
    if (!data) {
      throw new UserNotFoundError();
    }
    return data;
  }

  static async getById(id: number): Promise<User> {
    const res = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, id), eq(usersTable.kicked, false)));
    const user = res.pop();
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  static async getAllByRoomId(roomId: number): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.roomId, roomId), eq(usersTable.kicked, false)));
  }

  static async kick(uuid: string): Promise<User> {
    const res = await db
      .update(usersTable)
      .set({ kicked: true })
      .where(eq(usersTable.uuid, uuid))
      .returning();
    const user = res.pop();
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }
}

export default UserRepository;
