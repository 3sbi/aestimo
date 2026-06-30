import type { I18nLocale } from '$lib/i18n';
import { getDictionary } from '$lib/i18n';
import { PREDEFINED_VOTE_TYPES } from '$lib/server/consts/predefinedVoteTypes';
import { roomsService, usersService } from '$lib/server/services';
import type { Room, User } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, url, locals }) => {
	const lang = params.lang as I18nLocale;

	let tab = url.searchParams.get('tab');

	if (tab !== 'create' && tab !== 'join') {
		tab = 'create';
	}

	const i18n = getDictionary(lang).pages.new;
	const session = locals.session;

	if (session?.userId && session?.roomSlug) {
		const { userId, roomSlug } = session;
		try {
			const result: {
				user?: User;
				room?: Room;
			} = await usersService.checkIfUserExistsInRoom(roomSlug, userId);

			if (result.user && result.room) {
				throw redirect(307, `/${lang}/rooms/${roomSlug}`);
			}
		} catch (err) {
			// Don't swallow redirects
			if (err instanceof Response) {
				throw err;
			}

			console.error(err);
		}
	}
	const roomsToJoin = await roomsService.getPublicRooms();
	return {
		tab,
		i18n,
		predefinedVoteTypes: PREDEFINED_VOTE_TYPES,
		roomsToJoin
	};
};
