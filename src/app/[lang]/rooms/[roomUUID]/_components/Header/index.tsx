"use client";

import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientRoom, ClientUser, ClientVote } from "@/types";
import { LogOutIcon } from "lucide-react";
import styles from "./Header.module.css";
import { InviteButton } from "./InviteButton";
import { VotesHistory } from "./VotesHistory";
import { api } from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  room: ClientRoom;
  i18n: Dictionary["room"]["header"];
  votesHistory: Record<ClientRoom["round"], ClientVote[]>;
  user: ClientUser;
};

const Header: React.FC<Props> = ({ i18n, room, votesHistory, user }) => {
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
    <div>
      <header className={styles.roomHeader}>
        <h2 className="text-2xl">{room.name}</h2>
        <h2 className="font-semibold text-2xl">
          {i18n.round} {room.round}
        </h2>
        <div className="flex gap-1">
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
      <VotesHistory i18n={i18n} votesHistory={votesHistory} />
    </div>
  );
};

export { Header };
