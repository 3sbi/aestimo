import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom, ClientUser } from "@/types";
import { LogOutIcon } from "lucide-react";
import { AdminLeaveModal } from "./AdminLeaveModal";
import { BasicLeaveButton } from "./BasicLeaveButton";
import styles from "./Header.module.css";
import { InviteButton } from "./InviteButton";

type Props = {
  room: ClientRoom;
  i18n: Dictionary["pages"]["room"]["header"];
  user: Pick<ClientUser, "id" | "role">;
  users: ClientUser[];
};

const Header: React.FC<Props> = ({ i18n, room, user, users }) => {
  return (
    <header className={styles.roomHeader}>
      <h2 className="text-2xl truncate">{room.name}</h2>
      <h2 className="font-semibold text-2xl justify-self-center truncate w-full">
        {i18n.round} {room.round}
      </h2>

      <div className="flex gap-1 justify-self-end">
        <InviteButton title={i18n.copy} room={room} />
        {user.role === "admin" ? (
          <AdminLeaveModal
            trigger={
              <Button variant="destructive" title={i18n.leave} size="icon">
                <LogOutIcon />
              </Button>
            }
            i18n={i18n}
            users={users}
            userId={user.id}
          />
        ) : (
          <BasicLeaveButton i18n={i18n} userId={user.id} />
        )}
      </div>
    </header>
  );
};

export { Header };
