"use client";

import { Button } from "@/components/Button";
import { Dictionary } from "@/i18n/getDictionary";
import { api } from "@/utils/api";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  i18n: Dictionary["pages"]["room"]["header"];
  userId: number;
};

const BasicLeaveButton: React.FC<Props> = ({ userId, i18n }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onBasicLeave() {
    setLoading(true);
    try {
      const res = await api.delete(`/api/users/${userId}`);
      if (!res.ok) {
        router.replace("/");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={onBasicLeave}
      title={i18n.leave}
      size="icon"
      loading={loading}
    >
      <LogOutIcon />
    </Button>
  );
};

export { BasicLeaveButton };
