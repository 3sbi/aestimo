type Props = {
  color?: string;
  children: string;
  onClick: (value: string) => void;
};
const Card: React.FC<Props> = ({ color, children, onClick }) => {
  return (
    <div
      className="p-4 border-2 rounded-lg"
      style={{ backgroundColor: color }}
      onClick={() => onClick(children)}
    >
      {children}
    </div>
  );
};

export { Card };
