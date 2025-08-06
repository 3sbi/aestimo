"use client";

import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ClientUser } from "@/types";
import { api } from "@/utils/api";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLeaveModal } from "./AdminLeaveModal";

type Props = {
  user: Pick<ClientUser, "id" | "role">;
  i18n: Dictionary["pages"]["room"]["settings"]["leave"];
  users: ClientUser[];
};

const LeaveButton: React.FC<Props> = ({ user, i18n, users }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onLeave(newAdminId?: number) {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.delete(
        `/api/users/${user.id}`,
        newAdminId ? { newAdminId } : {}
      );
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

  if (user.role === "admin") {
    return (
      <AdminLeaveModal
        i18n={i18n}
        userId={user.id}
        users={users}
        onLeave={onLeave}
        trigger={
          <Button variant="destructive" title={i18n.label} loading={loading}>
            {i18n.label}
            <LogOutIcon />
          </Button>
        }
      />
    );
  }

  return (
    <Button
      variant="destructive"
      onClick={() => onLeave()}
      title={i18n.label}
      loading={loading}
    >
      {i18n.label}
      <LogOutIcon />
    </Button>
  );
};

export default LeaveButton;
