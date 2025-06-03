"use client";

import type { ClientRoom, VoteCard } from "@/types";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
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
      const res = await api.post(`/api/rooms/${room.uuid}/vote`, body);
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
    <div className="flex justify-center items-center gap-4 flex-wrap m-auto">
      {voteOptions.map((voteOption, index) => {
        const { color, value } = voteOption;
        const selected: boolean = index === selectedIndex;
        const style: React.CSSProperties = { backgroundColor: color };
        if (selected) {
          style.borderColor = "var(--card-foreground)";
        }
        return (
          <div
            key={value}
            className={cn(
              "px-6 py-8 border-2 rounded-lg cursor-pointer font-bold text-4xl shadow-md transition text-black",
              selected ? "-translate-y-4 border-2" : "",
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
