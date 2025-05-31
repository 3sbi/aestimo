import emitter from "@/backend/eventEmitter";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: Record<string, string>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      emitter.on("join", sendEvent);
      emitter.on("restart", sendEvent);
      emitter.on("reveal", sendEvent);
      emitter.on("vote", sendEvent);

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(": keep-alive\n\n"));
      }, 10000);

      req.signal?.addEventListener("abort", () => {
        clearInterval(keepAlive);
        emitter.off("join", sendEvent);
        emitter.off("restart", sendEvent);
        emitter.off("reveal", sendEvent);
        emitter.off("vote", sendEvent);
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
