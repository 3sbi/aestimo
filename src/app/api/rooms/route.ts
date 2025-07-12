import "server-only";

import { CreateRoomDtoSchema } from "@/server/dtos";
import { RoomNotFoundError, UserNotFoundError } from "@/server/errors";
import { roomsService } from "@/server/services";
import { getSession } from "@/server/session";
import { generateUniqueSlug } from "@/utils/generateUniqueSlug";
import { slugify } from "@/utils/slugify";
import { getDictionary, i18nConfig } from "@/i18n/getDictionary";

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
    return Response.json({ slug }, { status: 201 });
  } catch (err) {
    console.error(err);
    const locale = request.headers.get("referer") ?? i18nConfig.defaultLocale;
    const errors = getDictionary(locale).errors;
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: errors["Not found"] }, { status: 404 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
