"use client";

import { cn } from "@/utils/cn";
import React from "react";
import styles from "./Switch.module.css";

type Props = {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
};

const Switch: React.FC<Props> = ({ id, checked, disabled, onChange }) => {
  return (
    <label
      className={cn(styles["switch-container"], disabled ? "disabled" : "")}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          if (onChange) onChange(!!event.target.checked);
        }}
      />
      <span className={styles["switch-slider"]} />
    </label>
  );
};

export { Switch };
