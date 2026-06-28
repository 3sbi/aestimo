import { z } from "zod";

export const UpdateUserDtoSchema = z.object({
  name: z.string().optional(),
});

type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
export type { UpdateUserDto };

