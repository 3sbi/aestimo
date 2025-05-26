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
    <div className="flex items-center gap-4 flex-wrap m-auto">
      {cards.map((card, index) => {
        const { color, value } = card;
        const selected: boolean = index === selectedIndex;
        return (
          <div
            key={value}
            className={cn(
              "px-6 py-8 border-1 rounded-lg cursor-pointer font-bold text-4xl",
              selected ? "-translate-y-2" : ""
            )}
            title={value}
            style={{ backgroundColor: color }}
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
