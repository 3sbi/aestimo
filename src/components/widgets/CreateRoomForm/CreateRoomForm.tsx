"use client";

import type { DefinedVoteType } from "@/backend/consts/predefinedVoteTypes";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { Dictionary } from "@/i18n/getDictionary";
import { api } from "@/utils/api";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SmallVoteCard } from "../../SmallVoteCard";
import { Switch } from "../../Switch";
import { getRandomPresetColor } from "./ColorPicker/colors";
import { CustomVoteCard, VoteTypeCreator } from "./VoteTypeCreator";

type Response = { roomUUID: string };

type Props = {
  i18n: Dictionary["pages"]["home"]["createRoomForm"];
  predefinedVoteTypes: DefinedVoteType[];
};

const CreateRoomForm: React.FC<Props> = ({ i18n, predefinedVoteTypes }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [privateRoom, setPrivateRoom] = useState<boolean>(false);
  const [voteTypeId, setVoteTypeId] = useState<string>(
    predefinedVoteTypes[0].id
  );
  const [customVoteType, setCustomVoteType] = useState<CustomVoteCard[]>([
    { id: 1, value: "1", color: getRandomPresetColor() },
  ]);

  const getLabel = (option: DefinedVoteType): React.JSX.Element => {
    return (
      <>
        <b className="min-w-32">{option.name}</b>
        <div className="flex gap-0.5 flex-wrap">
          {option.values.map((card) => (
            <SmallVoteCard key={card.value} {...card} />
          ))}
        </div>
      </>
    );
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const voteOptions =
        voteTypeId === "custom"
          ? customVoteType
          : predefinedVoteTypes.find(({ id }) => id === voteTypeId)?.values;

      if (voteOptions) {
        const values = {
          name,
          username,
          voteOptions,
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
              onCheckedChange={(value) => setPrivateRoom(value)}
              checked={privateRoom}
            />
            <label htmlFor="private">{i18n.private}</label>
          </div>
          <fieldset className="flex flex-col gap-4 mt-8 mb-8">
            <legend className="font-semibold mb-3">{i18n.checkboxes}</legend>
            {predefinedVoteTypes.map((option) => (
              <div className="flex gap-2 items-center" key={option.id}>
                <input
                  type="radio"
                  id={option.id}
                  name="voteType"
                  value={option.id}
                  checked={option.id === voteTypeId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setVoteTypeId(id);
                  }}
                />
                <label
                  className="flex items-center gap-1 w-full"
                  htmlFor={option.id}
                >
                  {getLabel(option)}
                </label>
              </div>
            ))}
            <div className="flex flex-col">
              <div className="flex gap-2">
                <input
                  type="radio"
                  id="custom"
                  name="voteType"
                  value="custom"
                  checked={voteTypeId === "custom"}
                  onChange={(e) => {
                    const id = e.target.value;
                    setVoteTypeId(id);
                  }}
                />
                <label
                  className="flex items-center gap-1 w-full"
                  htmlFor="custom"
                >
                  <b className="min-w-32">Custom</b>
                  <div className="flex gap-0.5 flex-wrap">
                    {customVoteType.map((card) => (
                      <SmallVoteCard key={card.id} {...card} />
                    ))}
                  </div>
                </label>
              </div>

              {voteTypeId === "custom" && (
                <VoteTypeCreator
                  cards={customVoteType}
                  onChange={(newCards) => setCustomVoteType(newCards)}
                  i18n={i18n.customVoteCard}
                />
              )}
            </div>
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
