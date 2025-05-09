import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { roomsTable } from "./Rooms";

const rolesEnum = pgEnum("role", ["admin", "basic"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  roomId: integer().references(() => roomsTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  role: rolesEnum().notNull().default("basic"),
  uuid: uuid()
    .unique()
    .notNull()
    .default(sql`gen_random_uuid()`),
});
