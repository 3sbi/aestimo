"use client";

import { ClientRoom } from "@/backend/types";
import { Link2Icon } from "lucide-react";
import styles from "./Header.module.css";

type Props = {
  room: ClientRoom;
  i18n: {
    round: string;
  };
};

const Header: React.FC<Props> = ({ i18n, room }) => {
  function onClickInvite() {
    navigator.clipboard.writeText(`${window.location.href}/join`);
  }
  return (
    <header className={styles.roomHeader}>
      <h2>{room.name}</h2>
      <div>
        {i18n.round}:{room.round}
      </div>
      <div>
        <button className="btn" onClick={onClickInvite}>
          <Link2Icon />
        </button>
      </div>
    </header>
  );
};

export { Header };
