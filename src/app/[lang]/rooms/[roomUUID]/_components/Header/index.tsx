"use client";

import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientRoom, ClientUser } from "@/types";
import { api } from "@/utils/api";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.css";
import { InviteButton } from "./InviteButton";

type Props = {
  room: ClientRoom;
  i18n: Dictionary["pages"]["room"]["header"];
  user: Pick<ClientUser, "id" | "role">;
};

const Header: React.FC<Props> = ({ i18n, room, user }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onClickLeave() {
    setLoading(true);
    try {
      const res = await api.delete(`/api/users/${user.id}`);
      if (res.ok) {
        router.replace("/");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }

  return (
    <header className={styles.roomHeader}>
      <h2 className="text-2xl truncate">{room.name}</h2>
      <h2 className="font-semibold text-2xl justify-self-center truncate w-full">
        {i18n.round} {room.round}
      </h2>
      <div className="flex gap-1 justify-self-end">
        <InviteButton title={i18n.copy} room={room} />
        <Button
          variant="destructive"
          onClick={onClickLeave}
          title={i18n.leave}
          size="icon"
          loading={loading}
        >
          <LogOutIcon />
        </Button>
      </div>
    </header>
  );
};

export { Header };
