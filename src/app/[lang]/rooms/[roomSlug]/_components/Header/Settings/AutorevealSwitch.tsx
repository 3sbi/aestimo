import { Switch } from "@/components/Switch";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/Tooltip";
import { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom } from "@/types";
import { api } from "@/utils/api";
import { CircleQuestionMarkIcon } from "lucide-react";

type Props = {
  room: ClientRoom;
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  i18n: Dictionary["pages"]["room"]["settings"]["autoreveal"];
};

const AutoOpenSwitch: React.FC<Props> = ({ room, setRoom, i18n }) => {
  async function onChange(autoreveal: boolean) {
    try {
      const res = await api.patch(`/api/rooms/${room.slug}`, { autoreveal });
      const data: ClientRoom = await res.json();
      setRoom(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex gap-1 items-center">
      <div className="flex items-center gap-2">
        <Switch id="autoreveal" onChange={onChange} checked={room.autoreveal} />
        <label htmlFor="autoreveal">{i18n.label}</label>
      </div>
      <Tooltip>
        <TooltipTrigger>
          <CircleQuestionMarkIcon size={14} />
        </TooltipTrigger>
        <TooltipContent>{i18n.tooltip}</TooltipContent>
      </Tooltip>
    </div>
  );
};

export { AutoOpenSwitch };
