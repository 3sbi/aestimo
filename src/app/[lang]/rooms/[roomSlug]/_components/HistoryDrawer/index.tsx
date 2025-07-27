import { SmallVoteCard } from "@/components/SmallVoteCard";
import Tooltip from "@/components/Tooltip";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom } from "@/types";
import type { RoundHistory } from "@/types/EventData";
import { ArchiveIcon, ChevronLeftIcon } from "lucide-react";
import styles from "./HistoryDrawer.module.css";

type Props = {
  i18n: Dictionary["pages"]["room"]["historyDrawer"];
  roundsHistory: Record<ClientRoom["round"], RoundHistory>;
};

const HistoryDrawer: React.FC<Props> = ({ i18n, roundsHistory }) => {
  function renderTimestamp(round: RoundHistory): React.JSX.Element {
    if (!round?.endedAt) return <></>;
    const timestamp = `${new Date(
      round.endedAt
    ).toLocaleDateString()} ${new Date(round.endedAt).toLocaleTimeString()}`;
    return (
      <span className={styles.timestamp} title={timestamp}>
        {timestamp}
      </span>
    );
  }

  function renderVotes() {
    if (Object.keys(roundsHistory).length === 0) {
      return (
        <div className={styles.empty}>
          <ArchiveIcon size={32} />
          <p className="text-sm">{i18n.empty}</p>
        </div>
      );
    }

    return Object.entries(roundsHistory)
      .reverse()
      .map(([roundNumber, round]) => (
        <div className={styles.roundItem} key={roundNumber}>
          <div className="flex items-baseline gap-1">
            <h4 className="font-semibold text-lg truncate">
              {`${i18n.round} ${roundNumber}`}
            </h4>
            {renderTimestamp(round)}
          </div>
          <div className={styles.roundItemVotes}>
            {round.votes.map((vote) => (
              <Tooltip label={vote.userName} key={vote.userId}>
                <SmallVoteCard {...vote.option} />
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
