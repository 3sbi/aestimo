import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom } from "@/types";
import { api } from "@/utils/api";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  i18n: Dictionary["pages"]["room"]["toolbar"]["delete-modal"];
  room: ClientRoom;
};

const DeleteButton: React.FC<Props> = ({ i18n, room }) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onClickDelete() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.delete(`/api/rooms/${room.slug}`);
      if (res.ok) {
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <Modal
      opened={opened}
      setOpened={setOpened}
      trigger={
        <Button loading={loading}>
          <Trash2Icon />
          {i18n.delete}
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-2 max-w-[400px]">
        <h2 className="font-semibold text-2xl mb-2">{i18n.header}</h2>
        <p className="text-justify">{i18n.help}</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setOpened(false)}>
            {i18n.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={onClickDelete}
            loading={loading}
          >
            {loading && <Loader2Icon className="animate-spin" size={16} />}
            {i18n.delete}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { DeleteButton };
