import emitter from "@/backend/eventEmitter";
import { getSession } from "@/backend/session";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: Record<string, string>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const deleteSendEvent = async (data: Record<string, string>) => {
        session.destroy();
        sendEvent(data);
      };

      emitter.on("join", sendEvent);
      emitter.on("restart", sendEvent);
      emitter.on("reveal", sendEvent);
      emitter.on("vote", sendEvent);
      emitter.on("next", sendEvent);
      emitter.on("delete", deleteSendEvent);

      req.signal?.addEventListener("abort", () => {
        emitter.off("join", sendEvent);
        emitter.off("restart", sendEvent);
        emitter.off("reveal", sendEvent);
        emitter.off("vote", sendEvent);
        emitter.on("next", sendEvent);
        emitter.off("delete", deleteSendEvent);
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
