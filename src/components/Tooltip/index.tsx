import { cn } from "@/utils/cn";
import { ReactElement, useLayoutEffect, useRef, useState } from "react";
import styles from "./Tooltip.module.css";

type Props = {
  label?: string | null;
  className?: string;
  children: ReactElement;
  disabled?: boolean;
  block?: boolean;
  opened?: boolean;
};

function Tooltip({ label, className, children, opened }: Props) {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState<{ left: number; transform: string }>(
    {
      left: 50,
      transform: "translateX(-50%)",
    }
  );
  const [placement, setPlacement] = useState<"top" | "bottom">("top");

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isOpen = typeof opened === "boolean" ? opened : hovered;

  useLayoutEffect(() => {
    if (isOpen && tooltipRef.current && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      let left = containerRect.width / 2;
      let transform = "translateX(-50%)";

      const spaceLeft = containerRect.left + left - tooltipRect.width / 2;
      const spaceRight =
        window.innerWidth - (containerRect.left + left + tooltipRect.width / 2);

      if (spaceLeft < 0) {
        left = 0;
        transform = "translateX(0)";
      } else if (spaceRight < 0) {
        left = containerRect.width;
        transform = "translateX(-100%)";
      }

      const spaceAbove = containerRect.top;
      const spaceBelow = window.innerHeight - containerRect.bottom;

      let verticalPlacement: "top" | "bottom" = "top";
      if (spaceAbove < tooltipRect.height + 10 && spaceBelow > spaceAbove) {
        verticalPlacement = "bottom";
      }
      setPlacement(verticalPlacement);
      setPosition({ left, transform });
    }
  }, [isOpen]);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isOpen && (
        <div
          ref={tooltipRef}
          className={cn(styles.tooltip, styles[placement], className)}
          style={{
            left: position.left,
            transform: `${position.transform} ${
              placement === "top"
                ? "translateY(calc(-100% - 10px))"
                : "translateY(calc(100% + 10px))"
            }`,
          }}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

export default Tooltip;
