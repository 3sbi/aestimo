import { z } from "zod";

export const ClientUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  voted: z.boolean(),
  role: z.enum(["admin", "basic"]),
  connected: z.boolean(),
  vote: z
    .object({
      color: z.string(),
      value: z.string(),
    })
    .nullable()
    .optional(),
});
