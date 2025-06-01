import { UserNotFoundError } from "@/backend/errors";
import type { SseClient } from "@/backend/eventEmitter";
import { sseStore } from "@/backend/eventEmitter";
import { getSession } from "@/backend/session";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  const { roomUUID } = await params;
  const session = await getSession();
  const userUUID = session.userUUID;
  if (!userUUID) {
    throw new UserNotFoundError();
  }

  if (roomUUID !== session.roomUUID) {
    return Response.json({ error: "Not allowed" }, { status: 403 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        controller.enqueue(encoder.encode(data));
      };
      const client: SseClient = { roomUUID, UUID: userUUID, send };
      sseStore.addClient(client);
      req.signal?.addEventListener("abort", () => {
        sseStore.removeClient(client);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
}
