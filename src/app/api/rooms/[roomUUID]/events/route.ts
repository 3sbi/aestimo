import { UserNotFoundError } from "@/backend/errors";
import type { SseClient } from "@/backend/eventEmitter";
import { sseStore } from "@/backend/eventEmitter";
import { usersService } from "@/backend/services";
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

  const user = await usersService.getOneByUUID(userUUID);

  if (roomUUID !== session.roomUUID) {
    return Response.json({ error: "Not allowed" }, { status: 403 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        controller.enqueue(encoder.encode(data));
      };
      const client: SseClient = { roomUUID, UUID: userUUID, id: user.id, send };
      sseStore.addClient(client);
      sseStore.broadcast(client.roomUUID, {
        type: "user-update",
        data: { userId: user.id, update: { connected: true } },
      });

      req.signal?.addEventListener("abort", () => {
        sseStore.removeClient(client);
        sseStore.broadcast(client.roomUUID, {
          type: "user-update",
          data: { userId: client.id, update: { connected: false } },
        });
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
