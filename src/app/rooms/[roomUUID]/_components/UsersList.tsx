"use client";

import React from "react";
import { ClientUser } from "@/backend/types";

const UsersList: React.FC<{ usersList: ClientUser[] }> = ({ usersList }) => {
  return (
    <div className="card">
      {usersList.map((user) => {
        if (user.value) {
          const { color, label } = user.value;
          return (
            <div key={user.id} style={{ backgroundColor: color }}>
              <div>{label}</div>
              <h2>{user.name}</h2>
            </div>
          );
        }
        return (
          <div key={user.id}>
            <div>{user.voted ? "🗳️" : "🤔"}</div>
            <h2>{user.name}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
