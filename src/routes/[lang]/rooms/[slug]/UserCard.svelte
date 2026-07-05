<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { Dictionary } from '$lib/i18n';
	import type { ClientUser } from '$lib/types';
	import { getContrastYIQ } from '$lib/utils/colors';
	import { CrownIcon } from '@lucide/svelte';

	interface UserCardState {
		isAdmin: boolean;
		kickUser: (userId: ClientUser['id']) => Promise<void>;
	}

	type Props = {
		user: ClientUser;
		currentUserId: number;
		i18n: Dictionary['pages']['room'];
		roomState: UserCardState;
	};
	const { user, currentUserId, i18n, roomState }: Props = $props();

	let loading = $state(false);

	const isCurrentUser = $derived(user.id === currentUserId);

	async function onClick() {
		loading = true;

		try {
			const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
			const json: { success: boolean } = await res.json();

			if (res.ok && json.success) {
				await roomState.kickUser(user.id);
			}
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	}
</script>

<div
	class="userCard"
	title={user.name}
	style:background-color={user.vote?.color}
	style:color={user.vote ? getContrastYIQ(user.vote.color) : undefined}
	style:opacity={!user.connected && !isCurrentUser ? 0.6 : undefined}
>
	<h2 class="username" title={user.name}>
		<span class="truncate">
			{user.name}
		</span>

		{#if isCurrentUser}
			<small class="text-secondary-foreground">
				({i18n.usersList.you})
			</small>
		{/if}

		{#if roomState.isAdmin}
			<CrownIcon size={14} title={i18n.usersList.admin} />
		{/if}
	</h2>

	{#if roomState.isAdmin && !isCurrentUser}
		<div class="kickButton">
			<Button disabled={loading} title={i18n.usersList.kick} onclick={onClick}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 100 100">
					<polygon points="73.14 60.55 17.75 80.02 14.46 74.29 72.12 54.02 73.14 60.55" />
					<path
						d="M50.16,39.44c-.25,0-4.7.33-4.93.42L34.8,42.37,28.08,20,.1,29.82,15,72.14l8.51-3L41,63,70.37,52.67C65.21,41.59,55.28,38.63,50.16,39.44Z"
					/>
					<path
						d="M81.12,60.49a12.88,12.88,0,0,1,3.35-10c.76-.83,1-1.2-.31-1.68C77.59,46.33,74,41.49,73.26,34.56c-.12-1.09-.26-1.46-1.48-1-7.65,2.85-14.63,1-20.15-5.32A21.4,21.4,0,0,1,49,24.78c-.38-.66-.36-1.13.35-1.49.2-.1.38-.23.57-.35,2.37-1.44,2.36-1.43,4.09.62a26,26,0,0,0,2.34,2.6c5.52,5,11.24,5.28,17.23.88,1.79-1.32,3.55-2.68,5.33-4,.33-.24.66-.8,1.12-.43s.09.83,0,1.25a34.72,34.72,0,0,0-1.94,9.09,11.49,11.49,0,0,0,8.1,11.52c3.91,1.25,8,1.38,12,1.87.62.08,1.58-.22,1.7.58s-.86.7-1.4.92c-1.94.83-3.93,1.56-5.84,2.45-7,3.24-8.73,9.63-4.3,15.91a27.13,27.13,0,0,0,2,2.64c.79.87.63,1.44-.2,2.21-2.58,2.38-2.53,2.4-4.65-.45A21.34,21.34,0,0,1,81.12,60.49Z"
					/>
				</svg>
			</Button>
		</div>
	{/if}

	{#if user.vote}
		<div>{user.vote.value}</div>
	{:else if !user.connected && !isCurrentUser}
		<div title={i18n.usersList.disconnected}>💀</div>
	{:else if user.voted}
		<div>🗳️</div>
	{:else}
		<div>🤔</div>
	{/if}
</div>

<style>
	.userCard {
		background: var(--color-card);
		color: var(--color-card-foreground);
		border-radius: var(--radius);
		border-width: 1px;
		box-shadow: var(--shadow-lg);
		padding: 32px 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: var(--text-3xl);
		line-height: var(--text-3xl--line-height);
		max-width: 100px;
		width: 100px;
		position: relative;
	}

	.userCard .username {
		position: absolute;
		top: -16px;
		font-size: var(--text-sm);
		line-height: var(--text-sm--line-height);
		font-weight: 600;
		border-width: 1px;
		border-radius: var(--radius);
		background-color: var(--color-secondary);
		color: var(--color-secondary-foreground);
		height: 32px;
		text-align: center;
		gap: 4px;
		padding: 0px 8px;
		width: 92px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@media (width >= 48rem) {
		.userCard {
			padding: 48px 32px;
			font-size: var(--text-5xl);
			line-height: var(--text-5xl--line-height);
			max-width: 120px;
			width: 120px;
		}

		.userCard .username {
			width: 112px;
		}
	}

	.userCard:hover .kickButton {
		display: flex;
	}

	.userCard .kickButton:hover {
		fill: var(--destructive);
	}

	.kickButton {
		display: none;
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
		position: absolute;
		top: 20px;
		right: 4px;
		fill: var(--card-foreground);
	}
</style>
