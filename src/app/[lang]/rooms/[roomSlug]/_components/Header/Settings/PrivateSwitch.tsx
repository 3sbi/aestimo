import { Switch } from "@/components/Switch";
import type { ClientRoom } from "@/types";
import { api } from "@/utils/api";

type Props = {
  room: ClientRoom;
  setRoom: React.Dispatch<React.SetStateAction<ClientRoom>>;
  label: string;
};

const PrivateSwitch: React.FC<Props> = ({ room, setRoom, label }) => {
  async function onChange(value: boolean) {
    try {
      const res = await api.patch(`/api/rooms/${room.slug}`, {
        private: value,
      });
      const data: ClientRoom = await res.json();
      setRoom(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch id="private" onChange={onChange} checked={room.private} />
      <label htmlFor="private">{label}</label>
    </div>
  );
};

export { PrivateSwitch };
