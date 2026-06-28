import { getDictionary, i18nConfig } from '$lib/i18n';
import { CreateRoomDtoSchema } from '$lib/server/dtos';
import { RoomNotFoundError, UserNotFoundError } from '$lib/server/errors';
import { roomsService } from '$lib/server/services';
import { generateUniqueSlug } from '$lib/utils/generateUniqueSlug';
import { slugify } from '$lib/utils/slugify';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	try {
		const req = await request.json();
		const parsed = CreateRoomDtoSchema.safeParse(req);
		if (!parsed.success) {
			console.error(parsed.error);
			return json({ error: parsed.error.message }, { status: 422 });
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

		return json({ slug: room.slug }, { status: 201 });
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
