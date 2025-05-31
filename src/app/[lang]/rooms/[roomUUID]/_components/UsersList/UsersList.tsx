"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientUser } from "@/types";
import { CrownIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import styles from "./UsersList.module.css";

type Props = {
  usersList: ClientUser[];
  currentUserId: number;
  i18n: Dictionary["room"]["usersList"];
  isAdmin: boolean;
};

const UsersList: React.FC<Props> = ({ usersList, currentUserId, isAdmin }) => {
  return (
    <div className={styles.userCardList}>
      {usersList.map((user) => {
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
                <button>
                  <Image src="/kick.svg" width={6} height={6} alt="kick" />
                </button>
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

