"use client";

import { Button } from "@/components/Button";
import { Dictionary } from "@/i18n/getDictionary";
import { ClientUser } from "@/types";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import styles from "./AdminLeaveModal.module.css";

type Props = {
  users: ClientUser[];
  userId: number;
  i18n: Dictionary["pages"]["room"]["header"];
  trigger: React.JSX.Element;
};

const AdminLeaveModal: React.FC<Props> = ({ userId, users, i18n, trigger }) => {
  const newAdminSelectId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newAdminId, setNewAdminId] = useState<ClientUser["id"]>();
  const router = useRouter();

  function closeModal() {
    setOpened(false);
  }

  useEffect(() => {
    function closeOnEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        closeModal();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  async function transferRights() {
    setLoading(true);
    try {
      const res = await api.delete(`/api/users/${userId}`, { newAdminId });
      if (res.ok) {
        router.replace("/");
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }

  async function onAdminLeave() {
    if (users.length > 1) {
      setOpened(true);
    } else {
      setLoading(true);
      try {
        const res = await api.delete(`/api/users/${userId}`, { newAdminId });
        if (res.ok) {
          router.replace("/");
        } else {
          const data = await res.json();
          toast.error(data.error);
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    }
  }

  function renderModal() {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal} ref={ref}>
          <label htmlFor={newAdminSelectId}>{i18n["select-new-admin"]}</label>
          <select
            name="users"
            id={newAdminSelectId}
            onChange={(e) => setNewAdminId(Number(e.target.value))}
          >
            {users
              .filter((user) => user.id !== userId)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
          <div className="flex gap-2 mt-2">
            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => setOpened(false)}
            >
              {i18n["cancel"]}
            </Button>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={transferRights}
            >
              {i18n["leave"]}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) return <></>;

  return (
    <>
      {React.cloneElement(trigger, { onClick: () => onAdminLeave() })}
      {opened && createPortal(renderModal(), document.body)}
    </>
  );
};

export { AdminLeaveModal };
