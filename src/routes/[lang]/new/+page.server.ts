import type { I18nLocale } from '$lib/i18n';
import { getDictionary } from '$lib/i18n';
import { PREDEFINED_VOTE_TYPES } from '$lib/server/consts/predefinedVoteTypes';
import { CreateRoomDtoSchema } from '$lib/server/dtos/CreateRoomDtoSchema.js';
import { roomsService, usersService } from '$lib/server/services';
import type { Room, User } from '$lib/types';
import { generateUniqueSlug } from '$lib/utils/generateUniqueSlug';
import { slugify } from '$lib/utils/slugify';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';

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

export const actions = {
	create: async ({ params, request, locals, cookies }) => {
		const formData = await request.formData();

		const data = Object.fromEntries(formData);
		const voteType = PREDEFINED_VOTE_TYPES.find((option) => option.id === formData.get('voteType'));

		const parsed = CreateRoomDtoSchema.safeParse({
			...data,
			private: !!data.private,
			voteOptions: voteType?.values
		});
		if (!parsed.success) {
			return fail(400, { error: parsed.error.message });
		}

		const { prefix, ...rest } = parsed.data;
		const sanitizedPrefix = slugify(prefix);
		const uniqueSlug = await generateUniqueSlug(sanitizedPrefix);
		const { room, user } = await roomsService.createRoom({
			...rest,
			slug: uniqueSlug
		});

		locals.session = {
			roomSlug: room.slug,
			userId: user.id
		};

		cookies.set('session', JSON.stringify(locals.session), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		console.log(room);

		redirect(303, `/${params.lang}/rooms/${room.slug}`);
	}
} satisfies Actions;
