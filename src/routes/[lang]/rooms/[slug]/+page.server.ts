import { getDictionary, type I18nLocale } from '$lib/i18n';
import roomsService from '$lib/server/services/RoomsService.js';
import usersService from '$lib/server/services/UsersService';
import type { ClientUser } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const lang = params.lang as I18nLocale;

	const i18n = getDictionary(lang).pages.room;
	const session = locals.session;

	if (!session?.userId || !session?.roomSlug) {
		redirect(307, `/${lang}/rooms/new`);
	}

	const { room, user } = await usersService.checkIfUserExistsInRoom(params.slug, session.userId);

	const initialRoundsHistory = await roomsService.getRoundsHistory(room.id, room.round);
	const voteOptions = await roomsService.getVoteTypes(room.slug);
	const showVotes: boolean = room.status === 'finished';
	const initialUsers: ClientUser[] = await roomsService.getUsers(room.id, room.round, showVotes);
	const initialSelectedIndex = await usersService.getVoteIndex(user.id, room);

	return {
		initialRoom: room,
		user,
		initialUsers,
		initialSelectedIndex,
		initialRoundsHistory,
		voteOptions,
		i18n
	};
};
