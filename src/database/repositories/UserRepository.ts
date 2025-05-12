import { db, usersTable } from "@/database";
import { CreateUserDto } from "@/database/dtos/CreateUserDtoSchema";
import { eq } from "drizzle-orm";

class UserRepository {
  static async create(dto: CreateUserDto) {
    const res = await db.insert(usersTable).values(dto).returning();
    const user = res[0];
    return user;
  }

  static async getById(id: number) {
    const res = await db.select().from(usersTable).where(eq(usersTable.id, id));
    const user = res[0];
    return user;
  }

  static async getByRoomId(roomId: number) {
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
