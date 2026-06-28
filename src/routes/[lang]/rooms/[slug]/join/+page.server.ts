import { getDictionary, type I18nLocale } from '$lib/i18n';
import usersService from '$lib/server/services/UsersService';
import type { Room, User } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const lang = params.lang as I18nLocale;

	const i18n = getDictionary(lang).pages.new.joinRoomForm;
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

	return {
		i18n,
		slug: params.slug
	};
};
