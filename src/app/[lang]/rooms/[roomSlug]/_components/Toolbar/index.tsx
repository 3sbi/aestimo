"use client";

import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom, ClientUser } from "@/types";
import type { NextRoundEvent, RestartEvent } from "@/types/EventData";
import { api } from "@/utils/api";
import { ArrowRightCircleIcon, EyeIcon, RotateCwIcon } from "lucide-react";
import React, { useState } from "react";
import { AutoOpenSwitch } from "./AutorevealSwitch";
import { DeleteButton } from "./DeleteButton";
import { PrivateSwitch } from "./PrivateSwitch";
import styles from "./Toolbar.module.css";

type Props = {
  room: ClientRoom;
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  i18n: Dictionary["pages"]["room"]["toolbar"];
  revealVotes: (data: ClientUser[]) => void;
  restartRound: (data: RestartEvent["data"]) => void;
  goToNextRound: (data: NextRoundEvent["data"]) => void;
};

const Toolbar: React.FC<Props> = ({
  room,
  setRoom,
  i18n,
  revealVotes,
  restartRound,
  goToNextRound,
}) => {
  const [loadingButton, setLoadingButton] = useState<
    "reveal" | "next" | "restart" | null
  >(null);

  async function onClickReveal() {
    if (loadingButton) return;
    setLoadingButton("reveal");
    try {
      const res = await api.post(`/api/rooms/${room.slug}/reveal`);
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
      const res = await api.post(`/api/rooms/${room.slug}/next`, {});
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
      const res = await api.post(`/api/rooms/${room.slug}/restart`);
      const data: RestartEvent["data"] = await res.json();
      restartRound(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingButton(null);
  }

  return (
    <div className={styles.toolbarWrapper}>
      <div className="flex items-center justify-between gap-2 p-2">
        <PrivateSwitch room={room} setRoom={setRoom} label={i18n.private} />
        <AutoOpenSwitch room={room} setRoom={setRoom} label={i18n.autoreveal} />
      </div>
      <div className={styles.toolbar}>
        {room.status !== "finished" && !room.autoreveal && (
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

        <DeleteButton room={room} i18n={i18n["delete-modal"]} />
      </div>
    </div>
  );
};

export { Toolbar };
