import { db, usersTable, votesTable } from "@/backend";
import type { VoteCard } from "@/backend/types";
import { and, eq } from "drizzle-orm";

class VoteRepository {
  static async create(roomId: number, userId: number, value: VoteCard) {
    const vote = await db
      .insert(votesTable)
      .values({ roomId, userId, value })
      .returning();

    return vote.pop();
  }

  static async getAllRoundVotes(
    roomId: number,
    round: number
  ): Promise<{ userId: number; name: string | null; value: VoteCard }[]> {
    const votes = await db
      .select({
        userId: votesTable.userId,
        name: usersTable.name,
        value: votesTable.value,
      })
      .from(votesTable)
      .where(and(eq(votesTable.roomId, roomId), eq(votesTable.round, round)))
      .leftJoin(usersTable, eq(votesTable.userId, usersTable.id));
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
