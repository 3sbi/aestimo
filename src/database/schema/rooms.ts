import { sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const voteTypeEnum = pgEnum("voteType", ["custom", "fibonacci"]);
const statusEnum = pgEnum("status", ["started", "finished"]);

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  voteType: voteTypeEnum("voteType").notNull(),
  uuid: uuid("uuid")
    .unique()
    .notNull()
    .default(sql`gen_random_uuid()`),
  status: statusEnum("status").notNull().default("started"),
  private: boolean("private").notNull(),
});
