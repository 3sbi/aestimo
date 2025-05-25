import { roomsService } from "@/backend/services";

export async function DELETE(
  _: Request,
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
