"use client";

import type { ClientRoom, User, VoteCard } from "@/backend/types";
import React, { useState } from "react";
import CardsHand from "./CardsHand";
import Toolbar from "./Toolbar";

type UserListState = {
  id: number;
  name: string;
  voted: boolean;
  value?: VoteCard;
}[];

type Props = {
  initialRoom: ClientRoom;
  initialUsersList: UserListState;
  cards: VoteCard[];
  user: Pick<User, "id" | "role">;
  i18n: {
    header: {
      round: string;
    };
    toolbar: {
      reveal: string;
      delete: string;
      restart: string;
      leave: string;
      invite: string;
      history: string;
    };
  };
};

export const RoomWrapper: React.FC<Props> = (props) => {
  const [room, setRoom] = useState<ClientRoom>(props.initialRoom);
  const [usersList, setUsersList] = useState<UserListState>(
    props.initialUsersList
  );

  const setVoted = (voted: boolean) => {
    setUsersList((prev) => {
      const index = prev.findIndex((user) => user.id === props.user.id);
      if (index !== -1) {
        prev[index].voted = voted;
      }
      return [...prev];
    });
  };

  const i18n = props.i18n;
  return (
    <>
      <div className="card flex gap-1">
        <h2>{room.name}</h2>|
        <div>
          {i18n.header.round}:{room.round}
        </div>
      </div>

      <div className="card">
        {usersList.map((user) => {
          if (user.value) {
            const { color, label } = user.value;
            return (
              <div key={user.id} style={{ backgroundColor: color }}>
                <div>{label}</div>
                <h2>{user.name}</h2>
              </div>
            );
          }
          return (
            <div key={user.id}>
              <div>{user.voted ? "🗳️" : "🤔"}</div>
              <h2>{user.name}</h2>
            </div>
          );
        })}
      </div>

      <CardsHand
        cards={props.cards}
        roomUUID={room.uuid}
        userId={props.user.id}
        setVoted={setVoted}
      />

      <Toolbar
        i18n={i18n.toolbar}
        role={props.user.role}
        roomUUID={room.uuid}
        setRoom={setRoom}
      />
    </>
  );
};
