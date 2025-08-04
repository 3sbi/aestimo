import { Switch } from "@/components/Switch";
import type { ClientRoom } from "@/types";
import { api } from "@/utils/api";

type Props = {
  room: ClientRoom;
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  label: string;
};

const AutoOpenSwitch: React.FC<Props> = ({ room, setRoom, label }) => {
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
    <div className="flex items-center gap-2">
      <Switch id="autoreveal" onChange={onChange} checked={room.autoreveal} />
      <label htmlFor="autoreveal">{label}</label>
    </div>
  );
};

export { AutoOpenSwitch };
