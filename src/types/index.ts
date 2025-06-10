import { roomsTable, usersTable, votesTable } from "@/backend/db";

export type Room = typeof roomsTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;
export type Vote = typeof votesTable.$inferSelect;
export type VoteCard = { color: string; value: string };

// for client-side only
export type ClientRoom = Pick<
  Room,
  "private" | "status" | "name" | "round" | "uuid"
>;

export type ClientUser = {
  id: User["id"];
  name: User["name"];
  voted: boolean;
  role: User["role"];
  connected: boolean;
  vote?: VoteCard | null;
};

export type ClientVote = {
  userId: number;
  userName: string | null;
  option: VoteCard;
};
