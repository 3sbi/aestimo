"use client";

import { VoteCard } from "@/types";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import React from "react";

type Props = {
  voteOptions: VoteCard[];
  roomUUID: string;
  userId: number;
  setVoted: (voted: boolean) => void;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const CardsHand: React.FC<Props> = ({
  voteOptions,
  roomUUID,
  setVoted,
  selectedIndex,
  setSelectedIndex,
}) => {
  const onClick = async (index: number) => {
    if (index === selectedIndex) return;

    try {
      const body = { voteIndex: index };
      const res = await api.post(`/api/rooms/${roomUUID}/vote`, body);
      const json: { success: boolean } = await res.json();
      if (res.ok && json.success) {
        setVoted(true);
        setSelectedIndex(index);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 flex-wrap m-auto">
      {voteOptions.map((voteOption, index) => {
        const { color, value } = voteOption;
        const selected: boolean = index === selectedIndex;
        const style: React.CSSProperties = { backgroundColor: color };
        if (selected) {
          style.borderColor = "var(--card-foreground)";
          style.borderWidth = "2px";
        }
        return (
          <div
            key={value}
            className={cn(
              "px-6 py-8 border-2 rounded-lg cursor-pointer font-bold text-4xl shadow-md transition text-black",
              selected ? "-translate-y-4" : ""
            )}
            title={value}
            style={style}
            onClick={() => onClick(index)}
          >
            {value}
          </div>
        );
      })}
    </div>
  );
};

export default CardsHand;
