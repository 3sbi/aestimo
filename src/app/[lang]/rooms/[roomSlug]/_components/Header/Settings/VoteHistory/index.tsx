import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/getDictionary";
import type { RoundHistory } from "@/types/EventData";
import { HistoryIcon } from "lucide-react";
import { useState } from "react";
import VoteHistoryDrawer from "./VoteHistoryDrawer";

type Props = {
  i18n: Dictionary["pages"]["room"];
  roundsHistory: Record<number, RoundHistory>;
};

const VoteHistory: React.FC<Props> = ({ i18n, roundsHistory }) => {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        title={i18n["vote-history"].header}
        onClick={() => setOpened(!opened)}
      >
        <HistoryIcon />
      </Button>
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
