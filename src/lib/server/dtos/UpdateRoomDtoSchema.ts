import { z } from "zod";

export const UpdateRoomDtoSchema = z.object({
  name: z.string().optional(),
  private: z.boolean().optional(),
  autoreveal: z.boolean().optional(),
});

type UpdateRoomDto = z.infer<typeof UpdateRoomDtoSchema>;
export type { UpdateRoomDto };
