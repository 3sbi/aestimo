"use client";

import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientRoom, ClientUser } from "@/types";
import { api } from "@/utils/api";
import {
  ArrowRightCircleIcon,
  EyeIcon,
  RotateCwIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styles from "./Toolbar.module.css";

type ToolbarProps = {
  room: ClientRoom;
  i18n: Dictionary["room"]["toolbar"];
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  setPlayers: React.Dispatch<React.SetStateAction<ClientUser[]>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const Toolbar: React.FC<ToolbarProps> = ({
  room,
  i18n,
  setRoom,
  setPlayers,
  setSelectedIndex,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onClickReveal() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/reveal`);
      const json: ClientUser[] = await res.json();
      setPlayers(json);
      setRoom((prev) => {
        prev.status = "finished";
        return prev;
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const onClickNextRound = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/next`, {});
      const json: { room: ClientRoom } = await res.json();
      setRoom(json.room);
      setSelectedIndex(null);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  async function onClickRestart() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/restart`);
      const data: { room: ClientRoom; users: ClientUser[] } = await res.json();
      setRoom(data.room);
      setPlayers(data.users);
      setSelectedIndex(null);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function onClickDelete() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.delete(`/api/rooms/${room.uuid}`);
      if (res.ok) {
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className={styles.toolbar}>
      {room.status !== "finished" && (
        <Button onClick={onClickReveal} disabled={loading}>
          <EyeIcon />
          {i18n.reveal}
        </Button>
      )}

      {room.status === "finished" && (
        <Button onClick={onClickNextRound} disabled={loading}>
          <ArrowRightCircleIcon />
          {i18n.next}
        </Button>
      )}

      <Button onClick={onClickRestart} disabled={loading}>
        <RotateCwIcon />
        {i18n.restart}
      </Button>

      <Button onClick={onClickDelete} disabled={loading}>
        <Trash2Icon />
        {i18n.delete}
      </Button>
    </div>
  );
};

export { Toolbar };
