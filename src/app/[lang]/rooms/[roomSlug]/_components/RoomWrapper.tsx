"use client";

import type { Dictionary } from "@/i18n/getDictionary";
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
import { HistoryDrawer } from "./HistoryDrawer";
import { Toolbar } from "./Toolbar";
import { UsersList } from "./UsersList";

type Props = {
  initialRoom: ClientRoom;
  initialUsersList: ClientUser[];
  initialSelectedIndex: number | null;
  voteOptions: VoteCard[];
  user: Pick<User, "id" | "role">;
  i18n: Dictionary["pages"]["room"];
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
        prev = prev.map(({ id, name, role, connected }) => ({
          id,
          name,
          role,
          connected,
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

  const setVoted = (userUUID: ClientUser["id"]) => {
    setUsers((prev) => {
      const index = prev.findIndex((u) => u.id === userUUID);
      prev[index].voted = true;
      return [...prev];
    });
  };

  const kickUser = (userUUID: ClientUser["id"]) => {
    setUsers((prev) => prev.filter((user) => user.id !== userUUID));
  };

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${room.slug}/events`);

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
        case "user-update": {
          const { userId, update } = eventPayload.data;
          setUsers((prev) => {
            const index = prev.findIndex((user) => user.id === userId);
            prev[index] = { ...prev[index], ...update };
            return [...prev];
          });
          break;
        }
        case "delete-room": {
          router.replace("/");
          break;
        }
        case "transfer-admin": {
          const { newAdminId } = eventPayload.data;
          setUsers((prev) => {
            return prev.map((user) => {
              const isAdmin = user.id === newAdminId;
              user.role = isAdmin ? "admin" : "basic";
              return user;
            });
          });
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
  }, [room.slug, router, user.id, i18n, disconnected, goToNextRound]);

  const isAdmin: boolean = user.role === "admin";
  return (
    <div className="room">
      <Toaster richColors />
      <Header users={users} room={room} i18n={i18n.header} user={user} />
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

      <HistoryDrawer i18n={i18n.historyDrawer} votesHistory={votesHistory} />
    </div>
  );
};
