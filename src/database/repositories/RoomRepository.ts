import { db, roomsTable } from "@/database";
import { and, eq, sql } from "drizzle-orm";

class RoomRepository {
  static async getByUUID(uuid: string) {
    const res = await db
      .select()
      .from(roomsTable)
      .where(and(eq(roomsTable.uuid, uuid), eq(roomsTable.private, false)));

    const room = res[0];
    return room;
  }

  static async getById(id: number) {
    const res = await db.select().from(roomsTable).where(eq(roomsTable.id, id));
    const room = res[0];
    return room;
  }

  static async create(dto: { name: string; voteTypeId: number }) {
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
    id: number,
    values: Partial<typeof roomsTable.$inferSelect>
  ) {
    const res = await db
      .update(roomsTable)
      .set({
        ...values,
        updatedAt: sql`NOW()`,
      })
      .where(eq(roomsTable.id, id))
      .returning();
    const room = res[0];
    return room;
  }
}

export default RoomRepository;
