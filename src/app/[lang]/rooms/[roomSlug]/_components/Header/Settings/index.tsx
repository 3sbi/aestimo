import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom, ClientUser } from "@/types";
import { CircleQuestionMarkIcon, SettingsIcon } from "lucide-react";
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
      <PopoverTrigger className="btn secondary icon">
        <SettingsIcon />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3">
          <PrivateSwitch room={room} setRoom={setRoom} label={i18n.private} />
          <div className="flex gap-1 items-center">
            <AutoOpenSwitch
              room={room}
              setRoom={setRoom}
              label={i18n.autoreveal.label}
            />
            <Tooltip>
              <TooltipTrigger>
                <CircleQuestionMarkIcon size={14} />
              </TooltipTrigger>
              <TooltipContent>{i18n.autoreveal.tooltip}</TooltipContent>
            </Tooltip>
          </div>
          <LeaveButton user={user} i18n={i18n.leave} users={users} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminSettingsButton;
