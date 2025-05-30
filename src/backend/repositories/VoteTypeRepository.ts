import { db, voteTypesTable } from "@/backend/db";
import type { VoteCard } from "@/types";
import { eq, sql } from "drizzle-orm";

class VoteTypeRepository {
  static async create(voteOptions: VoteCard[]) {
    const voteTypeRes = await db
      .insert(voteTypesTable)
      .values({
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
        custom: true,
        values: voteOptions,
      })
      .returning();
    const voteType = voteTypeRes[0];
    return voteType;
  }

  static async getById(id: number) {
    const res = await db
      .select()
      .from(voteTypesTable)
      .where(eq(voteTypesTable.id, id));
    const room = res[0];
    return room;
  }
}

export default VoteTypeRepository;
