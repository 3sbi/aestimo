import { z } from "zod";

export const JoinRoomDtoSchema = z.object({
  username: z.string(),
  roomSlug: z.string(),
});

type JoinRoomDto = z.infer<typeof JoinRoomDtoSchema>;
export type { JoinRoomDto };

