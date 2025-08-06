"use client";

import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom, ClientUser, User, Vote, VoteCard } from "@/types";
import type {
  Event,
  NextRoundEvent,
  RestartEvent,
  RevealEvent,
  RoundHistory,
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
  i18n: Dictionary["pages"]["room"];
  initialRoundsHistory: Record<Vote["round"], RoundHistory>;
  children: React.ReactNode;
};

export const RoomWrapper: React.FC<Props> = ({
  initialRoom,
  initialRoundsHistory,
  initialSelectedIndex,
  initialUsersList,
  i18n,
  voteOptions,
  user,
  children,
}) => {
  const router = useRouter();
  const [room, setRoom] = useState<ClientRoom>(initialRoom);
  const [roundsHistory, setRoundsHistory] =
    useState<Record<Vote["round"], RoundHistory>>(initialRoundsHistory);
  const [users, setUsers] = useState<ClientUser[]>(initialUsersList);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialSelectedIndex
  );
  const [disconnected, setDisconnected] = useState<boolean>(false);

  const goToNextRound = (data: NextRoundEvent["data"]) => {
    const { room: newRoom, prevRound } = data;
    setRoundsHistory((prev) => {
      prev[newRoom.round - 1] = prevRound;
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
  };

  const restartRound = (data: RestartEvent["data"]) => {
    setRoom(data.room);
    setUsers(data.users);
    setSelectedIndex(null);
  };

  const revealVotes = (data: RevealEvent["data"]) => {
    setUsers(data);
    setRoom((prev) => {
      prev.status = "finished";
      return { ...prev };
    });
  };

  const setVoted = (userUUID: ClientUser["id"]) => {
    setUsers((prev) => {
      const index = prev.findIndex((u) => u.id === userUUID);
      prev[index].voted = true;
      return [...prev];
    });
  };

  const kickUser = useCallback(
    (userId: ClientUser["id"]) => {
      if (user.id === userId) {
        router.replace("/");
      }
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    },
    [user.id, router]
  );

  const trasfetAdmin = (newAdminId: number) => {
    setUsers((prev) => {
      return prev.map((user) => {
        const isAdmin = user.id === newAdminId;
        user.role = isAdmin ? "admin" : "basic";
        return user;
      });
    });
  };

  const updateUser = (
    userId: User["id"],
    update: Partial<Pick<ClientUser, "name" | "connected">>
  ) => {
    setUsers((prev) => {
      const index = prev.findIndex((user) => user.id === userId);
      prev[index] = { ...prev[index], ...update };
      return [...prev];
    });
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
        case "room-update": {
          setRoom(eventPayload.data.room);
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
          kickUser(eventPayload.data.userId);
          break;
        }
        case "user-update": {
          const { update, userId } = eventPayload.data;
          updateUser(userId, update);
          break;
        }
        case "room-delete": {
          router.replace("/");
          break;
        }
        case "transfer-admin": {
          trasfetAdmin(eventPayload.data.newAdminId);
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
  }, [room.slug, router, i18n, disconnected, kickUser]);

  const isAdmin: boolean = user.role === "admin";
  return (
    <>
      <div className="room">
        <Header
          users={users}
          room={room}
          i18n={i18n}
          user={user}
          setRoom={setRoom}
          roundsHistory={roundsHistory}
        >
          {children}
        </Header>
        <div className="flex flex-col gap-4 m-auto">
          <UsersList
            users={users}
            kickUser={kickUser}
            currentUserId={user.id}
            i18n={i18n.usersList}
            isAdmin={isAdmin}
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
        <CardsHand
          voteOptions={voteOptions}
          room={room}
          setVoted={() => setVoted(user.id)}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      </div>
      <Toaster richColors position="top-center" />
    </>
  );
};
