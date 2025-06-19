import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
import { roomsTable } from "./Rooms";

export const rolesEnum = pgEnum("role", ["admin", "basic"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: varchar("name", { length: 256 }).notNull(),
  roomId: integer("room_id")
    .references(() => roomsTable.id, { onDelete: "cascade" })
    .notNull(),
  role: rolesEnum().notNull().default("basic"),
  deleted: boolean("deleted").notNull().default(false),
});
