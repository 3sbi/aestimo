import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientRoom, ClientVote } from "@/types";
import { ChevronLeftIcon } from "lucide-react";
import styles from "./HistoryDrawer.module.css";
import { SmallVoteCard } from "@/components/SmallVoteCard";

type Props = {
  i18n: Dictionary["pages"]["room"]["historyDrawer"];
  votesHistory: Record<ClientRoom["round"], ClientVote[]>;
};

const HistoryDrawer: React.FC<Props> = ({ i18n, votesHistory }) => {
  return (
    <aside className={styles.drawer}>
      <div className="relative flex flex-col items-center h-full">
        <ChevronLeftIcon size={20} className={styles.chevron} />
        <div className={styles.history}>
          <h2 className="font-semibold text-2xl mb-2">{i18n.header}</h2>
          {Object.entries(votesHistory)
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
            ))}
        </div>
      </div>
    </aside>
  );
};

export { HistoryDrawer };
