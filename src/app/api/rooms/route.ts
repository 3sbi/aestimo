import "server-only";

import { CreateRoomDtoSchema } from "@/backend/dtos";
import { RoomNotFoundError, UserNotFoundError } from "@/backend/errors";
import { roomsService } from "@/backend/services";
import { getSession } from "@/backend/session";
import { generateUniqueSlug } from "@/utils/generateUniqueSlug";
import { slugify } from "@/utils/slugify";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { success, error, data } = CreateRoomDtoSchema.safeParse(req);
    if (!success) {
      console.error(error);
      return Response.json({ error: error.message }, { status: 422 });
    }
    const { prefix, ...rest } = data;
    const sanitizedPrefix = slugify(prefix);
    const uniqueSlug = await generateUniqueSlug(sanitizedPrefix);

    const { room, user } = await roomsService.createRoom({
      ...rest,
      slug: uniqueSlug,
    });
    const session = await getSession();
    const { slug } = room;
    session.userId = user.id;
    session.roomSlug = slug;
    await session.save();
    return Response.json({ slug });
  } catch (err) {
    console.error(err);
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: err.message }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
