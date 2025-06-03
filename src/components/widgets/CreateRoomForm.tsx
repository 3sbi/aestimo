"use client";

import type { DefinedVoteType } from "@/backend/consts/predefinedVoteTypes";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { Dictionary } from "@/i18n/get-dictionary";
import { api } from "@/utils/api";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Switch } from "../Switch";

type Response = { roomUUID: string };

type Props = {
  i18n: Dictionary["createRoomForm"];
  predefinedVoteTypes: DefinedVoteType[];
};

const CreateRoomForm: React.FC<Props> = ({ i18n, predefinedVoteTypes }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [privateRoom, setPrivateRoom] = useState<boolean>(false);
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
          private: privateRoom,
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
    <div>
      <div className="px-6 py-3">
        <h1 className="text-center font-semibold text-lg">{i18n.header}</h1>
      </div>
      <hr className="w-full" />
      <form className="flex flex-col px-6 pb-6 pt-3 grow">
        <div className="grow">
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
          <div className="flex items-center gap-2 mb-3">
            <Switch
              id="private"
              onCheckedChange={(value) => {
                setPrivateRoom(value);
              }}
              checked={privateRoom}
            />
            <label htmlFor="private">{i18n.private}</label>
          </div>
          <fieldset className="flex flex-col gap-1">
            <legend className="font-semibold mb-1">{i18n.checkboxes}</legend>
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
    </div>
  );
};

export { CreateRoomForm };
