"use client";

import { ClientRoom, ClientUser, User } from "@/backend/types";
import { useRouter } from "next/navigation";
import React from "react";

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
  role: User["role"];
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  setUsersList: React.Dispatch<React.SetStateAction<ClientUser[]>>;
};

const Toolbar: React.FC<Props> = ({
  roomUUID,
  i18n,
  role,
  setRoom,
  setUsersList,
}) => {
  const router = useRouter();

  async function onClickRestart() {
    try {
      const res = await fetch(`/api/rooms/${roomUUID}/restart`, {
        method: "POST",
      });
      const { room }: { room: ClientRoom } = await res.json();
      setRoom(room);
    } catch (err) {
      console.error(err);
    }
  }

  async function onClickReveal() {
    try {
      const res = await fetch(`/api/rooms/${roomUUID}/reveal`, {
        method: "POST",
      });
      const json: ClientUser[] = await res.json();
      setUsersList(json);
    } catch (err) {
      console.error(err);
    }
  }

  async function onClickDelete() {
    try {
      const res = await fetch(`/api/rooms/${roomUUID}`, { method: "DELETE" });
      if (res.ok) router.replace("/");
    } catch (err) {
      console.error(err);
    }
  }

  function onClickInvite() {
    navigator.clipboard.writeText(`${window.location.href}/join`);
  }

  const isAdmin: boolean = role === "admin";
  return (
    <header className="toolbar">
      {isAdmin && (
        <button className="btn" onClick={onClickReveal}>
          {i18n.reveal}
        </button>
      )}
      {isAdmin && (
        <button className="btn" onClick={onClickRestart}>
          {i18n.restart}
        </button>
      )}
      {isAdmin && (
        <button className="btn" onClick={onClickDelete}>
          {i18n.delete}
        </button>
      )}
      <button className="btn" onClick={onClickInvite}>
        {i18n.invite}
      </button>
    </header>
  );
};

export default Toolbar;
