"use client";

import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom, ClientUser } from "@/types";
import type { NextRoundEvent, RestartEvent } from "@/types/EventData";
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
  i18n: Dictionary["pages"]["room"]["toolbar"];
  revealVotes: (data: ClientUser[]) => void;
  restartRound: (data: RestartEvent["data"]) => void;
  goToNextRound: (data: NextRoundEvent["data"]) => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
  room,
  i18n,
  revealVotes,
  restartRound,
  goToNextRound,
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
      const data: ClientUser[] = await res.json();
      revealVotes(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingButton(null);
  }

  async function onClickNextRound() {
    if (loadingButton) return;
    setLoadingButton("next");
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/next`, {});
      const data: NextRoundEvent["data"] = await res.json();
      goToNextRound(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingButton(null);
  }

  async function onClickRestart() {
    if (loadingButton) return;
    setLoadingButton("restart");
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/restart`);
      const data: RestartEvent["data"] = await res.json();
      restartRound(data);
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
