import { db, roomsTable, usersTable } from "@/backend/db";
import { Room, User } from "@/types";
import { and, eq, sql } from "drizzle-orm";
import { CreateUserDto } from "../dtos/CreateUserDtoSchema";

class UserRepository {
  static async create(dto: CreateUserDto): Promise<User | undefined> {
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
    return user;
  }

  static async getByUUID(
    uuid: string
  ): Promise<{ users: User; rooms: Room | null } | undefined> {
    const res = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.uuid, uuid), eq(usersTable.kicked, false)))
      .leftJoin(roomsTable, eq(usersTable.roomId, roomsTable.id));
    const data = res.pop();
    return data;
  }

  static async getById(id: number): Promise<User | undefined> {
    const res = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, id), eq(usersTable.kicked, false)));
    const user = res.pop();
    return user;
  }

  static async getAllByRoomId(roomId: number): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.roomId, roomId), eq(usersTable.kicked, false)));
  }

  static async kick(id: number): Promise<User | undefined> {
    const res = await db
      .update(usersTable)
      .set({ kicked: true })
      .where(eq(usersTable.id, id))
      .returning();
    const user = res.pop();
    return user;
  }
}

export default UserRepository;
