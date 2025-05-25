"use client";

import { VoteCard } from "@/backend/types";
import { Card } from "@/components/Card";
import React, { useState } from "react";

type Props = {
  cards: VoteCard[];
  roomUUID: string;
  userId: number;
  setVoted: (voted: boolean) => void;
};

const CardsHand: React.FC<Props> = ({ cards, roomUUID, setVoted }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const onClick = async (value: string, index: number) => {
    if (index === selectedIndex) return;

    try {
      const res = await fetch(`/api/${roomUUID}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ value }),
      });
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
    <div className="flex gap-1 flex-wrap">
      {cards.map((card, index) => (
        <Card
          key={card.label}
          color={card.color}
          onClick={(value) => onClick(value, index)}
          selected={index === selectedIndex}
        >
          {card.label}
        </Card>
      ))}
    </div>
  );
};

export default CardsHand;
