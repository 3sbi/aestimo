"use client";

import { Button } from "@/components/Button";
import type { ClientRoom } from "@/types";
import { CheckIcon, Share2Icon } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  room: ClientRoom;
};

const ShareButton: React.FC<Props> = ({ title, room }) => {
  const [loading, setLoading] = useState<boolean>(false);

  async function onClickInvite() {
    setLoading(true);
    try {
      const url = `${window.location.origin}/rooms/${room.slug}/join`;
      await navigator.clipboard.writeText(url);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }
  return (
    <Button onClick={onClickInvite} title={title} loading={loading} size="icon">
      {title}
      {loading ? <CheckIcon /> : <Share2Icon />}
    </Button>
  );
};

export { ShareButton };
