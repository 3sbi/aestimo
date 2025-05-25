"use client";

import { ClientRoom, User } from "@/backend/types";
import React from "react";
import { useRouter } from "next/navigation";

type ResultResponse = { success: boolean };

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
};

const Toolbar: React.FC<Props> = ({ roomUUID, i18n, role, setRoom }) => {
  const router = useRouter();
  async function onClickRestart() {
    try {
      const res = await fetch(`/api/rooms/${roomUUID}/restart`, {
        method: "POST",
      });
      const json: ResultResponse = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function onClickReveal() {
    try {
      const res = await fetch(`/api/rooms/${roomUUID}/reveal`, {
        method: "POST",
      });

      const json: ResultResponse = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function onClickDelete() {
    try {
      const res = await fetch(`/api/rooms/${roomUUID}`, { method: "DELETE" });

      const result: ResultResponse = await res.json();
      if (result.success) {
        router.replace("/");
      }
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
