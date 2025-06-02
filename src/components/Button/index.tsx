import React from "react";
import styles from "./Button.module.css";

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
  const classNames: string[] = [styles.btn, styles[variant], styles[size]];

  if (loading) {
    classNames.push(styles.loading);
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
