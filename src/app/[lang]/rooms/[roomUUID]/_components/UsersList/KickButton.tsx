"use client";
import { ClientUser } from "@/types";
import { api } from "@/utils/api";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
  userId: number;
  setPlayers: (value: React.SetStateAction<ClientUser[]>) => void;
};

const KickButton: React.FC<Props> = ({ userId, setPlayers }) => {
  const [loading, setLoading] = useState<boolean>(false);

  async function onClick() {
    setLoading(true);
    try {
      const res = await api.delete(`/api/users/${userId}`);
      const json: { success: boolean } = await res.json();
      if (json.success && res.ok) {
        setPlayers((prev) => prev.filter((user) => user.id !== userId));
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <button onClick={onClick} disabled={loading}>
      <Image src="/kick.svg" width={6} height={6} alt="kick" />
    </button>
  );
};

export { KickButton };

