import { getDictionary, i18nConfig } from '$lib/i18n';
import { RoomNotFoundError, UserNotAdminError, UserNotFoundError } from '$lib/server/errors';
import { sseStore } from '$lib/server/eventEmitter';
import { roomsService, usersService } from '$lib/server/services';
import type { ClientRoom, Room } from '$lib/types';
import type { RestartEvent } from '$lib/types/EventData';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const POST: RequestHandler = async ({ request, params, locals }) => {
	try {
		const roomSlug = params.roomSlug;
		const { isAdmin, userId } = await usersService.isAdmin(locals.session?.userId, roomSlug);
		if (!isAdmin) {
			throw new UserNotAdminError();
		}
		const updatedRoom: Room = await roomsService.restart(roomSlug);
		const users = await roomsService.getUsers(updatedRoom.id, updatedRoom.round, false);
		const room: ClientRoom = roomsService.convertToClientRoom(updatedRoom);
		const event: RestartEvent = {
			type: 'restart',
			data: { room, users }
		};
		sseStore.broadcast(roomSlug, event, userId);
		return json(event.data);
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
