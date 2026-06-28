import { UserNotFoundError } from '$lib/server/errors';
import type { SseClient } from '$lib/server/eventEmitter';
import { sseStore } from '$lib/server/eventEmitter';
import { usersService } from '$lib/server/services';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const GET: RequestHandler = async ({ params, locals, request }) => {
	const roomSlug = params.roomSlug;

	const userId = locals.session.userId;

	if (typeof userId !== 'number') {
		throw new UserNotFoundError();
	}

	const user = await usersService.getOne(userId);

	if (roomSlug !== locals.session.roomSlug) {
		return json({ error: 'Not allowed' }, { status: 403 });
	}

	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		start(controller) {
			const send = (data: string) => {
				controller.enqueue(encoder.encode(data));
			};

			const client: SseClient = {
				roomSlug,
				id: userId,
				send
			};

			sseStore.addClient(client);

			sseStore.broadcast(roomSlug, {
				type: 'user-update',
				data: {
					userId: user.id,
					update: {
						connected: true
					}
				}
			});

			request.signal.addEventListener('abort', () => {
				sseStore.removeClient(client);

				sseStore.broadcast(roomSlug, {
					type: 'user-update',
					data: {
						userId: client.id,
						update: {
							connected: false
						}
					}
				});

				controller.close();
			});
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
