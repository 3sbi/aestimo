"use server";

import { CreateRoomDtoSchema } from "@/server/dtos/CreateRoomDtoSchema";
import { RoomsService } from "@/server/services";
import { redirect } from "next/navigation";

type CreateRoomActionState = {
  name: string;
  username: string;
  voteOptions: {
    color: string;
    label: string;
  }[];
  errors: {
    username?: string[];
    vote_type?: string[];
    form?: string[];
  };
};

export async function createRoom(
  prevState: CreateRoomActionState,
  formData: FormData
): Promise<CreateRoomActionState> {
  try {
    const req = Object.fromEntries(formData);
    const { success, error, data } = CreateRoomDtoSchema.safeParse(req);

    if (!success) {
      console.log(error);

      return {
        name: "",
        username: "",
        voteOptions: [],
        errors: { ...error.formErrors, form: error.formErrors.formErrors },
      };
    }

    const res = await RoomsService.createRoom(data);
    if (res === null) {
      return {
        name: data.name,
        username: data.username,
        voteOptions: data.voteOptions,
        errors: { form: ["Something went wrong"] },
      };
    }
    redirect(`/rooms/${res.room.uuid}`);
  } catch (error) {
    console.log(error);
    return {
      ...prevState,
      errors: { form: ["Something went wrong"] },
    };
  }
}
