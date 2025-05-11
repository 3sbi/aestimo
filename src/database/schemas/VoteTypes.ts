import {
  boolean,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { VoteOption } from "./Votes";

export const voteTypesTable = pgTable("vote_types", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }),
  values: json().$type<VoteOption[]>().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  custom: boolean().notNull(),
});
