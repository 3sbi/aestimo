import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ClientRoom, ClientVote } from "@/types";
import styles from "./VotesHistory.module.css";

type Props = {
  i18n: Dictionary["room"]["header"];
  votesHistory: Record<ClientRoom["round"], ClientVote[]>;
};

const VotesHistory: React.FC<Props> = ({ i18n, votesHistory }) => {
  return (
    <div className={styles.votesHistory}>
      {Object.keys(votesHistory).map((round) => (
        <div className={styles.roundItem} key={round}>
          <h4 className="font-semibold text-xl">
            {i18n.round} {round}
          </h4>
          <div className={styles.roundItemVotes}>
            {votesHistory[Number(round)].map((vote) => (
              <Tooltip key={vote.userId}>
                <TooltipTrigger>
                  <div
                    key={vote.userId}
                    className={styles.card}
                    style={{ backgroundColor: vote.option.color }}
                  >
                    {vote.option.value}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{vote.userName}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export { VotesHistory };
