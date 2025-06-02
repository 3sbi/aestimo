"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientUser } from "@/types";
import { CrownIcon } from "lucide-react";
import React from "react";
import { KickButton } from "./KickButton";
import styles from "./UsersList.module.css";

type Props = {
  users: ClientUser[];
  setUsers: (value: React.SetStateAction<ClientUser[]>) => void;
  currentUserId: number;
  i18n: Dictionary["room"]["usersList"];
  isAdmin: boolean;
};

const UsersList: React.FC<Props> = ({
  users,
  setUsers,
  currentUserId,
  isAdmin,
  i18n,
}) => {
  return (
    <div className={styles.userCardList}>
      {users.map((user) => {
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
            </h2>
            {isAdmin && user.id !== currentUserId && (
              <KickButton
                userId={user.id}
                setUsers={setUsers}
                title={i18n.kick}
              />
            )}
            {children}
          </div>
        );
      })}
    </div>
  );
};

export { UsersList };

