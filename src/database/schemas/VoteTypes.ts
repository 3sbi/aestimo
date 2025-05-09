import { integer, json, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { roomsTable } from "./Rooms";
import type { VotingCard } from "./Votes";

export const voteTypesTable = pgTable("vote_types", {
  id: serial().primaryKey(),
  values: json().$type<VotingCard[]>().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  roomId: integer().references(() => roomsTable.id),
});
