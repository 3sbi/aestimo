import React, { useEffect, useRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import styles from "./ColorPicker.module.css";

const presetColors: string[] = [
  "#9ec8fe",
  "#a3dff2",
  "#9dd49a",
  "#f4dd94",
  "#f39893",
];

type Props = {
  opened: boolean;
  setClose: () => void;

  color: string;
  onChange: (newColor: string) => void;
};

const ColorPicker: React.FC<Props> = ({
  opened,
  setClose,
  color,
  onChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        opened &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setClose();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [opened, ref]);

  if (!opened) return <></>;
  return (
    <div className={styles.colorPickerWrapper} ref={ref}>
      <HexColorPicker color={color} onChange={onChange} />
      <div className="flex items-center gap-3 p-1">
        <div className="flex gap-1">
          {presetColors.map((color) => (
            <div
              key={color}
              className={styles.predefinedColor}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            ></div>
          ))}
        </div>
        <HexColorInput
          size={5}
          prefixed
          id="color-input"
          className={styles.colorInput}
          color={color}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export { ColorPicker };
