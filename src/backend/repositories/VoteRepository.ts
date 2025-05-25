import { db, votesTable } from "@/backend";
import type { VoteCard } from "@/backend/types";
import { and, eq } from "drizzle-orm";

class VoteRepository {
  static async getAllRoundVotes(
    roomId: number,
    round: number
  ): Promise<{ userId: number; value: VoteCard }[]> {
    const votes = await db
      .select({
        userId: votesTable.userId,
        value: votesTable.value,
      })
      .from(votesTable)
      .where(and(eq(votesTable.roomId, roomId), eq(votesTable.round, round)));
    return votes;
  }

  static async deleteAll(roomId: number, round: number) {
    await db
      .delete(votesTable)
      .where(and(eq(votesTable.roomId, roomId), eq(votesTable.round, round)));

    return true;
  }
}

export default VoteRepository;
