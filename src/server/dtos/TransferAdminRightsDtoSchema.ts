import { z } from "zod";

export const TransferAdminRightsDtoSchema = z.object({
  oldAdminId: z.number(),
  newAdminId: z.number(),
});

type TransferAdminRightsDto = z.infer<typeof TransferAdminRightsDtoSchema>;
export type { TransferAdminRightsDto };
