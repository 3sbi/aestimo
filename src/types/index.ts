import { roomsTable, usersTable, votesTable } from "@/server/db";
import { ClientUserSchema } from "@/server/dtos/ClientUserSchema";
import { z } from "zod";

export type Room = typeof roomsTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;
export type Vote = typeof votesTable.$inferSelect;
export type VoteCard = { color: string; value: string };

// for client-side only
export type ClientRoom = Pick<
  Room,
  "private" | "status" | "name" | "round" | "slug" | "autoreveal"
>;

export type ClientUser = z.infer<typeof ClientUserSchema>;

export type ClientVote = {
  userId: number;
  userName: string | null;
  option: VoteCard;
};
