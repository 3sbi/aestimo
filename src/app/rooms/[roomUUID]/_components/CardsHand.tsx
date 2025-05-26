"use client";

import { VoteCard } from "@/backend/types";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

type Props = {
  cards: VoteCard[];
  roomUUID: string;
  userId: number;
  setVoted: (voted: boolean) => void;
  initialSelectedIndex: number | null;
};

const CardsHand: React.FC<Props> = ({
  cards,
  roomUUID,
  setVoted,
  initialSelectedIndex,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialSelectedIndex
  );

  const onClick = async (index: number) => {
    if (index === selectedIndex) return;

    try {
      const body = { voteIndex: index };
      const res = await api.post(`/api/rooms/${roomUUID}/vote`, body);
      const json: { success: boolean } = await res.json();
      if (json.success) {
        setVoted(true);
        setSelectedIndex(index);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 flex-wrap m-auto">
      {cards.map((card, index) => {
        const { color, value } = card;
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
              "px-6 py-8 border-2 rounded-lg cursor-pointer font-bold text-4xl shadow-md transition",
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
