"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { Dictionary } from "@/i18n/getDictionary";
import { api } from "@/utils/api";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Response = { success: boolean };

type Props = {
  i18n: Dictionary["pages"]["home"]["joinRoomForm"];
  roomSlug: string;
};

const JoinRoomForm: React.FC<Props> = ({ i18n, roomSlug }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const onFinish = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/api/rooms/${roomSlug}/join`, { username });
      const result: Response = await res.json();
      if (result.success) router.replace(`/rooms/${roomSlug}`);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col px-6 pb-6 pt-3 grow">
      <div className="grow">
        <Input
          id="username"
          type="text"
          label={i18n.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <Button
        variant="primary"
        type="button"
        className="mt-4"
        onClick={onFinish}
        disabled={loading}
      >
        {loading && <Loader2Icon className="animate-spin" size={20} />}
        {i18n.join}
      </Button>
    </form>
  );
};

export { JoinRoomForm };
