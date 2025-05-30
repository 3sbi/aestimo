import { db, roomsTable } from "@/backend/db";
import { and, eq, sql } from "drizzle-orm";
import { Room } from "../../types";

class RoomRepository {
  static async getByUUID(uuid: string): Promise<Room | undefined> {
    const res = await db
      .select()
      .from(roomsTable)
      .where(and(eq(roomsTable.uuid, uuid), eq(roomsTable.private, false)));

    const room = res.pop();
    return room;
  }

  static async getById(id: number): Promise<Room | undefined> {
    const res = await db.select().from(roomsTable).where(eq(roomsTable.id, id));
    const room = res[0];
    return room;
  }

  static async create(dto: {
    name: string;
    voteTypeId: number;
  }): Promise<Room | undefined> {
    const res = await db
      .insert(roomsTable)
      .values({
        name: dto.name,
        votyTypeId: dto.voteTypeId,
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .returning();
    const room = res[0];
    return room;
  }

  static async update(
    uuid: string,
    values: Partial<typeof roomsTable.$inferSelect>
  ): Promise<Room | undefined> {
    const res = await db
      .update(roomsTable)
      .set({
        ...values,
        updatedAt: sql`NOW()`,
      })
      .where(eq(roomsTable.uuid, uuid))
      .returning();
    const room = res[0];
    return room;
  }

  static async delete(uuid: string) {
    await db.delete(roomsTable).where(eq(roomsTable.uuid, uuid));
    return true;
  }
}

export default RoomRepository;
