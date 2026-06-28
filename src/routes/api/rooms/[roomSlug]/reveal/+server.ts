import { getDictionary, i18nConfig } from '$lib/i18n';
import { RoomNotFoundError, UserNotAdminError, UserNotFoundError } from '$lib/server/errors';
import { sseStore } from '$lib/server/eventEmitter';
import { roomsService, usersService } from '$lib/server/services';
import type { RevealEvent } from '$lib/types/EventData';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const POST: RequestHandler = async ({ request, params }) => {
	try {
		const roomSlug = params.roomSlug;
		const { isAdmin, userId } = await usersService.isAdmin();
		if (!isAdmin) {
			throw new UserNotAdminError();
		}
		const users = await roomsService.openCards(roomSlug);
		const event: RevealEvent = {
			type: 'reveal',
			data: users
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
