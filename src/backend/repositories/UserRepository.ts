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
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .returning();
    const user = res.pop();
    return user;
  }

  static async getByUUID(
    uuid: User["uuid"]
  ): Promise<{ users: User; rooms: Room | null } | undefined> {
    const res = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.uuid, uuid), eq(usersTable.deleted, false)))
      .leftJoin(roomsTable, eq(usersTable.roomId, roomsTable.id));
    const data = res.pop();
    return data;
  }

  static async getById(id: User["id"]): Promise<User | undefined> {
    const res = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, id), eq(usersTable.deleted, false)));
    const user = res.pop();
    return user;
  }

  static async getAllByRoomId(roomId: Room["id"]): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.roomId, roomId), eq(usersTable.deleted, false)));
  }

  static async update(
    id: User["id"],
    data: Partial<Pick<User, "name" | "role" | "deleted">>
  ): Promise<User | undefined> {
    const res = await db
      .update(usersTable)
      .set({
        ...data,
        updatedAt: sql`NOW()`,
      })
      .where(eq(usersTable.id, id))
      .returning();
    const user = res.pop();
    return user;
  }
}

export default UserRepository;
