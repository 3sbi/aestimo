"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import type {
  ClientRoom,
  ClientUser,
  ClientVote,
  User,
  Vote,
  VoteCard,
} from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import CardsHand from "./CardsHand";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import { UsersList } from "./UsersList";

type EventData =
  | { type: "join"; data: ClientUser }
  | {
      type: "next-round";
      data: { room: ClientRoom; roundVoteHistory: ClientVote[] };
    }
  | { type: "restart"; data: { room: ClientRoom; users: ClientUser[] } }
  | {
      type: "reveal";
      data: ClientVote[];
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
  initialVotesHistory: Record<Vote["round"], ClientVote[]>;
};

export const RoomWrapper: React.FC<Props> = ({
  initialRoom,
  initialVotesHistory,
  initialSelectedIndex,
  initialUsersList,
  i18n,
  voteOptions,
  user,
}) => {
  const router = useRouter();
  const [room, setRoom] = useState<ClientRoom>(initialRoom);
  const [votesHistory, setVotesHistory] =
    useState<Record<Vote["round"], ClientVote[]>>(initialVotesHistory);
  const [users, setUsers] = useState<ClientUser[]>(initialUsersList);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialSelectedIndex
  );
  const [disconnected, setDisconnected] = useState<boolean>(false);

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${room.uuid}/events`);

    eventSource.onmessage = (event) => {
      const eventPayload: EventData = JSON.parse(event.data);
      switch (eventPayload.type) {
        case "join": {
          const newUser = eventPayload.data;
          setUsers((prev) => [...prev, newUser]);
          break;
        }
        case "next-round": {
          const { room: newRoom, roundVoteHistory } = eventPayload.data;
          setVotesHistory((prev) => {
            prev[room.round] = roundVoteHistory;
            return { ...prev };
          });
          setRoom(newRoom);
          setUsers((prev) => {
            prev = prev.map(({ id, name, role }) => ({
              id,
              name,
              role,
              vote: null,
              voted: false,
            }));
            return prev;
          });
          break;
        }
        case "restart": {
          const { room, users } = eventPayload.data;
          setRoom(room);
          setUsers(users);
          break;
        }
        case "reveal": {
          const data = eventPayload.data;
          setRoom((prev) => {
            prev.status = "finished";
            return prev;
          });
          setUsers((prev) => {
            const newUsersList: ClientUser[] = [];
            for (const user of prev) {
              const vote = data.find((vote) => vote.userId === user.id)?.option;
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
          setUsers((users) => users.filter((p) => p.id !== userId));
          if (user.id === userId) {
            router.replace("/");
          }
          break;
        }
        case "delete-room": {
          router.replace("/");
          break;
        }
        case "vote": {
          const user = eventPayload.data;
          setUsers((prev) => {
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
    eventSource.onopen = () => {
      if (disconnected) {
        toast.success(i18n.toast.reconnected);
        setDisconnected(false);
      }
    };
    eventSource.onerror = () => {
      toast.error(i18n.toast.disconnected);
      setDisconnected(true);
    };

    return () => {
      eventSource.close();
    };
  }, [room.uuid, room.round, router, user.id, i18n, disconnected]);

  const setVoted = (voted: boolean) => {
    setUsers((prev) => {
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
      <Header
        room={room}
        i18n={i18n.header}
        votesHistory={votesHistory}
        user={user}
      />
      <UsersList
        users={users}
        setUsers={setUsers}
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
          setUsers={setUsers}
          setSelectedIndex={setSelectedIndex}
          setVotesHistory={setVotesHistory}
        />
      )}
    </div>
  );
};
