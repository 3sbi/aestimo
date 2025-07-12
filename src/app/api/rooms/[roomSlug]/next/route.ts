import { getDictionary, i18nConfig } from "@/i18n/getDictionary";
import {
  RoomNotFoundError,
  UserNotAdminError,
  UserNotFoundError,
} from "@/server/errors";
import { sseStore } from "@/server/eventEmitter";
import { roomsService, usersService } from "@/server/services";
import type { NextRoundEvent } from "@/types/EventData";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const { roomSlug } = await params;
    const { isAdmin, userId } = await usersService.isAdmin();
    if (!isAdmin) {
      throw new UserNotAdminError();
    }

    const data = await roomsService.goToNextRound(roomSlug);
    const event: NextRoundEvent = { type: "next-round", data };
    sseStore.broadcast(roomSlug, event, userId);
    return Response.json(event["data"]);
  } catch (err) {
    console.error(err);
    const locale = request.headers.get("referer") ?? i18nConfig.defaultLocale;
    const errors = getDictionary(locale).errors;
    if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
      return Response.json({ error: errors["Not found"] }, { status: 404 });
    }

    if (err instanceof UserNotAdminError) {
      Response.json({ error: errors["Not admin"] }, { status: 403 });
    }

    return Response.json({ error: err }, { status: 500 });
  }
}
