import { z } from "zod";

export const CreateUserDtoSchema = z.object({
  name: z.string(),
  roomId: z.number(),
  role: z.enum(["admin", "basic"]),
});

type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type { CreateUserDto };
