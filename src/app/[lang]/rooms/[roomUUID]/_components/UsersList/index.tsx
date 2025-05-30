"use client";

import React from "react";
import { ClientUser } from "@/backend/types";
import styles from "./UsersList.module.css";

const UsersList: React.FC<{ usersList: ClientUser[] }> = ({ usersList }) => {
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
            </h2>
            {children}
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
