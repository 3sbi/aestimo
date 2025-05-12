import { db, votesTable } from "@/database";
import { and, eq } from "drizzle-orm";

class VoteRepository {
  static async get(values: { userId: number; roomId: number; round: number }) {
    const { userId, roomId, round } = values;
    const votes = await db
      .select()
      .from(votesTable)
      .where(
        and(
          eq(votesTable.userId, userId),
          eq(votesTable.roomId, roomId),
          eq(votesTable.votingRound, round)
        )
      );
    return votes;
  }
}

export default VoteRepository;
