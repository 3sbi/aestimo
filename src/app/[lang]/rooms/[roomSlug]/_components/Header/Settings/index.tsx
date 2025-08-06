import { Button } from "@/components/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom, ClientUser } from "@/types";
import { SettingsIcon } from "lucide-react";
import { AutoOpenSwitch } from "./AutorevealSwitch";
import LeaveButton from "./LeaveButton";
import { PrivateSwitch } from "./PrivateSwitch";

type Props = {
  room: ClientRoom;
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  i18n: Dictionary["pages"]["room"]["settings"];
  user: Pick<ClientUser, "id" | "role">;
  users: ClientUser[];
};

const AdminSettingsButton: React.FC<Props> = ({
  room,
  setRoom,
  i18n,
  user,
  users,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon">
          <SettingsIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3">
          {user.role === "admin" && (
            <>
              <PrivateSwitch
                room={room}
                setRoom={setRoom}
                label={i18n.private}
              />
              <AutoOpenSwitch
                room={room}
                setRoom={setRoom}
                i18n={i18n.autoreveal}
              />
            </>
          )}
          <LeaveButton user={user} i18n={i18n.leave} users={users} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminSettingsButton;
