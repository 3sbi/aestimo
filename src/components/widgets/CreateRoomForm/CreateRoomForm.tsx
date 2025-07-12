"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import RadioButton from "@/components/RadioButton";
import { SmallVoteCard } from "@/components/SmallVoteCard";
import { Switch } from "@/components/Switch";
import type { Dictionary } from "@/i18n/getDictionary";
import type { DefinedVoteType } from "@/server/consts/predefinedVoteTypes";
import type { VoteCard } from "@/types";
import { api } from "@/utils/api";
import { slugify } from "@/utils/slugify";
import { CircleQuestionMarkIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomVoteCard, VoteTypeCreator } from "./VoteTypeCreator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";

type Response = { slug: string };

type Props = {
  i18n: Dictionary["pages"]["home"]["createRoomForm"];
  predefinedVoteTypes: DefinedVoteType[];
};

const CreateRoomForm: React.FC<Props> = ({ i18n, predefinedVoteTypes }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [privateRoom, setPrivateRoom] = useState<boolean>(false);
  const [voteTypeId, setVoteTypeId] = useState<string>(
    predefinedVoteTypes[0].id
  );
  const [customVoteType, setCustomVoteType] = useState<CustomVoteCard[]>([]);

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
        const values: Record<string, string | boolean | VoteCard[]> = {
          name,
          username,
          voteOptions,
          private: privateRoom,
        };

        if (prefix) {
          values.prefix = prefix;
        }

        const res = await api.post("/api/rooms", values);
        if (res.ok) {
          const { slug }: Response = await res.json();
          router.replace(`/rooms/${slug}`);
        }
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const renderSlugHelper = (): string => {
    if (!prefix.length) {
      return i18n.slug.random;
    }
    const url: string = `${location.origin}/${slugify(prefix)}-xxxxxxx`;
    return `${i18n.slug.helper} ${url}`;
  };

  const renderCustomVoteType = (): React.JSX.Element => {
    return (
      <div className="flex flex-col">
        <div className="flex gap-2">
          <RadioButton
            id="custom"
            name="voteType"
            value="custom"
            checked={voteTypeId === "custom"}
            onChange={(e) => {
              const id = e.target.value;
              setVoteTypeId(id);
            }}
            label={
              <>
                <b className="min-w-32">{i18n.custom}</b>
                <div className="flex gap-0.5 flex-wrap">
                  {customVoteType.length === 0 ? (
                    <SmallVoteCard rainbow color="#fff" value="❓" />
                  ) : (
                    customVoteType.map((card) => (
                      <SmallVoteCard key={card.id} {...card} />
                    ))
                  )}
                </div>
              </>
            }
          />
        </div>

        {voteTypeId === "custom" && (
          <VoteTypeCreator
            cards={customVoteType}
            onChange={(newCards) => setCustomVoteType(newCards)}
            i18n={i18n.customVoteCard}
          />
        )}
      </div>
    );
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
          <Input
            type="text"
            name="prefix"
            label={i18n.slug.label}
            onChange={(e) => setPrefix(e.target.value)}
            helper={renderSlugHelper()}
          />
          <div className="flex items-center gap-2 mb-3">
            <Switch
              id="private"
              onChange={(value) => setPrivateRoom(value)}
              checked={privateRoom}
            />
            <div className="flex items-center gap-2">
              <label htmlFor="private">{i18n.private.label}</label>
              <Tooltip>
                <TooltipTrigger>
                  <CircleQuestionMarkIcon size={16} />
                </TooltipTrigger>
                <TooltipContent>{i18n.private.helper}</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <fieldset className="flex flex-col gap-4 mt-8 mb-8">
            <legend className="font-semibold mb-3">{i18n.checkboxes}</legend>
            {predefinedVoteTypes.map((option) => (
              <div className="flex gap-2 items-center" key={option.id}>
                <RadioButton
                  id={option.id}
                  name="voteType"
                  value={option.id}
                  checked={option.id === voteTypeId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setVoteTypeId(id);
                  }}
                  label={getLabel(option)}
                />
              </div>
            ))}
            {renderCustomVoteType()}
          </fieldset>
        </div>
        <Button
          variant="primary"
          className="mt-4"
          onClick={onFinish}
          type="button"
          disabled={loading}
        >
          {loading && <Loader2Icon className="animate-spin" size={20} />}
          {i18n.create}
        </Button>
      </form>
    </div>
  );
};

export { CreateRoomForm };
