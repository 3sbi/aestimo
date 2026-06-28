import { TransferAdminRightsDtoSchema, UpdateUserDtoSchema } from '$lib/server/dtos';
import { ClientUserSchema } from '$lib/server/dtos/ClientUserSchema';
import { RoomNotFoundError, UserNotFoundError } from '$lib/server/errors';
import { sseStore } from '$lib/server/eventEmitter';
import { usersService } from '$lib/server/services';
import type { User } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
	try {
		const req = await request.json();
		const roomSlug = locals.session?.roomSlug;
		if (!roomSlug) {
			throw new RoomNotFoundError();
		}
		const id = Number(params.id);
		if (Number.isNaN(id)) {
			throw new UserNotFoundError();
		}

		const parsed = UpdateUserDtoSchema.safeParse(req);
		if (!parsed.success) {
			console.error(parsed.error);
			return json({ error: parsed.error.message }, { status: 422 });
		}

		const updatedUser = await usersService.update(id, parsed.data);
		const connected = sseStore.isConnected(updatedUser.id);
		const clientUser = ClientUserSchema.parse({
			...updatedUser,
			connected
		});

		return json({ user: clientUser });
	} catch (err) {
		console.error(err);
		if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
			return json({ error: err.message }, { status: 404 });
		}
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request, params, locals, cookies }) => {
	try {
		const roomSlug = locals.session?.roomSlug;
		if (!roomSlug) {
			throw new RoomNotFoundError();
		}
		const id = Number(params.id);
		if (Number.isNaN(id)) {
			throw new UserNotFoundError();
		}
		const { isAdmin, userId } = await usersService.isAdmin();
		const user: User = await usersService.getOne(id);
		const isMyself = userId === user.id;
		if (!isAdmin && !isMyself) {
			return json({ error: 'Not allowed' }, { status: 403 });
		}

		if (isAdmin && isMyself) {
			const req = await request.json();
			const parsed = TransferAdminRightsDtoSchema.safeParse({
				oldAdminId: id,
				newAdminId: req.newAdminId
			});
			if (!parsed.success) {
				console.error(parsed.error);
				return json({ error: 'Failed to change room admin' }, { status: 422 });
			}

			const user = await usersService.transferAdminRights(parsed.data);
			const data = {
				type: 'transfer-admin',
				data: { newAdminId: user.id }
			} as const;
			sseStore.broadcast(roomSlug, data, userId);
		}

		const kickedUser = await usersService.leave(id);
		const data = {
			type: 'kick',
			data: { userId: kickedUser.id }
		} as const;
		sseStore.broadcast(roomSlug, data, userId);

		if (isMyself) {
			cookies.delete('session', { path: '/' });
		}
		return json({ success: true });
	} catch (err) {
		console.error(err);
		if (err instanceof UserNotFoundError || err instanceof RoomNotFoundError) {
			return json({ error: err.message }, { status: 404 });
		}
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
