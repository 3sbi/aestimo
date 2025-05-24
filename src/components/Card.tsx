import { cn } from "@/lib/utils";

type Props = {
  color?: string;
  children: string;
  onClick: (value: string) => void;
  selected: boolean;
};
const Card: React.FC<Props> = ({ color, children, onClick, selected }) => {
  return (
    <div
      className={cn("p-4 border-2 rounded-lg", selected ? "translate-y-1" : "")}
      style={{ backgroundColor: color }}
      onClick={() => onClick(children)}
    >
      {children}
    </div>
  );
};

export { Card };
