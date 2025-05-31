"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientRoom, ClientUser, User, VoteCard } from "@/types";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import CardsHand from "./CardsHand";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import { UsersList } from "./UsersList";

type EventData =
  | { type: "vote"; data: ClientUser }
  | {
      type: "reveal";
      data: { userId: number; name: string | null; vote: VoteCard }[];
    }
  | { type: "restart"; data: { room: ClientRoom; users: ClientUser[] } }
  | { type: "join"; data: ClientUser };

type Props = {
  initialRoom: ClientRoom;
  initialUsersList: ClientUser[];
  initialSelectedIndex: number | null;
  voteOptions: VoteCard[];
  user: Pick<User, "id" | "role">;
  i18n: Dictionary["room"];
};

export const RoomWrapper: React.FC<Props> = ({
  initialRoom,
  initialSelectedIndex,
  initialUsersList,
  i18n,
  voteOptions,
  user,
}) => {
  const [room, setRoom] = useState<ClientRoom>(initialRoom);
  const [usersList, setUsersList] = useState<ClientUser[]>(initialUsersList);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialSelectedIndex
  );

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${room.uuid}/events`);

    eventSource.onmessage = (event) => {
      const { type, data }: EventData = JSON.parse(event.data);
      if (type === "vote") {
        setUsersList((prev) => {
          const index = prev.findIndex((user) => user.id === data.id);
          prev[index].voted = true;
          return [...prev];
        });
      } else if (type === "reveal") {
        setUsersList((prev) => {
          const newUsersList: ClientUser[] = [];
          for (const user of prev) {
            const vote = data.find((vote) => vote.userId === user.id)?.vote;
            newUsersList.push({
              ...user,
              vote,
              voted: true,
            });
          }
          return newUsersList;
        });
      } else if (type === "restart") {
        setRoom(data.room);
        setUsersList(data.users);
      } else if (type === "join") {
        setUsersList((prev) => [...prev, data]);
      }
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
      const index = prev.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        prev[index].voted = voted;
      }
      return [...prev];
    });
  };

  const isAdmin: boolean = user.role === "admin";
  return (
    <div className="room">
      <Toaster />
      <Header room={room} i18n={i18n.header} />
      <UsersList
        usersList={usersList}
        currentUserId={user.id}
        i18n={i18n.usersList}
        isAdmin={isAdmin}
      />
      <CardsHand
        voteOptions={voteOptions}
        room={room}
        userId={user.id}
        setVoted={setVoted}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      {isAdmin && (
        <Toolbar
          i18n={i18n.toolbar}
          room={room}
          setRoom={setRoom}
          setUsersList={setUsersList}
          setSelectedIndex={setSelectedIndex}
        />
      )}
    </div>
  );
};
