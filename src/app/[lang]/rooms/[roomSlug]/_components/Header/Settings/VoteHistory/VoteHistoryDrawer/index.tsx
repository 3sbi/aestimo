import { SmallVoteCard } from "@/components/SmallVoteCard";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientRoom } from "@/types";
import type { RoundHistory } from "@/types/EventData";
import { cn } from "@/utils/cn";
import { ArchiveIcon, FrownIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Tooltip from "./Tooltip";
import styles from "./VoteHistoryDrawer.module.css";

type Props = {
  opened: boolean;
  i18n: Dictionary["pages"]["room"]["vote-history"];
  roundsHistory: Record<ClientRoom["round"], RoundHistory>;
  onClose: () => void;
};

const VoteHistoryDrawer: React.FC<Props> = ({
  opened,
  i18n,
  roundsHistory,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        target === overlayRef.current
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, overlayRef, onClose]);

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
            {round.votes.length === 0 && (
              <div className={styles.noVotes}>
                {i18n["no-votes"]}
                <FrownIcon size={12} />
              </div>
            )}
            {round.votes.length > 0 &&
              round.votes.map((vote) => (
                <Tooltip label={vote.userName} key={vote.userId}>
                  <SmallVoteCard {...vote.option} />
                </Tooltip>
              ))}
          </div>
        </div>
      ));
  }
  if (!opened) return <></>;

  return createPortal(
    <div className={styles.overlay} ref={overlayRef}>
      <aside
        className={cn(styles.drawer, opened ? styles.opened : "")}
        ref={ref}
      >
        <div className={styles.history}>
          <h2 className="font-semibold text-center text-2xl mb-2">
            {i18n.header}
          </h2>
          {renderVotes()}
        </div>
      </aside>
    </div>,
    document.body
  );
};

export default VoteHistoryDrawer;
