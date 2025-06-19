import { VoteCard } from "@/types";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("room_status", ["started", "finished"]);

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: varchar({ length: 255 }).notNull(),
  voteOptions: json("vote_values").$type<VoteCard[]>().notNull(),
  status: statusEnum().notNull().default("started"),
  round: integer().notNull().default(1),
  password: varchar({ length: 255 }),
  slug: varchar({ length: 255 }).unique().notNull(),
  private: boolean().notNull().default(false), // defines if room can be joined or not. Defaults to being open to join
});
