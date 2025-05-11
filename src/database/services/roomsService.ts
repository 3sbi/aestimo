import "server-only";

import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db, roomsTable, usersTable, voteTypesTable } from "..";
import usersService from "./usersService";
import voteTypesService from "./voteTypesService";

export class RoomsService {
  CreateRoomDtoSchema = z.object({
    name: z.string(),
    username: z.string(),
    voteOptions: z.array(
      z.object({
        color: z.string(),
        label: z.string(),
      })
    ),
  });

  JoinRoomDtoSchema = z.object({
    username: z.string(),
    uuid: z.string(),
  });

  async getOne(uuid: string) {
    const room = (
      await db.select().from(roomsTable).where(eq(roomsTable.uuid, uuid))
    ).shift();

    return room;
  }

  async createRoom(values: z.infer<typeof this.CreateRoomDtoSchema>) {
    const { username, name, voteOptions } = values;
    const voteType = await voteTypesService.create(voteOptions);
    const res = await db
      .insert(roomsTable)
      .values({
        createdAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
        name,
        votyTypeId: voteType.id,
      })
      .returning();
    const room = res[0];

    const user = await usersService.create(room.id, username, "admin");
    return { room, user };
  }

  async joinRoom(values: z.infer<typeof this.JoinRoomDtoSchema>) {
    const { uuid, username } = values;
    const room = await this.getOne(uuid);
    if (!room) return null;

    const user = await usersService.create(room.id, username, "basic");
    return { room, user };
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
    const res = await db
      .update(roomsTable)
      .set({
        updatedAt: sql`NOW()`,
        status: "finished",
      })
      .where(eq(roomsTable.id, roomId))
      .returning();
    const room = res[0];
    return room;
  }

  async goToNextRound(roomId: number) {
    const room = (
      await db.select().from(roomsTable).where(eq(roomsTable.id, roomId))
    ).shift();
    if (!room) return null;

    const res = await db
      .update(roomsTable)
      .set({
        updatedAt: sql`NOW()`,
        votingRound: room.votingRound + 1,
        status: "started",
      })
      .where(eq(roomsTable.id, roomId))
      .returning();
    return res[0];
  }

  async changeRoomPrivacy(id: number, newPrivacyState: boolean) {
    const res = await db
      .update(roomsTable)
      .set({
        updatedAt: sql`NOW()`,
        private: newPrivacyState,
      })
      .where(eq(roomsTable.id, id))
      .returning();
    const room = res.shift();
    return room;
  }
}

export default new RoomsService();
