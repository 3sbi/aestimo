import type { ClientRoom, ClientUser, ClientVote, User } from ".";

type RoundHistory = { votes: ClientVote[]; endedAt: number }

export type NextRoundEvent = {
  type: "next-round";
  data: {
    room: ClientRoom;
    prevRound: RoundHistory;
  };
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
  | { type: "kick"; data: { userId: User["id"] } }
  | {
      type: "user-update";
      data: {
        userId: User["id"];
        update: Partial<Pick<ClientUser, "name" | "connected">>;
      };
    }
  | { type: "room-delete" }
  | { type: "vote"; data: ClientUser }
  | { type: "transfer-admin"; data: { newAdminId: ClientUser["uuid"] } }
  | { type: "room-update"; data: { room: ClientRoom } };
