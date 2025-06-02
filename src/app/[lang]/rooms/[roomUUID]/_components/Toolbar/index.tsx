"use client";

import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientRoom, ClientUser, ClientVote } from "@/types";
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
  setUsers: React.Dispatch<React.SetStateAction<ClientUser[]>>;
  setVotesHistory: React.Dispatch<
    React.SetStateAction<Record<number, ClientVote[]>>
  >;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const Toolbar: React.FC<ToolbarProps> = ({
  room,
  i18n,
  setRoom,
  setUsers,
  setVotesHistory,
  setSelectedIndex,
}) => {
  const [loadingButton, setLoadingButton] = useState<
    "reveal" | "next" | "restart" | "delete" | null
  >(null);
  const router = useRouter();

  async function onClickReveal() {
    if (loadingButton) return;
    setLoadingButton("reveal");
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/reveal`);
      const json: ClientUser[] = await res.json();
      setUsers(json);
      setRoom((prev) => {
        prev.status = "finished";
        return prev;
      });
    } catch (err) {
      console.error(err);
    }
    setLoadingButton(null);
  }

  const onClickNextRound = async () => {
    if (loadingButton) return;
    setLoadingButton("next");
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/next`, {});
      const json: { room: ClientRoom; roundHistory: ClientVote[] } =
        await res.json();
      setRoom(json.room);
      setVotesHistory((prev) => {
        prev[room.round] = json.roundHistory;
        return { ...prev };
      });
      setSelectedIndex(null);
    } catch (err) {
      console.error(err);
    }
    setLoadingButton(null);
  };

  async function onClickRestart() {
    if (loadingButton) return;
    setLoadingButton("restart");
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/restart`);
      const data: { room: ClientRoom; users: ClientUser[] } = await res.json();
      setRoom(data.room);
      setUsers(data.users);
      setSelectedIndex(null);
    } catch (err) {
      console.error(err);
    }
    setLoadingButton(null);
  }

  async function onClickDelete() {
    if (loadingButton) return;
    setLoadingButton("delete");
    try {
      const res = await api.delete(`/api/rooms/${room.uuid}`);
      if (res.ok) {
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingButton(null);
  }

  return (
    <div className={styles.toolbar}>
      {room.status !== "finished" && (
        <Button onClick={onClickReveal} loading={loadingButton === "reveal"}>
          <EyeIcon />
          {i18n.reveal}
        </Button>
      )}

      {room.status === "finished" && (
        <Button onClick={onClickNextRound} loading={loadingButton === "next"}>
          <ArrowRightCircleIcon />
          {i18n.next}
        </Button>
      )}

      <Button onClick={onClickRestart} loading={loadingButton === "restart"}>
        <RotateCwIcon />
        {i18n.restart}
      </Button>

      <Button onClick={onClickDelete} loading={loadingButton === "delete"}>
        <Trash2Icon />
        {i18n.delete}
      </Button>
    </div>
  );
};

export { Toolbar };

