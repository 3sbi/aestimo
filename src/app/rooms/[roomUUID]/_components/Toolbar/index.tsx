"use client";

import { ClientRoom, ClientUser } from "@/backend/types";
import { api } from "@/lib/api";
import {
  ArrowRightCircleIcon,
  EyeIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./Toolbar.module.css";

type Props = {
  room: ClientRoom;
  i18n: {
    reveal: string;
    next: string;
    restart: string;
    delete: string;
  };
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  setUsersList: React.Dispatch<React.SetStateAction<ClientUser[]>>;
};

const Toolbar: React.FC<Props> = ({ room, i18n, setRoom, setUsersList }) => {
  const router = useRouter();

  async function onClickRestart() {
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/restart`);
      const json: { room: ClientRoom } = await res.json();
      setRoom(json.room);
    } catch (err) {
      console.error(err);
    }
  }

  async function onClickReveal() {
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/reveal`);
      const json: ClientUser[] = await res.json();
      setUsersList(json);
    } catch (err) {
      console.error(err);
    }
  }

  async function onClickDelete() {
    try {
      const res = await api.post(`/api/rooms/${room.uuid}`);
      if (res.ok) router.replace("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.toolbarWrapper}>
      <div className={styles.toolbar}>
        {room.status !== "finished" && (
          <button className="btn" onClick={onClickReveal}>
            <EyeIcon />
            {i18n.reveal}
          </button>
        )}
        {room.status === "finished" && (
          <button className="btn">
            <ArrowRightCircleIcon />
            {i18n.next}
          </button>
        )}
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
