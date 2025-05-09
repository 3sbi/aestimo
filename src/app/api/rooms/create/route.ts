import { Rooms } from "@/services";
import "server-only";

export async function POST(request: Request) {
  const res = await request.json();
  Rooms.
  return Response.json({ res });
}
