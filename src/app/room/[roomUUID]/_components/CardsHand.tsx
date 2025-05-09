import "server-only";

import React from "react";

interface Card {
  color: string;
  label: string;
}

type Props = {
  cards: Card[];
};

const CardsHand: React.FC<Props> = ({ cards }) => {
  return (
    <div className="card">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-4 border-2 rounded-r-lg"
          style={{ backgroundColor: card.color }}
        >
          {card.label}
        </div>
      ))}
    </div>
  );
};

export default CardsHand;
