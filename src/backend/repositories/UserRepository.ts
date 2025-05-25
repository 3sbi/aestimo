import { db, usersTable } from "@/backend";
import { CreateUserDto } from "@/backend/dtos/CreateUserDtoSchema";
import { eq, sql } from "drizzle-orm";
import { User } from "../types";

class UserRepository {
  static async create(dto: CreateUserDto) {
    const res = await db
      .insert(usersTable)
      .values({
        ...dto,
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .returning();
    const user = res[0];
    return user;
  }

  static async getByUUID(uuid: string): Promise<User | undefined> {
    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.uuid, uuid));
    const user = res.pop();
    return user;
  }

  static async getById(id: number) {
    const res = await db.select().from(usersTable).where(eq(usersTable.id, id));
    const user = res.pop();
    return user;
  }

  static async getAllByRoomId(roomId: number) {
    return db.select().from(usersTable).where(eq(usersTable.roomId, roomId));
  }

  static async delete(id: number) {
    const res = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    const user = res[0];
    return user;
  }
}

export default UserRepository;
