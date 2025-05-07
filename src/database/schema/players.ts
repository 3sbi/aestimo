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
import { rooms } from "./rooms";

export const rolesEnum = pgEnum("role", ["admin", "basic"]);

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  roomId: integer("room_id").references(() => rooms.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: rolesEnum("role").notNull().default("basic"),
  uuid: uuid("uuid")
    .unique()
    .notNull()
    .default(sql`gen_random_uuid()`),
});