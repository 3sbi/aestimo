import { db, usersTable, votesTable } from "@/server/db";
import type { ClientVote, Room, User, Vote, VoteCard } from "@/types";
import { and, eq, sql } from "drizzle-orm";

class VoteRepository {
  static async getOne(
    roomId: Room["id"],
    round: Room["round"],
    userId: User["id"]
  ) {
    const vote = await db
      .select()
      .from(votesTable)
      .where(
        and(
          eq(votesTable.roomId, roomId),
          eq(votesTable.round, round),
          eq(votesTable.userId, userId)
        )
      );
    return vote.pop();
  }

  static async update(id: Room["id"], value: VoteCard, round: Room["round"]) {
    const vote = await db
      .update(votesTable)
      .set({
        value,
        round,
        updatedAt: sql`NOW()`,
      })
      .where(eq(votesTable.id, id))
      .returning();
    return vote.pop();
  }

  static async create(
    roomId: Room["id"],
    userId: User["id"],
    value: VoteCard,
    round: Room["round"]
  ): Promise<Vote | undefined> {
    const vote = await db
      .insert(votesTable)
      .values({ roomId, userId, value, round })
      .returning();
    return vote.pop();
  }

  static async getAllRoundVotes(
    roomId: Room["id"],
    round: Room["round"]
  ): Promise<ClientVote[]> {
    const votes = await db
      .select({
        userId: votesTable.userId,
        userName: usersTable.name,
        option: votesTable.value,
      })
      .from(votesTable)
      .where(and(eq(votesTable.roomId, roomId), eq(votesTable.round, round)))
      .leftJoin(usersTable, eq(votesTable.userId, usersTable.id));
    return votes;
  }

  static async getAllVotes(
    roomId: Room["id"]
  ): Promise<Array<ClientVote & { round: Room["round"] }>> {
    const votes = await db
      .select({
        userId: votesTable.userId,
        userName: usersTable.name,
        option: votesTable.value,
        round: votesTable.round,
      })
      .from(votesTable)
      .where(eq(votesTable.roomId, roomId))
      .leftJoin(usersTable, eq(votesTable.userId, usersTable.id));
    return votes;
  }

  static async deleteAll(roomId: Room["id"], round: Room["round"]) {
    await db
      .delete(votesTable)
      .where(and(eq(votesTable.roomId, roomId), eq(votesTable.round, round)));
    return true;
  }
}

export default VoteRepository;
