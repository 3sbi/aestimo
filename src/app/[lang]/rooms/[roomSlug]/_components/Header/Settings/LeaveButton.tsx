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
  roomSlug: string;
};

const LeaveButton: React.FC<Props> = ({ user, i18n, users, roomSlug }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function deleteRoom() {
    try {
      const res = await api.delete(`/api/rooms/${roomSlug}`);
      if (res.ok) {
        router.replace("/");
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function removeUser(newAdminId?: number) {
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
      console.error(err);
    }
  }

  if (user.role === "admin" && users.length > 1) {
    return (
      <AdminLeaveModal
        i18n={i18n}
        userId={user.id}
        users={users}
        onLeave={removeUser}
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
      onClick={() => {
        if (loading) return;
        setLoading(true);
        if (user.role === "admin" && users.length === 1) {
          deleteRoom();
        } else {
          removeUser();
        }
        setLoading(false);
      }}
      title={i18n.label}
      loading={loading}
    >
      {i18n.label}
      <LogOutIcon />
    </Button>
  );
};

export default LeaveButton;
