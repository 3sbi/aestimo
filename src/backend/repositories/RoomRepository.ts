import { db, roomsTable } from "@/backend/db";
import { Room } from "@/types";
import { and, eq, sql } from "drizzle-orm";

class RoomRepository {
  static async getAll(): Promise<Room[]> {
    const result = await db
      .select()
      .from(roomsTable)
      .where(eq(roomsTable.private, false));
    return result;
  }

  static async getByUUID(uuid: string): Promise<Room | undefined> {
    const result = await db
      .select()
      .from(roomsTable)
      .where(and(eq(roomsTable.uuid, uuid), eq(roomsTable.private, false)));

    const room = result.pop();
    return room;
  }

  static async getById(id: number): Promise<Room | undefined> {
    const result = await db
      .select()
      .from(roomsTable)
      .where(eq(roomsTable.id, id));
    const room = result.pop();
    return room;
  }

  static async create(dto: {
    name: string;
    voteOptions: Room["voteOptions"];
    private: boolean;
  }): Promise<Room | undefined> {
    const result = await db
      .insert(roomsTable)
      .values({
        name: dto.name,
        voteOptions: dto.voteOptions,
        private: dto.private,
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .returning();
    const room = result.pop();
    return room;
  }

  static async update(
    uuid: string,
    values: Partial<typeof roomsTable.$inferSelect>
  ): Promise<Room | undefined> {
    const result = await db
      .update(roomsTable)
      .set({
        ...values,
        updatedAt: sql`NOW()`,
      })
      .where(eq(roomsTable.uuid, uuid))
      .returning();
    const room = result.pop();
    return room;
  }

  static async delete(uuid: string) {
    const result = await db
      .delete(roomsTable)
      .where(eq(roomsTable.uuid, uuid))
      .returning();
    const room = result.pop();
    return !!room;
  }
}

export default RoomRepository;
