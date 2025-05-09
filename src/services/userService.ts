import "server-only";

import { and, eq } from "drizzle-orm";
import { db, roomsTable, usersTable, votesTable } from "../database";

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

  async createRoom(roomName: string, userName: string) {
    const room = (
      await db.insert(roomsTable).values({ name: roomName }).returning()
    ).pop();

    const user = (
      await db
        .insert(usersTable)
        .values({ name: userName, role: "admin" })
        .returning()
    ).pop();

    return { room, user };
  }

  async getRoom(roomUUID: string, userName: string) {
    const room = (
      await db
        .select()
        .from(roomsTable)
        .where(
          and(eq(roomsTable.uuid, roomUUID), eq(roomsTable.private, false))
        )
    ).shift();
    return room;
  }
}

export default new Users();
