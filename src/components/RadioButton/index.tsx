import { cn } from "@/utils/cn";
import React from "react";
import styles from "./RadioButton.module.css";

type Props = {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  disabled?: boolean;
  label: React.JSX.Element;
};

const RadioButton: React.FC<Props> = ({
  id,
  name,
  value,
  checked,
  onChange,
  disabled,
  label,
}) => {
  return (
    <label
      className={cn(styles.radioContainer, disabled ? styles.disabled : "")}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={styles.customRadio} />
      {label && <div className={styles.radioLabel}>{label}</div>}
    </label>
  );
};

export default RadioButton;
