"use client";

import { ClientRoom, ClientUser } from "@/backend/types";
import { api } from "@/lib/api";
import { EyeIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./Toolbar.module.css";

type Props = {
  roomUUID: string;
  i18n: {
    reveal: string;
    delete: string;
    restart: string;
    leave: string;
    invite: string;
    history: string;
  };
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  setUsersList: React.Dispatch<React.SetStateAction<ClientUser[]>>;
};

const Toolbar: React.FC<Props> = ({
  roomUUID,
  i18n,
  setRoom,
  setUsersList,
}) => {
  const router = useRouter();

  async function onClickRestart() {
    try {
      const res = await api.post(`/api/rooms/${roomUUID}/restart`);
      const { room }: { room: ClientRoom } = await res.json();
      setRoom(room);
    } catch (err) {
      console.error(err);
    }
  }

  async function onClickReveal() {
    try {
      const res = await api.post(`/api/rooms/${roomUUID}/reveal`);
      const json: ClientUser[] = await res.json();
      setUsersList(json);
    } catch (err) {
      console.error(err);
    }
  }

  async function onClickDelete() {
    try {
      const res = await api.post(`/api/rooms/${roomUUID}`);
      if (res.ok) router.replace("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.toolbarWrapper}>
      <div className={styles.toolbar}>
        <button className="btn" onClick={onClickReveal}>
          <EyeIcon />
          {i18n.reveal}
        </button>
        <button className="btn" onClick={onClickRestart}>
          <RotateCcwIcon />
          {i18n.restart}
        </button>
        <button className="btn" onClick={onClickDelete}>
          <Trash2Icon />
          {i18n.delete}
        </button>
      </div>
    </div>
  );
};

export { Toolbar };
