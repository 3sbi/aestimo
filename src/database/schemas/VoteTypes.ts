import {
  boolean,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { VotingCard } from "./Votes";

export const voteTypesTable = pgTable("vote_types", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  values: json().$type<VotingCard[]>().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  custom: boolean().notNull(),
});
