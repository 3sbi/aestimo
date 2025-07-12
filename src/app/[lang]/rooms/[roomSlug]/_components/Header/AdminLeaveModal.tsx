"use client";

import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Dictionary } from "@/i18n/getDictionary";
import type { ClientUser } from "@/types";
import { api } from "@/utils/api";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useId, useState } from "react";
import { toast } from "sonner";

type Props = {
  users: ClientUser[];
  userId: ClientUser["id"];
  i18n: Dictionary["pages"]["room"]["header"];
  trigger: React.JSX.Element;
};

const AdminLeaveModal: React.FC<Props> = ({ userId, users, i18n, trigger }) => {
  const newAdminSelectId = useId();
  const [opened, setOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newAdminId, setNewAdminId] = useState<ClientUser["id"]>();
  const router = useRouter();

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
      console.error(err);
    }
    setLoading(false);
  }

  if (users.length < 2) return <></>;

  return (
    <Modal trigger={trigger} opened={opened} setOpened={setOpened}>
      <label htmlFor={newAdminSelectId}>{i18n["select-new-admin"]}</label>
      <select
        name="users"
        id={newAdminSelectId}
        onChange={(e) => {
          setNewAdminId(Number(e.target.value));
        }}
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
        <Button variant="secondary" onClick={() => setOpened(false)}>
          {i18n["cancel"]}
        </Button>
        <Button
          variant="destructive"
          disabled={loading}
          onClick={transferRights}
        >
          {loading && <Loader2Icon className="animate-spin" size={20} />}
          {i18n["leave"]}
        </Button>
      </div>
    </Modal>
  );
};

export { AdminLeaveModal };
