import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/getDictionary";
import type { RoundHistory } from "@/types/EventData";
import { HistoryIcon } from "lucide-react";
import { useState } from "react";
import VoteHistoryDrawer from "./VoteHistoryDrawer";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/Tooltip";

type Props = {
  i18n: Dictionary["pages"]["room"];
  roundsHistory: Record<number, RoundHistory>;
};

const VoteHistory: React.FC<Props> = ({ i18n, roundsHistory }) => {
  const [opened, setOpened] = useState<boolean>(false);

  const title = i18n["vote-history"].header;
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            title={title}
            onClick={() => setOpened(!opened)}
          >
            <HistoryIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>

      <VoteHistoryDrawer
        opened={opened}
        i18n={i18n["vote-history"]}
        roundsHistory={roundsHistory}
        onClose={() => setOpened(false)}
      />
    </>
  );
};

export default VoteHistory;
