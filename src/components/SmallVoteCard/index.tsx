import type { VoteCard } from "@/types";
import { getContrastYIQ } from "@/utils/colors";
import React from "react";
import styles from "./SmallVoteCard.module.css";

const SmallVoteCard: React.FC<VoteCard> = ({ color, value }) => {
  const textColor = getContrastYIQ(color);

  return (
    <div
      title={value}
      className={styles.smallVoteCard}
      style={{ backgroundColor: color, color: textColor }}
    >
      {value}
    </div>
  );
};

export { SmallVoteCard };
