import { UserNotFoundError } from "@/server/errors";
import type { SseClient } from "@/server/eventEmitter";
import { sseStore } from "@/server/eventEmitter";
import { usersService } from "@/server/services";
import { getSession } from "@/server/session";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  const { roomSlug } = await params;
  const session = await getSession();
  const userId = session.userId;
  if (typeof userId !== "number") {
    throw new UserNotFoundError();
  }

  const user = await usersService.getOne(userId);

  if (roomSlug !== session.roomSlug) {
    return Response.json({ error: "Not allowed" }, { status: 403 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => controller.enqueue(encoder.encode(data));

      const client: SseClient = {
        roomSlug,
        id: userId,
        send,
      };
      sseStore.addClient(client);
      sseStore.broadcast(roomSlug, {
        type: "user-update",
        data: { userId: user.id, update: { connected: true } },
      });

      req.signal?.addEventListener("abort", () => {
        sseStore.removeClient(client);
        sseStore.broadcast(roomSlug, {
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
