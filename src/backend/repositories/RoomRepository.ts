import { db, roomsTable } from "@/backend/db";
import { CreateRoomDto } from "@/backend/dtos";
import { Room } from "@/types";
import { and, eq, sql } from "drizzle-orm";

class RoomRepository {
  static async getAll(): Promise<Room[]> {
    const result = await db.select().from(roomsTable);
    return result;
  }

  static async getBySlug(slug: Room["slug"]): Promise<Room | undefined> {
    const result = await db
      .select()
      .from(roomsTable)
      .where(and(eq(roomsTable.slug, slug)));

    const room = result.pop();
    return room;
  }

  static async getById(id: Room["id"]): Promise<Room | undefined> {
    const result = await db
      .select()
      .from(roomsTable)
      .where(eq(roomsTable.id, id));
    const room = result.pop();
    return room;
  }

  static async create(
    dto: Omit<CreateRoomDto, "prefix" | "username"> & { slug: string }
  ): Promise<Room | undefined> {
    const result = await db
      .insert(roomsTable)
      .values({
        ...dto,
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .returning();
    const room = result.pop();
    return room;
  }

  static async update(
    slug: Room["slug"],
    values: Partial<typeof roomsTable.$inferSelect>
  ): Promise<Room | undefined> {
    const result = await db
      .update(roomsTable)
      .set({
        ...values,
        updatedAt: sql`NOW()`,
      })
      .where(eq(roomsTable.slug, slug))
      .returning();
    const room = result.pop();
    return room;
  }

  static async delete(slug: Room["slug"]) {
    const result = await db
      .delete(roomsTable)
      .where(eq(roomsTable.slug, slug))
      .returning();
    const room = result.pop();
    return !!room;
  }
}

export default RoomRepository;
