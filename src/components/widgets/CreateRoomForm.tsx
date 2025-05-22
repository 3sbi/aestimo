"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { DefinedVoteType } from "@/consts/predefinedVoteTypes";
import { PREDEFINED_VOTE_TYPES } from "@/consts/predefinedVoteTypes";
import { Loader2Icon } from "lucide-react";
import Form from "next/form";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { create } from "./actions";

const initialState = {
  name: "",
  username: "",
  vote_type: PREDEFINED_VOTE_TYPES[0].id,
};

type Props = {
  i18n: {
    username: string;
    roomName: string;
    checkboxes: string;
    create: string;
  };
};

const CreateRoomForm: React.FC<Props> = ({ i18n }) => {
  const { pending } = useFormStatus();
  const [state, formAction] = useActionState(create, initialState);
  const getLabel = (option: DefinedVoteType): string => {
    return `${option.name} (${option.values.map((o) => o.label).join(", ")})`;
  };

  return (
    <Form action={formAction}>
      <Input type="text" name="name" label={i18n.roomName} />
      <Input type="text" name="username" label={i18n.username} />
      <fieldset className="flex flex-col gap-1">
        <legend>{i18n.checkboxes}</legend>
        {PREDEFINED_VOTE_TYPES.map((option) => (
          <div className="flex gap-2" key={option.id}>
            <input
              type="radio"
              id={option.id}
              name="vote_type"
              value={option.id}
            />
            <label htmlFor={option.id}>{getLabel(option)}</label>
          </div>
        ))}
      </fieldset>
      <Button variant="primary" className="mt-4">
        {pending && (
          <Loader2Icon className="animate-spin" width={20} height={20} />
        )}
        {i18n.create}
      </Button>
    </Form>
  );
};

export default CreateRoomForm;
