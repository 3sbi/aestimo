import "server-only";


import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { votesTable } from "../schema/Votes";

class Users {
  async hasVoted(
    userId: number,
    roomId: number,
    round: number
  ): Promise<boolean> {
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
    return votes.length > 0;
  }
}

export default new Users();
