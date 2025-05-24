import { VoteType } from "@/server/types";

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
      { color: "rgb(158, 200, 254)", label: "1" },
      { color: "rgb(158, 200, 254)", label: "2" },
      { color: "rgb(163, 223, 242)", label: "3" },
      { color: "rgb(163, 223, 242)", label: "5" },
      { color: "rgb(157, 212, 154)", label: "8" },
      { color: "rgb(157, 212, 154)", label: "13" },
      { color: "rgb(244, 221, 148)", label: "20" },
      { color: "rgb(244, 221, 148)", label: "40" },
      { color: "rgb(243, 152, 147)", label: "100" },
    ],
  },
  {
    id: "tshirt",
    name: "T-Shirt",
    values: [
      { color: "rgb(158, 200, 254)", label: "XXS" },
      { color: "rgb(158, 200, 254)", label: "XS" },
      { color: "rgb(158, 200, 254)", label: "S" },
      { color: "rgb(163, 223, 242)", label: "M" },
      { color: "rgb(163, 223, 242)", label: "L" },
      { color: "rgb(244, 221, 148)", label: "XL" },
      { color: "rgb(244, 221, 148)", label: "XXL" },
    ],
  },
];
