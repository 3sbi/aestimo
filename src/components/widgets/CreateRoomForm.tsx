"use client";

import type { DefinedVoteType } from "@/backend/consts/predefinedVoteTypes";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { api } from "@/lib/api";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Response = { roomUUID: string };

type Props = {
  i18n: {
    username: string;
    roomName: string;
    checkboxes: string;
    create: string;
  };
  predefinedVoteTypes: DefinedVoteType[];
};

const CreateRoomForm: React.FC<Props> = ({ i18n, predefinedVoteTypes }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [voteTypeId, setVoteTypeIdId] = useState<string>(
    predefinedVoteTypes[0].id
  );

  const getLabel = (option: DefinedVoteType): string => {
    return `${option.name} (${option.values.map((o) => o.value).join(", ")})`;
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const options = predefinedVoteTypes.find(
        (option) => option.id === voteTypeId
      );

      if (options) {
        const values = {
          name,
          username,
          voteOptions: options?.values,
        };

        const res = await api.post("/api/rooms", values);
        if (res.ok) {
          const { roomUUID }: Response = await res.json();
          router.replace(`/rooms/${roomUUID}`);
        }
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <form className="flex flex-col justify-between">
      <div>
        <Input
          type="text"
          name="name"
          label={i18n.roomName}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          name="username"
          label={i18n.username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <fieldset className="flex flex-col gap-1">
          <legend>{i18n.checkboxes}</legend>
          {predefinedVoteTypes.map((option) => (
            <div className="flex gap-2" key={option.id}>
              <input
                type="radio"
                id={option.id}
                name="voteType"
                value={option.id}
                checked={option.id === voteTypeId}
                onChange={(e) => {
                  const id = e.target.value;
                  setVoteTypeIdId(id);
                }}
              />
              <label htmlFor={option.id}>{getLabel(option)}</label>
            </div>
          ))}
        </fieldset>
      </div>
      <Button
        variant="primary"
        className="mt-4"
        onClick={onFinish}
        type="button"
        disabled={loading}
      >
        {loading && (
          <Loader2Icon className="animate-spin" width={20} height={20} />
        )}
        {i18n.create}
      </Button>
    </form>
  );
};

export default CreateRoomForm;
