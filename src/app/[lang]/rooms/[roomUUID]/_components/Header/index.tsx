"use client";

import { ClientRoom } from "@/backend/types";
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
      await navigator.clipboard.writeText(`${window.location.href}/join`);
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
          <button
            className="btn"
            style={{ padding: "8px" }}
            onClick={onClickInvite}
            title={i18n.copy}
          >
            {clicked ? <CheckIcon /> : <Link2Icon />}
          </button>
        </div>
      </header>
    </>
  );
};

export { Header };
