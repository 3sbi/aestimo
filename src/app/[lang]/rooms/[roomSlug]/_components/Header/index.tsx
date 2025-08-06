import { GithubButton } from "@/components/GithubButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom, ClientUser } from "@/types";
import { RoundHistory } from "@/types/EventData";
import styles from "./Header.module.css";
import { ShareButton } from "./InviteButton";
import AdminSettingsButton from "./Settings";
import VoteHistory from "./Settings/VoteHistory";

type Props = {
  children: React.ReactNode;
  room: ClientRoom;
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  i18n: Dictionary["pages"]["room"];
  user: Pick<ClientUser, "id" | "role">;
  users: ClientUser[];
  roundsHistory: Record<number, RoundHistory>;
};

const Header: React.FC<Props> = ({
  i18n,
  room,
  setRoom,
  user,
  users,
  roundsHistory,
  children,
}) => {
  return (
    <div className="absolute gap-2 justify-between top-5 left-5 flex right-5 z-30">
      <div className={styles.headerChip}>
        <div className="flex gap-2 items-center">
          <b>{room.name}</b>
          <ShareButton i18n={i18n.header.share} room={room} />
        </div>
        <h2
          className={styles.roundCounter}
        >{`${i18n.header.round} ${room.round}`}</h2>
      </div>
      <div className={styles.headerChip}>
        <VoteHistory i18n={i18n} roundsHistory={roundsHistory} />
        <AdminSettingsButton
          user={user}
          users={users}
          room={room}
          setRoom={setRoom}
          i18n={i18n.settings}
        />
        <ThemeSwitcher title={i18n.settings.theme} />
        {children}
        <GithubButton />
      </div>
    </div>
  );
};

export { Header };
