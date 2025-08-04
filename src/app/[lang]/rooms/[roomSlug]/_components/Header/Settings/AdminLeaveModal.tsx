"use client";

import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientUser } from "@/types";
import { Loader2Icon } from "lucide-react";
import React, { useId, useState } from "react";

type Props = {
  users: ClientUser[];
  userId: ClientUser["id"];
  i18n: Dictionary["pages"]["room"]["settings"]["leave"];
  trigger: React.JSX.Element;
  onLeave: (newAdminId?: number) => Promise<void>;
};

const AdminLeaveModal: React.FC<Props> = ({
  userId,
  users,
  i18n,
  trigger,
  onLeave,
}) => {
  const newAdminSelectId = useId();
  const [opened, setOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newAdminId, setNewAdminId] = useState<ClientUser["id"]>();

  return (
    <Modal trigger={trigger} opened={opened} setOpened={setOpened}>
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
        <Button variant="secondary" onClick={() => setOpened(false)}>
          {i18n.modal.cancel}
        </Button>
        <Button
          variant="destructive"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await onLeave(newAdminId);
            setLoading(false);
          }}
        >
          {loading && <Loader2Icon className="animate-spin" size={20} />}
          {i18n.modal.confirm}
        </Button>
      </div>
    </Modal>
  );
};

export { AdminLeaveModal };
