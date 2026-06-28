import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { Dictionary } from '$lib/i18n';
import type { ClientRoom, ClientUser, User, Vote, VoteCard } from '$lib/types';
import type {
	Event,
	NextRoundEvent,
	RestartEvent,
	RevealEvent,
	RoundHistory
} from '$lib/types/EventData';
import { toast } from 'svelte-sonner';

interface CreateRoomStateProps {
	initialRoom: ClientRoom;
	initialUsers: ClientUser[];
	initialSelectedIndex: number | null;
	initialRoundsHistory: Record<Vote['round'], RoundHistory>;
	user: Pick<User, 'id' | 'role'>;
	i18n: Dictionary['pages']['room'];
	voteOptions: VoteCard[];
}

export function createRoomState({
	initialRoom,
	initialUsers,
	initialSelectedIndex,
	initialRoundsHistory,
	user,
	i18n,
	voteOptions
}: CreateRoomStateProps) {
	let room = $state(initialRoom);
	let users = $state(initialUsers);
	const roundsHistory = $state(initialRoundsHistory);
	let selectedIndex = $state(initialSelectedIndex);
	let disconnected = $state(false);

	const isAdmin = $derived(user.role === 'admin');

	function goToNextRound(data: NextRoundEvent['data']) {
		const { room: newRoom, prevRound } = data;

		roundsHistory[newRoom.round - 1] = prevRound;

		room = newRoom;

		for (const user of users) {
			user.voted = false;
		}

		selectedIndex = null;
	}

	function restartRound(data: RestartEvent['data']) {
		room = data.room;
		users = data.users;
		selectedIndex = null;
	}

	function revealVotes(data: RevealEvent['data']) {
		users = data;
		room.status = 'finished';
	}

	function setVoted(userId: ClientUser['id']) {
		const user = users.find((u) => u.id === userId);

		if (user) {
			user.voted = true;
		}
	}

	async function kickUser(userId: ClientUser['id']) {
		if (user.id === userId) {
			await goto(resolve('/'), {
				replaceState: true
			});

			return;
		}

		users = users.filter((u) => u.id !== userId);
	}

	function transferAdmin(newAdminId: number) {
		for (const user of users) {
			user.role = user.id === newAdminId ? 'admin' : 'basic';
		}
	}

	function updateUser(userId: User['id'], update: Partial<Pick<ClientUser, 'name' | 'connected'>>) {
		const user = users.find((u) => u.id === userId);

		if (user) {
			Object.assign(user, update);
		}
	}

	function connect() {
		const eventSource = new EventSource(`/api/rooms/${room.slug}/events`);

		eventSource.onmessage = ({ data }) => {
			const event = JSON.parse(data) as Event;

			switch (event.type) {
				case 'join':
					users.push(event.data);
					break;

				case 'room-update':
					room = event.data.room;
					break;

				case 'next-round':
					goToNextRound(event.data);
					break;

				case 'restart':
					restartRound(event.data);
					break;

				case 'reveal':
					revealVotes(event.data);
					break;

				case 'kick':
					kickUser(event.data.userId);
					break;

				case 'user-update':
					updateUser(event.data.userId, event.data.update);
					break;

				case 'room-delete':
					goto(resolve('/'), { replaceState: true });
					break;

				case 'transfer-admin':
					transferAdmin(event.data.newAdminId);
					break;

				case 'vote':
					setVoted(event.data.id);
					break;

				default:
					toast.warning(`${i18n.toast['unknown-event']}: ${event['type']}`);
			}
		};

		eventSource.onopen = () => {
			if (disconnected) {
				toast.success(i18n.toast.reconnected);
				disconnected = false;
			}
		};

		eventSource.onerror = () => {
			if (!disconnected) {
				toast.error(i18n.toast.disconnected);
				disconnected = true;
			}
		};

		return () => eventSource.close();
	}

	return {
		// state
		get room() {
			return room;
		},
		set room(value) {
			room = value;
		},

		get users() {
			return users;
		},

		get roundsHistory() {
			return roundsHistory;
		},

		get selectedIndex() {
			return selectedIndex;
		},
		set selectedIndex(value) {
			selectedIndex = value;
		},

		get isAdmin() {
			return isAdmin;
		},

		voteOptions,

		// actions
		connect,
		goToNextRound,
		restartRound,
		revealVotes,
		setVoted,
		kickUser,
		updateUser,
		transferAdmin
	};
}
