"use client";
import { Button } from "@/components/Button";
import type { ClientUser } from "@/types";
import { api } from "@/utils/api";
import React, { useState } from "react";
import styles from "./UsersList.module.css";
import Tooltip from "@/components/Tooltip";

type Props = {
  userId: ClientUser["id"];
  kickUser: (userUUID: ClientUser["id"]) => void;
  title: string;
};

const KickButton: React.FC<Props> = ({ userId, kickUser, title }) => {
  const [loading, setLoading] = useState<boolean>(false);

  async function onClick() {
    setLoading(true);
    try {
      const res = await api.delete(`/api/users/${userId}`);
      const json: { success: boolean } = await res.json();
      if (json.success && res.ok) {
        kickUser(userId);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className={styles.kickButton}>
      <Tooltip label={title}>
        <Button
          size="icon"
          variant="secondary"
          onClick={onClick}
          loading={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 100 100">
            <polygon points="73.14 60.55 17.75 80.02 14.46 74.29 72.12 54.02 73.14 60.55" />
            <path d="M50.16,39.44c-.25,0-4.7.33-4.93.42L34.8,42.37,28.08,20,.1,29.82,15,72.14l8.51-3L41,63,70.37,52.67C65.21,41.59,55.28,38.63,50.16,39.44Z" />
            <path d="M81.12,60.49a12.88,12.88,0,0,1,3.35-10c.76-.83,1-1.2-.31-1.68C77.59,46.33,74,41.49,73.26,34.56c-.12-1.09-.26-1.46-1.48-1-7.65,2.85-14.63,1-20.15-5.32A21.4,21.4,0,0,1,49,24.78c-.38-.66-.36-1.13.35-1.49.2-.1.38-.23.57-.35,2.37-1.44,2.36-1.43,4.09.62a26,26,0,0,0,2.34,2.6c5.52,5,11.24,5.28,17.23.88,1.79-1.32,3.55-2.68,5.33-4,.33-.24.66-.8,1.12-.43s.09.83,0,1.25a34.72,34.72,0,0,0-1.94,9.09,11.49,11.49,0,0,0,8.1,11.52c3.91,1.25,8,1.38,12,1.87.62.08,1.58-.22,1.7.58s-.86.7-1.4.92c-1.94.83-3.93,1.56-5.84,2.45-7,3.24-8.73,9.63-4.3,15.91a27.13,27.13,0,0,0,2,2.64c.79.87.63,1.44-.2,2.21-2.58,2.38-2.53,2.4-4.65-.45A21.34,21.34,0,0,1,81.12,60.49Z" />
          </svg>
        </Button>
      </Tooltip>
    </div>
  );
};

export { KickButton };
