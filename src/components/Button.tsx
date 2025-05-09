import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant: "primary" | "outline";
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string | undefined;
}

const Button: React.FC<Props> = ({ variant, children, className, ...rest }) => {
  const classNames: string[] = ["btn"];

  switch (variant) {
    case "outline": {
      classNames.push("outline");
      break;
    }
    default:
    case "primary":
      classNames.push("primary");
  }

  if (className) {
    classNames.push(className);
  }

  return (
    <button className={classNames.join(" ")} {...rest}>
      {children}
    </button>
  );
};

export default Button;
