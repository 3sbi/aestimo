"use client";

import React from "react";
import { ClientUser } from "@/backend/types";

const UsersList: React.FC<{ usersList: ClientUser[] }> = ({ usersList }) => {
  return (
    <div className="room-users-list">
      {usersList.map((user) => {
        if (user.value) {
          const { color, value } = user.value;
          return (
            <div
              key={user.id}
              className="card user-card"
              style={{ backgroundColor: color }}
            >
              <div>{value}</div>
              <h2>{user.name}</h2>
            </div>
          );
        }
        return (
          <div className="card user-card" key={user.id}>
            <div>{user.voted ? "🗳️" : "🤔"}</div>
            <h2>{user.name}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
