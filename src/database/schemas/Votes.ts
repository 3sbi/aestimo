import { integer, json, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { roomsTable } from "./Rooms";
import { usersTable } from "./Users";

export type VoteOption = { color: string; label: string };

export const votesTable = pgTable("votes", {
  id: serial("id").primaryKey(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  value: json().$type<VoteOption>().notNull(),
  roomId: integer()
    .references(() => roomsTable.id)
    .notNull(),
  userId: integer()
    .references(() => usersTable.id)
    .notNull(),
  votingRound: integer().notNull().default(1),
});
