import { z } from "zod";

export const CreateRoomDtoSchema = z.object({
  name: z.string(),
  username: z.string(),
  voteOptions: z.array(
    z.object({
      color: z.string(),
      value: z.string(),
    })
  ),
  private: z.boolean(),
});

type CreateRoomDto = z.infer<typeof CreateRoomDtoSchema>;
export type { CreateRoomDto };
