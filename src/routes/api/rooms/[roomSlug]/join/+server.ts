import { getDictionary, i18nConfig } from '$lib/i18n';
import { JoinRoomDtoSchema } from '$lib/server/dtos';
import { ClientUserSchema } from '$lib/server/dtos/ClientUserSchema';
import { RoomNotFoundError, UserNotFoundError } from '$lib/server/errors';
import { sseStore } from '$lib/server/eventEmitter';
import { roomsService } from '$lib/server/services';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import type { Event } from '$lib/types/EventData';

export const POST: RequestHandler = async ({ request, params, locals, cookies }) => {
	try {
		const req = await request.json();
		const roomSlug = params.roomSlug;
		const parsed = JoinRoomDtoSchema.safeParse({
			roomSlug,
			username: req.username
		});
		if (!parsed.success) {
			return json({ success: false }, { status: 422 });
		}
		const result = await roomsService.joinRoom(parsed.data);
		if (!result) {
			throw new RoomNotFoundError();
		}
		const { room, user } = result;
		if (room.private || !user) {
			throw new RoomNotFoundError();
		}

		locals.session = {
			userId: user.id,
			roomSlug: room.slug
		};
		cookies.set('session', JSON.stringify(locals.session), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/'
		});
		const joinedUser = ClientUserSchema.parse({
			...user,
			connected: true,
			voted: false
		});
		const data: Event = {
			type: 'join',
			data: joinedUser
		};
		sseStore.broadcast(roomSlug, data);
		return json({ success: true });
	} catch (err) {
		console.error(err);

		const locale = request.headers.get('referer') ?? i18nConfig.defaultLocale;

		const errors = getDictionary(locale).errors;

		if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
			return json({ error: errors['Not found'] }, { status: 404 });
		}
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
