"use client";

import { Button } from "@/components/Button";
import { ClientRoom } from "@/types";
import { CheckIcon, Link2Icon } from "lucide-react";
import { useState } from "react";
import styles from "./Header.module.css";

type Props = {
  room: ClientRoom;
  i18n: {
    round: string;
    copy: string;
  };
};

const Header: React.FC<Props> = ({ i18n, room }) => {
  const [clicked, setClicked] = useState<boolean>(false);

  async function onClickInvite() {
    setClicked(true);
    try {
      const url = `${window.location.origin}/rooms/${room.uuid}/join`;
      await navigator.clipboard.writeText(url);
      setTimeout(() => {
        setClicked(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setClicked(false);
    }
  }

  return (
    <>
      <header className={styles.roomHeader}>
        <h2>{room.name}</h2>
        <div>
          {i18n.round}:{room.round}
        </div>
        <div>
          <Button onClick={onClickInvite} title={i18n.copy}>
            {clicked ? <CheckIcon /> : <Link2Icon />}
          </Button>
        </div>
      </header>
    </>
  );
};

export { Header };

