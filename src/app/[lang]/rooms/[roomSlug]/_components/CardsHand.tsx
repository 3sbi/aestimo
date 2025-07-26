"use client";

import type { ClientRoom, VoteCard } from "@/types";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { getContrastYIQ } from "@/utils/colors";
import React from "react";

type Props = {
  voteOptions: VoteCard[];
  room: ClientRoom;
  setVoted: () => void;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const CardsHand: React.FC<Props> = ({
  voteOptions,
  room,
  setVoted,
  selectedIndex,
  setSelectedIndex,
}) => {
  const roundFinished: boolean = room.status === "finished";

  const onClick = async (index: number) => {
    if (roundFinished) return;
    if (index === selectedIndex) return;
    try {
      const body = { voteIndex: index };
      const res = await api.post(`/api/rooms/${room.slug}/vote`, body);
      const json: { success: boolean } = await res.json();
      if (res.ok && json.success) {
        setVoted();
        setSelectedIndex(index);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 md:gap-6 flex-wrap m-auto">
      {voteOptions.map((voteOption, index) => {
        const { color, value } = voteOption;
        const selected: boolean = index === selectedIndex;
        const style: React.CSSProperties = {
          backgroundColor: color,
          color: getContrastYIQ(color),
        };
        if (selected) {
          style.borderColor = "var(--card-foreground)";
        }
        return (
          <div
            key={value}
            className={cn(
              "px-4 py-4 border-2 rounded-lg cursor-pointer font-bold text-4xl shadow-md transition text-black md:px-6 md:py-8 ",
              selected ? "-translate-y-6 scale-110 border-2" : "",
              roundFinished ? "opacity-60 cursor-not-allowed" : ""
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
