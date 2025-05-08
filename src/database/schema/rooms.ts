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

const voteTypeEnum = pgEnum("voteType", ["custom", "fibonacci"]);
const statusEnum = pgEnum("status", ["started", "finished"]);

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  voteType: voteTypeEnum("voteType").notNull(),
  uuid: uuid()
    .unique()
    .notNull()
    .default(sql`gen_random_uuid()`),
  status: statusEnum("status").notNull().default("started"),
  votingRound: integer().notNull().default(1),
  cardsOpened: boolean().notNull(),
  private: boolean("private").notNull(),
});
