import { SmallVoteCard } from "@/components/SmallVoteCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom, ClientVote } from "@/types";
import { ArchiveIcon, ChevronLeftIcon } from "lucide-react";
import styles from "./HistoryDrawer.module.css";

type Props = {
  i18n: Dictionary["pages"]["room"]["historyDrawer"];
  votesHistory: Record<ClientRoom["round"], ClientVote[]>;
};

const HistoryDrawer: React.FC<Props> = ({ i18n, votesHistory }) => {
  function renderVotes() {
    if (Object.keys(votesHistory).length === 0) {
      return (
        <div className={styles.empty}>
          <ArchiveIcon size={32} />
          <p className="text-sm">{i18n.empty}</p>
        </div>
      );
    }

    return Object.entries(votesHistory)
      .reverse()
      .map(([round, votes]) => (
        <div className={styles.roundItem} key={round}>
          <h4 className="font-semibold text-xl">
            {i18n.round} {round}
          </h4>
          <div className={styles.roundItemVotes}>
            {votes.map((vote) => (
              <Tooltip key={vote.userId}>
                <TooltipTrigger>
                  <SmallVoteCard {...vote.option} />
                </TooltipTrigger>
                <TooltipContent>{vote.userName}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      ));
  }

  return (
    <aside className={styles.drawer}>
      <ChevronLeftIcon size={20} className={styles.chevron} />
      <div className={styles.history}>
        <h2 className="font-semibold text-center text-2xl mb-2">
          {i18n.header}
        </h2>
        {renderVotes()}
      </div>
    </aside>
  );
};

export { HistoryDrawer };
