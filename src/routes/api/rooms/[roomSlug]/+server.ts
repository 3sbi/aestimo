import { getDictionary, i18nConfig } from '$lib/i18n';
import { UpdateRoomDtoSchema } from '$lib/server/dtos/UpdateRoomDtoSchema';
import { RoomNotFoundError, UserNotAdminError, UserNotFoundError } from '$lib/server/errors';
import { sseStore } from '$lib/server/eventEmitter';
import { roomsService, usersService } from '$lib/server/services';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, params, cookies }) => {
	try {
		const roomSlug = params.roomSlug;

		const { isAdmin } = await usersService.isAdmin();

		if (!isAdmin) {
			throw new UserNotAdminError();
		}

		const success = await roomsService.delete(roomSlug);

		cookies.delete('session', {
			path: '/'
		});

		sseStore.broadcast(roomSlug, {
			type: 'room-delete'
		});

		return json({ success });
	} catch (err) {
		console.error(err);
		const locale = request.headers.get('referer') ?? i18nConfig.defaultLocale;
		const errors = getDictionary(locale).errors;
		if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
			return json({ error: errors['Not found'] }, { status: 404 });
		}
		if (err instanceof UserNotAdminError) {
			return json({ error: errors['Not admin'] }, { status: 403 });
		}
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	try {
		const roomSlug = params.roomSlug;

		const { isAdmin } = await usersService.isAdmin();

		if (!isAdmin) {
			throw new UserNotAdminError();
		}

		const body = await request.json();

		const parsed = UpdateRoomDtoSchema.safeParse(body);

		if (!parsed.success) {
			return json({ error: parsed.error.message }, { status: 422 });
		}

		const room = await roomsService.update(roomSlug, parsed.data);

		sseStore.broadcast(roomSlug, { type: 'room-update', data: { room } });

		if (room.autoreveal) {
			const freshRoom = await roomsService.getOne(roomSlug);

			const users = await roomsService.getUsers(freshRoom.id, freshRoom.round, true);

			const allVoted = users.every((user) => user.voted);

			if (allVoted) {
				const data = await roomsService.openCards(roomSlug);

				sseStore.broadcast(roomSlug, { type: 'reveal', data });
			}
		}

		return json(room);
	} catch (err) {
		console.error(err);
		const locale = request.headers.get('referer') ?? i18nConfig.defaultLocale;
		const errors = getDictionary(locale).errors;
		if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
			return json({ error: errors['Not found'] }, { status: 404 });
		}
		if (err instanceof UserNotAdminError) {
			return json({ error: errors['Not admin'] }, { status: 403 });
		}
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
