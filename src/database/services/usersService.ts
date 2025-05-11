import "server-only";

import { and, eq } from "drizzle-orm";
import { db, roomsTable, usersTable, votesTable } from "..";

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

  async create(
    roomId: number,
    name: string,
    role: typeof usersTable.$inferSelect.role
  ) {
    const res = await db
      .insert(usersTable)
      .values({ name, role, roomId })
      .returning();
    const user = res[0];
    return user;
  }

  async getRoom(roomUUID: string) {
    const res = await db
      .select()
      .from(roomsTable)
      .where(and(eq(roomsTable.uuid, roomUUID), eq(roomsTable.private, false)));
    const room = res[0];
    return room;
  }
}

export default new Users();
