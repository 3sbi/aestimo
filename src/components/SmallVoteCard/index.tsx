import type { VoteCard } from "@/types";
import { getContrastYIQ } from "@/utils/colors";
import React from "react";
import styles from "./SmallVoteCard.module.css";
import { cn } from "@/utils/cn";

const SmallVoteCard: React.FC<VoteCard & { rainbow?: boolean }> = ({
  color,
  value,
  rainbow,
}) => {
  const textColor = getContrastYIQ(color);

  const style: React.CSSProperties = {
    color: textColor,
  };

  if (!rainbow) {
    style.background = color;
  }

  return (
    <div
      title={value}
      className={cn(styles.smallVoteCard, rainbow ? styles.rainbowCard : "")}
      style={style}
    >
      {value}
    </div>
  );
};

export { SmallVoteCard };
