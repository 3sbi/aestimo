"use client";

import { Card } from "@/components/Card";
import React from "react";

interface Card {
  color: string;
  label: string;
}

type Props = {
  roomId: number;
  cards: Card[];
};

const CardsHand: React.FC<Props> = ({ cards, roomId }) => {
  const onClick = (value: string) => {
    const data = { value, roomId };

    fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {cards.map((card) => (
        <Card key={card.label} color={card.color} onClick={onClick}>
          {card.label}
        </Card>
      ))}
    </div>
  );
};

export default CardsHand;
