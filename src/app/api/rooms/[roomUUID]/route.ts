import { NextRequest } from "next/server";
import { roomsService } from "@/backend/services";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ roomUUID: string }> }
) {
  try {
    const { roomUUID } = await params;
    const success = roomsService.delete(roomUUID);
    return Response.json({ success });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}

const clients = new Set<WritableStreamDefaultWriter>();

export async function GET(req: NextRequest) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  clients.add(writer);

  const encoder = new TextEncoder();

  // Optional: keep connection alive
  const keepAlive = setInterval(() => {
    writer.write(encoder.encode(":\n\n")); // comment line (ping)
  }, 30000);

  // Close connection when client disconnects
  req.signal.addEventListener("abort", () => {
    clearInterval(keepAlive);
    writer.close();
    clients.delete(writer);
  });

  return new Response(stream.readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Broadcast helper (you can import this in other route files)
export async function broadcast(data: any) {
  const encoder = new TextEncoder();
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  const encoded = encoder.encode(payload);

  for (const client of clients) {
    try {
      await client.write(encoded);
    } catch (err) {
      clients.delete(client);
    }
  }
}
