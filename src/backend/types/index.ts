import { roomsTable, usersTable, voteTypesTable, votesTable } from "@/backend";

type Room = typeof roomsTable.$inferSelect;
type User = typeof usersTable.$inferSelect;
type VoteType = typeof voteTypesTable.$inferSelect;
type Vote = typeof votesTable.$inferSelect;
type VoteCard = { color: string; label: string };

// for client-side only
type ClientRoom = Pick<Room, "private" | "status" | "name" | "round" | "uuid">;
type ClientUser = {
  id: number;
  name: string;
  voted: boolean;
  value?: VoteCard;
};

export type { Room, User, Vote, VoteCard, VoteType, ClientRoom, ClientUser };
