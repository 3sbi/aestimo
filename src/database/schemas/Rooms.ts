import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { voteTypesTable } from "./VoteTypes";

const statusEnum = pgEnum("status", ["started", "finished"]);

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  votyTypeId: integer()
    .references(() => voteTypesTable.id)
    .notNull(),
  uuid: uuid()
    .unique()
    .notNull()
    .default(sql`gen_random_uuid()`),
  status: statusEnum("status").notNull().default("started"),
  votingRound: integer().notNull().default(1),
  cardsOpened: boolean().notNull().default(false),
  password: varchar({ length: 255 }).notNull(),

  // defines if room can be joined or not. Defaults to being open to join
  private: boolean().notNull().default(false),
});
