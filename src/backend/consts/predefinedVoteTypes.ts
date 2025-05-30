import "server-only";

import { VoteType } from "@/types";

export type DefinedVoteType = {
  id: string;
  name: VoteType["name"];
  values: VoteType["values"];
};

export const PREDEFINED_VOTE_TYPES: DefinedVoteType[] = [
  {
    id: "short_fibonacci",
    name: "Short Fibonacci",
    values: [
      { color: "rgb(158, 200, 254)", value: "1" },
      { color: "rgb(158, 200, 254)", value: "2" },
      { color: "rgb(163, 223, 242)", value: "3" },
      { color: "rgb(163, 223, 242)", value: "5" },
      { color: "rgb(157, 212, 154)", value: "8" },
      { color: "rgb(157, 212, 154)", value: "13" },
      { color: "rgb(244, 221, 148)", value: "20" },
      { color: "rgb(244, 221, 148)", value: "40" },
      { color: "rgb(243, 152, 147)", value: "100" },
    ],
  },
  {
    id: "tshirt",
    name: "T-Shirt",
    values: [
      { color: "rgb(158, 200, 254)", value: "XXS" },
      { color: "rgb(158, 200, 254)", value: "XS" },
      { color: "rgb(158, 200, 254)", value: "S" },
      { color: "rgb(163, 223, 242)", value: "M" },
      { color: "rgb(163, 223, 242)", value: "L" },
      { color: "rgb(244, 221, 148)", value: "XL" },
      { color: "rgb(244, 221, 148)", value: "XXL" },
    ],
  },
];
