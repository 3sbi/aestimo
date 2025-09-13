"use client";

import { Button } from "@/components/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
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
  const [opened, setOpened] = useState<boolean>(false);

  async function onClickInvite() {
    setLoading(true);
    try {
      const url = `${window.location.origin}/rooms/${room.slug}/join`;
      await navigator.clipboard.writeText(url);
      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }
  return (
    <Tooltip open={opened}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClickInvite}
          onMouseOver={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
        >
          <Share2Icon size={14} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{loading ? i18n.copied : i18n.title}</TooltipContent>
    </Tooltip>
  );
};

export { ShareButton };
