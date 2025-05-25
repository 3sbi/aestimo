import { CreateVoteDtoSchema } from "@/backend/dtos/CreateVoteDtoSchema";
import { roomsService } from "@/backend/services";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  const { roomUUID } = await params;

  try {
    const req = await request.json();
    const { success, error, data } = CreateVoteDtoSchema.safeParse(req);
    if (!success || !data) {
      console.log(error);
      return Response.json({ error: error.message }, { status: 422 });
    }

    const voteTypes = await roomsService.getVoteTypes(roomUUID);
    const vote = voteTypes.values[data.voteIndex];

    // TODO
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
