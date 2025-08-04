import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary" | "destructive";
  size?: "default" | "icon";
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  loading?: boolean;
  className?: string | undefined;
}

const Button: React.FC<Props> = ({
  variant = "primary",
  size = "default",
  children,
  className,
  loading,
  ...rest
}) => {
  const classNames: string[] = ["btn", `${variant}`, `${size}`];

  if (loading) {
    classNames.push("loading");
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

export { Button };
