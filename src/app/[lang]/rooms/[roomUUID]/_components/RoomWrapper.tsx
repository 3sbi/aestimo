"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientRoom, ClientUser, User, VoteCard } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import CardsHand from "./CardsHand";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import { UsersList } from "./UsersList";

type EventData =
  | { type: "join"; data: ClientUser }
  | { type: "next-round"; data: ClientRoom }
  | { type: "restart"; data: { room: ClientRoom; users: ClientUser[] } }
  | {
      type: "reveal";
      data: { userId: number; name: string | null; vote: VoteCard }[];
    }
  | { type: "kick"; data: { userId: number } }
  | { type: "delete-room" }
  | { type: "vote"; data: ClientUser };

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
  const router = useRouter();
  const [room, setRoom] = useState<ClientRoom>(initialRoom);
  const [players, setPlayers] = useState<ClientUser[]>(initialUsersList);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialSelectedIndex
  );

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${room.uuid}/events`);

    eventSource.onmessage = (event) => {
      const eventPayload: EventData = JSON.parse(event.data);
      switch (eventPayload.type) {
        case "join": {
          const newUser = eventPayload.data;
          setPlayers((prev) => [...prev, newUser]);
          break;
        }
        case "next-round": {
          const room = eventPayload.data;
          setRoom(room);
          break;
        }
        case "restart": {
          const { room, users } = eventPayload.data;
          setRoom(room);
          setPlayers(users);
          break;
        }
        case "reveal": {
          const data = eventPayload.data;
          setPlayers((prev) => {
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
          break;
        }
        case "kick": {
          const { userId } = eventPayload.data;
          setPlayers((users) => users.filter((p) => p.id !== userId));
          break;
        }
        case "delete-room": {
          router.replace("/");
          break;
        }
        case "vote": {
          const user = eventPayload.data;
          setPlayers((prev) => {
            const index = prev.findIndex((u) => u.id === user.id);
            prev[index].voted = true;
            return [...prev];
          });
          break;
        }
        default: {
          const message = `${i18n.toast["unknown-event"]}: ${eventPayload?.["type"]}`;
          toast.warning(message);
        }
      }
    };

    eventSource.onerror = () => {
      toast.error(i18n.toast.disconnect);
    };

    return () => {
      eventSource.close();
    };
  }, [room.uuid, router, i18n]);

  const setVoted = (voted: boolean) => {
    setPlayers((prev) => {
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
      <Toaster richColors />
      <Header room={room} i18n={i18n.header} />
      <UsersList
        players={players}
        setPlayers={setPlayers}
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
          setPlayers={setPlayers}
          setSelectedIndex={setSelectedIndex}
        />
      )}
    </div>
  );
};
