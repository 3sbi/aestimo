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
import type {
  Event,
  NextRoundEvent,
  RestartEvent,
  RevealEvent,
} from "@/types/EventData";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import CardsHand from "./CardsHand";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import { UsersList } from "./UsersList";

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

  const goToNextRound = useCallback(
    (data: NextRoundEvent["data"]) => {
      const { room: newRoom, prevRoundVotes } = data;
      setVotesHistory((prev) => {
        prev[room.round] = prevRoundVotes;
        return structuredClone(prev);
      });
      setRoom(newRoom);
      setUsers((prev) => {
        prev = prev.map(({ id, name, role }) => ({
          id,
          name,
          role,
          voted: false,
        }));
        return prev;
      });
      setSelectedIndex(null);
    },
    [room.round]
  );

  const restartRound = (data: RestartEvent["data"]) => {
    setRoom(data.room);
    setUsers(data.users);
    setSelectedIndex(null);
  };

  const revealVotes = (data: RevealEvent["data"]) => {
    setUsers(data);
    setRoom((prev) => {
      prev.status = "finished";
      return prev;
    });
  };

  const setVoted = (userId: number) => {
    setUsers((prev) => {
      const index = prev.findIndex((u) => u.id === userId);
      prev[index].voted = true;
      return [...prev];
    });
  };

  const kickUser = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${room.uuid}/events`);

    eventSource.onmessage = (event) => {
      const eventPayload: Event = JSON.parse(event.data);
      switch (eventPayload.type) {
        case "join": {
          const newUser = eventPayload.data;
          setUsers((prev) => [...prev, newUser]);
          break;
        }
        case "next-round": {
          goToNextRound(eventPayload.data);
          break;
        }
        case "restart": {
          restartRound(eventPayload.data);
          break;
        }
        case "reveal": {
          revealVotes(eventPayload.data);
          break;
        }
        case "kick": {
          const { userId } = eventPayload.data;
          kickUser(userId);
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
          setVoted(eventPayload.data.id);
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
  }, [room.uuid, router, user.id, i18n, disconnected, goToNextRound]);

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
        kickUser={kickUser}
        currentUserId={user.id}
        i18n={i18n.usersList}
        isAdmin={isAdmin}
      />
      <CardsHand
        voteOptions={voteOptions}
        room={room}
        setVoted={() => setVoted(user.id)}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      {isAdmin && (
        <Toolbar
          i18n={i18n.toolbar}
          room={room}
          revealVotes={revealVotes}
          restartRound={restartRound}
          goToNextRound={goToNextRound}
        />
      )}
    </div>
  );
};
