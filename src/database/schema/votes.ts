import { integer, json, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { players } from "./players";
import { rooms } from "./rooms";

export type VotingCard = { color: string; label: string };

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  value: json("value").$type<VotingCard>().notNull(),
  roomId: integer("room_id")
    .references(() => rooms.id)
    .notNull(),
  playerId: integer("player_id")
    .references(() => players.id)
    .notNull(),
});
