import { integer, json, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { roomsTable } from "./Rooms";
import { usersTable } from "./Users";

export type VoteOption = { color: string; label: string };

export const votesTable = pgTable("votes", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  value: json().$type<VoteOption>().notNull(),
  roomId: integer("room_id")
    .references(() => roomsTable.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => usersTable.id)
    .notNull(),
  round: integer("round").notNull().default(1),
});
