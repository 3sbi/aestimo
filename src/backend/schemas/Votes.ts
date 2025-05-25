import { integer, json, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { VoteCard } from "../types";
import { roomsTable } from "./Rooms";
import { usersTable } from "./Users";

export const votesTable = pgTable("votes", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  value: json().$type<VoteCard>().notNull(),
  roomId: integer("room_id")
    .references(() => roomsTable.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => usersTable.id)
    .notNull(),
  round: integer("round").notNull().default(1),
});
