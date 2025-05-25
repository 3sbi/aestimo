"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Response = { success: boolean };

type Props = {
  i18n: { username: string; join: string };
  roomUUID: string;
};

const JoinRoomForm: React.FC<Props> = ({ i18n, roomUUID }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const onFinish = async () => {
    setLoading(true);
    try {
      const body = JSON.stringify({ username });
      const res = await fetch(`/api/rooms/${roomUUID}/join`, {
        method: "POST",
        body,
      });
      const result: Response = await res.json();
      if (result.success) router.replace(`/rooms/${roomUUID}`);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <form>
      <Input
        id="username"
        type="text"
        label={i18n.username}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        variant="primary"
        type="button"
        className="mt-4"
        onClick={onFinish}
        disabled={loading}
      >
        {loading && (
          <Loader2Icon className="animate-spin" width={20} height={20} />
        )}
        {i18n.join}
      </Button>
    </form>
  );
};

export default JoinRoomForm;
