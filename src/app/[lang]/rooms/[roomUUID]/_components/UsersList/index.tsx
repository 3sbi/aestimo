"use client";

import { ClientUser } from "@/types";
import React from "react";
import styles from "./UsersList.module.css";
import { CrownIcon } from "lucide-react";

const UsersList: React.FC<{
  usersList: ClientUser[];
  currentUserId: number;
}> = ({ usersList, currentUserId }) => {
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
                <div className="absolute -top-5" title={"admin"}>
                  <CrownIcon width={20} />
                </div>
              )}
            </h2>
            {children}
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
