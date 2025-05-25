import { z } from "zod";

export const CreateVoteDtoSchema = z.object({
  voteIndex: z.number(),
});

type CreateVoteDto = z.infer<typeof CreateVoteDtoSchema>;
export type { CreateVoteDto };
