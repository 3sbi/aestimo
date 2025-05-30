"use client";

import type { ClientRoom, ClientUser, User, VoteCard } from "@/backend/types";
import React, { createContext, useEffect, useState } from "react";
import CardsHand from "./CardsHand";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import UsersList from "./UsersList";
import { Toaster, toast } from "sonner";

type Props = {
  initialRoom: ClientRoom;
  initialUsersList: ClientUser[];
  initialSelectedIndex: number | null;
  cards: VoteCard[];
  user: Pick<User, "id" | "role">;
  i18n: {
    header: {
      round: string;
      copy: string;
    };
    toolbar: {
      next: string;
      reveal: string;
      restart: string;
      delete: string;
    };
  };
};

export const RoomWrapper: React.FC<Props> = (props) => {
  const [room, setRoom] = useState<ClientRoom>(props.initialRoom);
  const [usersList, setUsersList] = useState<ClientUser[]>(
    props.initialUsersList
  );

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${props.initialRoom.uuid}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      toast.info(event.data);
    };

    eventSource.onerror = () => {
      toast.warning("SSE connection lost, reconnecting...");
    };

    return () => {
      eventSource.close();
    };
  }, [room.uuid]);

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
  const isAdmin: boolean = props.user.role === "admin";
  return (
    <div className="room">
      <Toaster />
      <Header room={room} i18n={i18n.header} />
      <UsersList usersList={usersList} />
      <CardsHand
        cards={props.cards}
        roomUUID={room.uuid}
        userId={props.user.id}
        setVoted={setVoted}
        initialSelectedIndex={props.initialSelectedIndex}
      />

      {isAdmin && (
        <Toolbar
          i18n={i18n.toolbar}
          room={room}
          setRoom={setRoom}
          setUsersList={setUsersList}
        />
      )}
    </div>
  );
};
