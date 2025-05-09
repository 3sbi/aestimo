import "server-only";

import { eq, sql } from "drizzle-orm";
import { db, roomsTable, usersTable, voteTypesTable } from "../database";

class Rooms {
  async getOne(uuid: string) {
    const room = (
      await db.select().from(roomsTable).where(eq(roomsTable.uuid, uuid))
    ).shift();

    return room;
  }

  async deleteRoom(values) {
    const room = await db.insert(roomsTable).values(values);
  }

  async getUsers(roomId: number) {
    return db.select().from(usersTable).where(eq(usersTable.roomId, roomId));
  }

  async getVoteTypes(roomId: number) {
    const rooms = await db
      .select({ voteTypeId: roomsTable.votyTypeId })
      .from(roomsTable)
      .where(eq(roomsTable.id, roomId));
    const { voteTypeId } = rooms[0];
    const voteTypes = await db
      .select()
      .from(voteTypesTable)
      .where(eq(voteTypesTable.id, voteTypeId));
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
    ).shift();
    if (room) {
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

  async changeRoomPrivacy(id: number, newPrivacyState: boolean) {
    const room = (
      await db
        .update(roomsTable)
        .set({
          updatedAt: sql`NOW()`,
          private: newPrivacyState,
        })
        .where(eq(roomsTable.id, id))
        .returning()
    ).shift();
    return room;
  }
}

export default new Rooms();
