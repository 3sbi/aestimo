import "server-only";

import { db, voteTypesTable } from "@/database";
import { VoteOption } from "@/database/schemas/Votes";
import { sql } from "drizzle-orm";

class VoteTypesService {
  async create(voteOptions: VoteOption[]) {
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
}

export default new VoteTypesService();
