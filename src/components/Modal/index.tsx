"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

type Props = {
  children: React.ReactNode;
  opened: boolean;
  trigger: React.JSX.Element;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: React.FC<Props> = ({ children, trigger, opened, setOpened }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (opened) {
      function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;
        if (ref.current && !ref.current.contains(target)) {
          setOpened(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [ref, opened, setOpened]);

  useEffect(() => {
    function closeOnEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpened(false);
      }
    }
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, [setOpened]);

  return (
    <>
      {React.cloneElement(trigger, { onClick: () => setOpened(true) })}
      {opened &&
        createPortal(
          <div className={styles.overlay}>
            <div className={styles.modal} ref={ref}>
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export { Modal };
