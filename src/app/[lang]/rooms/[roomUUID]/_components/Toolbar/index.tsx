"use client";

import { ClientRoom, ClientUser } from "@/backend/types";
import { Button } from "@/components/Button";
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

type ButtonProps = {
  label: string;
  room: ClientRoom;
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
};

const RevealButton: React.FC<
  ButtonProps & {
    setUsersList: React.Dispatch<React.SetStateAction<ClientUser[]>>;
  }
> = ({ label, room, setUsersList }) => {
  const [loading, setLoading] = useState<boolean>(false);

  async function onClickReveal() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/reveal`);
      const json: ClientUser[] = await res.json();
      setUsersList(json);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <Button onClick={onClickReveal} disabled={loading}>
      <EyeIcon />
      {label}
    </Button>
  );
};

const NextRoundButton: React.FC<ButtonProps> = ({ label }) => {
  return (
    <Button>
      <ArrowRightCircleIcon />
      {label}
    </Button>
  );
};

const RestartButton: React.FC<ButtonProps> = ({ label, room, setRoom }) => {
  const [loading, setLoading] = useState<boolean>(false);
  async function onClickRestart() {
    setLoading(true);
    try {
      const res = await api.post(`/api/rooms/${room.uuid}/restart`);
      const json: { room: ClientRoom } = await res.json();
      setRoom(json.room);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }
  return (
    <Button onClick={onClickRestart} disabled={loading}>
      <RotateCwIcon className={loading ? "animate-spin" : ""} />
      {label}
    </Button>
  );
};

const DeleteButton: React.FC<ButtonProps> = ({ label, room, setRoom }) => {
  const router = useRouter();

  async function onClickDelete() {
    try {
      const res = await api.post(`/api/rooms/${room.uuid}`);
      if (res.ok) {
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Button onClick={onClickDelete}>
      <Trash2Icon />
      {label}
    </Button>
  );
};

const Toolbar: React.FC<Props> = ({ room, i18n, setRoom, setUsersList }) => {
  return (
    <div className={styles.toolbar}>
      {room.status !== "finished" && (
        <RevealButton
          label={i18n.reveal}
          room={room}
          setRoom={setRoom}
          setUsersList={setUsersList}
        />
      )}
      {room.status === "finished" && (
        <NextRoundButton label={i18n.next} room={room} setRoom={setRoom} />
      )}
      <RestartButton label={i18n.restart} room={room} setRoom={setRoom} />
      <DeleteButton label={i18n.delete} room={room} setRoom={setRoom} />
    </div>
  );
};

export { Toolbar };

