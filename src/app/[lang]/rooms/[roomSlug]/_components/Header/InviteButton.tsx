"use client";

import { Button } from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom } from "@/types";
import { Share2Icon } from "lucide-react";
import { useState } from "react";

type Props = {
  i18n: Dictionary["pages"]["room"]["header"]["share"];
  room: ClientRoom;
};

const ShareButton: React.FC<Props> = ({ i18n, room }) => {
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
    <Tooltip label={i18n.tooltip} opened={loading}>
      <Button onClick={onClickInvite} title={i18n.title} loading={loading}>
        {i18n.title}
        <Share2Icon />
      </Button>
    </Tooltip>
  );
};

export { ShareButton };
