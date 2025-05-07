import { json, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import type { VotingCard } from "./votes";

export const voteTypes = pgTable("vote_types", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  values: json("values").$type<VotingCard[]>().notNull(),
});
