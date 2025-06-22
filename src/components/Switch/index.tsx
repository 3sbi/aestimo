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
      className={cn(styles.switchContainer, disabled ? styles.disabled : "")}
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
      <span className={styles.switchSlider} />
    </label>
  );
};

export { Switch };
