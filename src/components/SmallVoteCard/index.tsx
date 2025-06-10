import { VoteCard } from "@/types";
import React from "react";
import styles from "./SmallVoteCard.module.css";

const SmallVoteCard: React.FC<VoteCard> = ({ color, value }) => {
  function getContrastYIQ(hexcolor: string) {
    const r = parseInt(hexcolor.substring(1, 3), 16);
    const g = parseInt(hexcolor.substring(3, 5), 16);
    const b = parseInt(hexcolor.substring(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  }

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
