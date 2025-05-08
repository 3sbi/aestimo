import "server-only";

import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { roomsTable } from "../schema/Rooms";
import { usersTable } from "../schema/Users";
import { voteTypesTable } from "../schema/VoteTypes";

class Rooms {
  async getOne(uuid: string) {
    const room = (
      await db.select().from(roomsTable).where(eq(roomsTable.uuid, uuid))
    )[0];

    return room;
  }

  async getUsers(roomId: number) {
    return db.select().from(usersTable).where(eq(usersTable.roomId, roomId));
  }

  async getVoteTypes(roomId: number) {
    const voteTypes = await db
      .select()
      .from(voteTypesTable)
      .where(eq(voteTypesTable.roomId, roomId));
    return voteTypes[0];
  }

  async openCards(roomId: number) {
    return await db
      .update(roomsTable)
      .set({
        updatedAt: sql`NOW()`,
        cardsOpened: true,
        status: "finished",
      })
      .where(eq(roomsTable.id, roomId));
  }

  async goToNextRound(roomId: number) {
    const room = (
      await db.select().from(roomsTable).where(eq(roomsTable.id, roomId))
    )[0];

    return await db
      .update(roomsTable)
      .set({
        updatedAt: sql`NOW()`,
        cardsOpened: false,
        votingRound: room.votingRound + 1,
        status: "started",
      })
      .where(eq(roomsTable.id, roomId));
  }
}

export default new Rooms();
