import { roomsTable, usersTable, voteTypesTable, votesTable } from "@/database";

type Room = typeof roomsTable.$inferSelect;
type User = typeof usersTable.$inferSelect;
type VoteType = typeof voteTypesTable.$inferSelect;
type Vote = typeof votesTable.$inferSelect;

export type { Room, User, VoteType, Vote };
