"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientUser } from "@/types";
import { getContrastYIQ } from "@/utils/colors";
import { CrownIcon } from "lucide-react";
import React from "react";
import { KickButton } from "./KickButton";
import styles from "./UsersList.module.css";

type Props = {
  users: ClientUser[];
  kickUser: (userId: ClientUser["id"]) => void;
  currentUserId: ClientUser["id"];
  i18n: Dictionary["pages"]["room"]["usersList"];
  isAdmin: boolean;
};

const UsersList: React.FC<Props> = ({
  users,
  kickUser,
  currentUserId,
  isAdmin,
  i18n,
}) => {
  return (
    <div className={styles.userCardList}>
      {users.map((user) => {
        const isCurrentUser = user.id === currentUserId;
        const userIsAdmin = user.role === "admin";
        let children = <div>{user.voted ? "🗳️" : "🤔"}</div>;

        if (user.vote) {
          children = <div>{user.vote.value}</div>;
        }

        const style: React.CSSProperties = {};
        if (user.vote) {
          const backgroundColor = user.vote.color;
          style.backgroundColor = backgroundColor;
          style.color = getContrastYIQ(backgroundColor);
        }

        if (!user.connected && !isCurrentUser) {
          style.opacity = "0.6";
          if (!user.voted) {
            children = <div title={i18n.disconnected}>💀</div>;
          }
        }

        return (
          <div
            className={styles.userCard}
            key={user.id}
            style={style}
            title={user.name}
          >
            <h2 className={styles.username} title={user.name}>
              <span className="truncate">{user.name}</span>
              {isCurrentUser && (
                <small style={{ color: "var(--secondary-foreground)" }}>
                  ({i18n.you})
                </small>
              )}
              {userIsAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CrownIcon width={12} style={{ minWidth: "12px" }} />
                  </TooltipTrigger>
                  <TooltipContent>{i18n.admin}</TooltipContent>
                </Tooltip>
              )}
            </h2>
            {isAdmin && !isCurrentUser && (
              <KickButton
                userId={user.id}
                kickUser={kickUser}
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
