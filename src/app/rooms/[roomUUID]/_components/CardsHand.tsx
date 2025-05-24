"use client";

import { Card } from "@/components/Card";
import React, { useState } from "react";

interface Card {
  color: string;
  label: string;
}

type Props = {
  cards: Card[];
};

const CardsHand: React.FC<Props> = ({ cards }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const onClick = async (value: string, index: number) => {
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ value }),
      });
      const json: { success: boolean } = await res.json();
      if (json.success) {
        setSelectedIndex(index);
      }
    } catch (err) {}
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
