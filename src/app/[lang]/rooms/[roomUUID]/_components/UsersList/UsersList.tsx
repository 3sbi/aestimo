"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientUser } from "@/types";
import { CrownIcon } from "lucide-react";
import React from "react";
import { KickButton } from "./KickButton";
import styles from "./UsersList.module.css";

type Props = {
  players: ClientUser[];
  setPlayers: (value: React.SetStateAction<ClientUser[]>) => void;
  currentUserId: number;
  i18n: Dictionary["room"]["usersList"];
  isAdmin: boolean;
};

const UsersList: React.FC<Props> = ({
  players,
  setPlayers,
  currentUserId,
  isAdmin,
}) => {
  return (
    <div className={styles.userCardList}>
      {players.map((user) => {
        let children = <div>{user.voted ? "🗳️" : "🤔"}</div>;
        if (user.vote) {
          children = <div>{user.vote.value}</div>;
        }
        return (
          <div
            className={styles.userCard}
            key={user.id}
            style={user.vote ? { backgroundColor: user.vote.color } : {}}
            title={user.name}
          >
            <h2 className={styles.username} title={user.name}>
              <span className="truncate">{user.name}</span>
              {user.id === currentUserId && <span>(You)</span>}
              {user.role === "admin" && (
                <div title={"admin"}>
                  <CrownIcon width={20} />
                </div>
              )}
              {isAdmin && user.id !== currentUserId && (
                <KickButton userId={user.id} setPlayers={setPlayers} />
              )}
            </h2>
            {children}
          </div>
        );
      })}
    </div>
  );
};

export { UsersList };
