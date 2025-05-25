"use client";

import type { ClientRoom, ClientUser, User, VoteCard } from "@/backend/types";
import React, { useState } from "react";
import CardsHand from "./CardsHand";
import Toolbar from "./Toolbar";
import UsersList from "./UsersList";

type Props = {
  initialRoom: ClientRoom;
  initialUsersList: ClientUser[];
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
  const [usersList, setUsersList] = useState<ClientUser[]>(
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
      <UsersList usersList={usersList} />
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
        setUsersList={setUsersList}
      />
    </>
  );
};
