import "server-only";

import { Room } from "@/types";

export type DefinedVoteType = {
  id: string;
  name: string;
  values: Room["voteOptions"];
};

export const PREDEFINED_VOTE_TYPES: DefinedVoteType[] = [
  {
    id: "short_fibonacci",
    name: "Short Fibonacci",
    values: [
      { color: "#9ec8fe", value: "1" },
      { color: "#9ec8fe", value: "2" },
      { color: "#a3dff2", value: "3" },
      { color: "#a3dff2", value: "5" },
      { color: "#9dd49a", value: "8" },
      { color: "#9dd49a", value: "13" },
      { color: "#f4dd94", value: "20" },
      { color: "#f4dd94", value: "40" },
      { color: "#f39893", value: "100" },
      { color: "#ffffff", value: "❓" },
    ],
  },
  {
    id: "tshirt",
    name: "T-Shirt",
    values: [
      { color: "#9ec8fe", value: "XXS" },
      { color: "#9ec8fe", value: "XS" },
      { color: "#9ec8fe", value: "S" },
      { color: "#a3dff2", value: "M" },
      { color: "#a3dff2", value: "L" },
      { color: "#f4dd94", value: "XL" },
      { color: "#f4dd94", value: "XXL" },
      { color: "#ffffff", value: "❓" },
    ],
  },
  {
    id: "Sprints",
    name: "Sprints",
    values: [
      { color: "#9ec8fe", value: "-1" },
      { color: "#a3dff2", value: "1" },
      { color: "#a3dff2", value: "2" },
      { color: "#9dd49a", value: "3" },
      { color: "#9dd49a", value: "4" },
      { color: "#f4dd94", value: "5" },
      { color: "#f39893", value: "5+" },
      { color: "#ffffff", value: "❓" },
    ],
  },
];
