"use client";

import { Dictionary } from "@/i18n/getDictionary";
import { VoteCard } from "@/types";
import { PaintBucketIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { ColorPicker } from "../ColorPicker";
import { getRandomPresetColor } from "../ColorPicker/colors";
import styles from "./VoteTypeCreator.module.css";

export type CustomVoteCard = VoteCard & { id: number };

type Props = {
  cards: CustomVoteCard[];
  onChange: (newValues: CustomVoteCard[]) => void;
  i18n: Dictionary["pages"]["home"]["createRoomForm"]["customVoteCard"];
};

const VoteTypeCreator: React.FC<Props> = ({ cards, onChange, i18n }) => {
  const [colorPickerShownIndex, setColorPickerShownIndex] = useState<
    number | null
  >(null);

  function renderAddButton() {
    return (
      <div
        className={styles.addButton}
        onClick={() =>
          onChange([
            ...cards,
            {
              id: cards.length + 1,
              color: getRandomPresetColor(),
              value: `${cards.length + 1}`,
            },
          ])
        }
      >
        <PlusCircleIcon size={20} />
      </div>
    );
  }

  function renderCard(card: CustomVoteCard, index: number) {
    const { id, color, value } = card;
    return (
      <div
        className={styles.voteCard}
        key={id}
        style={{ backgroundColor: color }}
      >
        <input
          size={1}
          id={`vote_${id}`}
          value={value}
          onChange={(e) => {
            e.preventDefault();
            const value = e.currentTarget.value;
            const newCards = [...cards];
            newCards[index].value = value;
            onChange(newCards);
          }}
        />
        <button type="button" className={styles.paintButton} title={i18n.color}>
          <PaintBucketIcon
            size={14}
            onClick={() => setColorPickerShownIndex(index)}
          />
        </button>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={(e) => {
            e.preventDefault();
            const newCards = cards.filter((card) => card.id !== id);
            onChange(newCards);
          }}
          title={i18n.delete}
        >
          <Trash2Icon size={14} />
        </button>

        <ColorPicker
          opened={index === colorPickerShownIndex}
          setClose={() => setColorPickerShownIndex(null)}
          color={color}
          onChange={(newColor) => {
            const newCards = [...cards];
            newCards[index].color = newColor;
            onChange(newCards);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-0.5 flex-wrap items-center mt-3">
      {cards.map(renderCard)}
      {renderAddButton()}
    </div>
  );
};

export { VoteTypeCreator };
