import {
  roomsTable,
  usersTable,
  voteTypesTable,
  votesTable,
} from "@/backend/db";

export type Room = typeof roomsTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;
export type VoteType = typeof voteTypesTable.$inferSelect;
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
  vote?: VoteCard;
};

export type WSMessage =
  | { type: "vote"; userId: number; vote: string }
  | { type: "reveal" }
  | { type: "join"; userId: number }
  | { type: "leave"; userId: number };
