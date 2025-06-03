import { ClientRoom, ClientUser, ClientVote } from ".";

export type NextRoundEvent = {
  type: "next-round";
  data: { room: ClientRoom; prevRoundVotes: ClientVote[] };
};

export type RestartEvent = {
  type: "restart";
  data: { room: ClientRoom; users: ClientUser[] };
};

export type RevealEvent = { type: "reveal"; data: ClientUser[] };

export type Event =
  | { type: "join"; data: ClientUser }
  | NextRoundEvent
  | RestartEvent
  | RevealEvent
  | { type: "kick"; data: { userId: number } }
  | { type: "delete-room" }
  | { type: "vote"; data: ClientUser };
