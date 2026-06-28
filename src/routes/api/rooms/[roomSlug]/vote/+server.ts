import { getDictionary, i18nConfig } from '$lib/i18n';
import { CreateVoteDtoSchema } from '$lib/server/dtos';
import { ClientUserSchema } from '$lib/server/dtos/ClientUserSchema';
import {
	RoomNotFoundError,
	UserNotAdminError,
	UserNotFoundError,
	VoteNotFoundError
} from '$lib/server/errors';
import { sseStore } from '$lib/server/eventEmitter';
import { roomsService, usersService } from '$lib/server/services';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const POST: RequestHandler = async ({ request, params, locals }) => {
	try {
		const roomSlug = params.roomSlug;
		const userId = locals.session?.userId;
		if (typeof userId !== 'number') {
			throw new UserNotFoundError();
		}

		const body = await request.json();
		const parsed = CreateVoteDtoSchema.safeParse(body);
		if (!parsed.success) {
			return json({ error: parsed.error.message }, { status: 422 });
		}

		const voteOptions = await roomsService.getVoteTypes(roomSlug);
		const voteValue = voteOptions[parsed.data.voteIndex];
		if (!voteValue) {
			throw new VoteNotFoundError();
		}

		const { user, room } = await usersService.checkIfUserExistsInRoom(roomSlug, userId);
		const vote = await roomsService.addVote(room, user.id, voteValue);
		const connected = sseStore.isConnected(user.id);
		const votedUser = ClientUserSchema.parse({
			...user,
			connected,
			voted: true
		});

		sseStore.broadcast(roomSlug, { type: 'vote', data: votedUser }, user.id);
		const users = await roomsService.getUsers(room.id, room.round, true);
		const allVoted = users.every((user) => user.voted);
		if (room.autoreveal && allVoted) {
			const data = await roomsService.openCards(roomSlug);
			sseStore.broadcast(roomSlug, {
				type: 'reveal',
				data
			});
		}

		return json({
			success: !!vote
		});
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
