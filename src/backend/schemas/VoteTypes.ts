import type { VoteCard } from "@/types/index";
import {
    boolean,
    json,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const voteTypesTable = pgTable("vote_types", {
  id: serial().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: varchar({ length: 255 }),
  values: json().$type<VoteCard[]>().notNull(),
  custom: boolean().notNull(),
});
