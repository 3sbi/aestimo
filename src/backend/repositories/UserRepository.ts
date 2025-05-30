import { db, roomsTable, usersTable } from "@/backend/db";
import { eq, sql } from "drizzle-orm";
import { CreateUserDto } from "../dtos/CreateUserDtoSchema";

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

  static async getByUUID(uuid: string) {
    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.uuid, uuid))
      .leftJoin(roomsTable, eq(usersTable.roomId, roomsTable.id));
    return res.pop();
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
