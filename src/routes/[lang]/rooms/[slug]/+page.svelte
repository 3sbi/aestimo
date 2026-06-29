<script lang="ts">
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { getContrastYIQ } from '$lib/utils/colors';
	import { CrownIcon } from '@lucide/svelte';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import { Toaster } from 'svelte-sonner';
	import type { PageProps } from './$types';
	import CardsHand from './CardsHand.svelte';
	import KickButton from './KickButton.svelte';
	import { createRoomState } from './room-state.svelte';
	import Toolbar from './Toolbar.svelte';
	import VoteHistory from './VoteHistory.svelte';

	const { data }: PageProps = $props();
	const { i18n } = data;

	const state = createRoomState(data);
	const currentUserId = $derived(data.user.id);

	$effect(() => {
		return state.connect();
	});

	async function onClickInvite() {
		try {
			await navigator.clipboard.writeText(
				`${window.location.origin}/rooms/${state.room.slug}/join`
			);
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div class="room">
	<div class="absolute gap-2 justify-between top-5 left-5 flex right-5 z-30">
		<div class="chip">
			<div class="flex gap-2 items-center">
				<b>{state.room.name}</b>
				<button title={i18n.header.share.title} onclick={onClickInvite}>
					{i18n.header.share.title}
					<Share2Icon size={14} />
				</button>
			</div>
			<h2>{`${i18n.header.round} ${state.room.round}`}</h2>
		</div>
		<div class="chip">
			<VoteHistory roundsHistory={state.roundsHistory} />
			<ThemeSwitcher />
		</div>
	</div>
	<div class="flex flex-col gap-4 m-auto">
		<div class="userCardList">
			{#each state.users as user (user.id)}
				{@const isCurrentUser = user.id === currentUserId}
				{@const userIsAdmin = user.role === 'admin'}
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

						{#if userIsAdmin}
							<CrownIcon width={12} style="min-width:12px" title={i18n.usersList.admin} />
						{/if}
					</h2>

					{#if state.isAdmin && !isCurrentUser}
						<KickButton userId={user.id} onKicked={state.kickUser} title={i18n.usersList.kick} />
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
			{/each}
		</div>

		{#if state.isAdmin}
			<Toolbar
				i18n={i18n.toolbar}
				room={state.room}
				revealVotes={state.revealVotes}
				restartRound={state.restartRound}
				goToNextRound={state.goToNextRound}
			/>
		{/if}
	</div>
	<CardsHand
		setVoted={() => state.setVoted(currentUserId)}
		bind:selectedIndex={state.selectedIndex}
		voteOptions={state.voteOptions}
		room={state.room}
	/>
</div>
<Toaster richColors position="top-center" />

<style>
	.chip {
		display: flex;
		align-items: center;
		gap: 8px;
		width: fit-content;
		background: var(--card);
		color: var(--card-foreground);
		border-width: 1px;
		padding: 8px 12px;
		box-shadow: var(--shadow-2xl);
		box-shadow: var(--shadow-lg);
		border-radius: var(--radius);
	}

	.userCardList {
		display: flex;
		flex-wrap: wrap;
		gap: 20px 8px;
		margin: auto;
	}

	.userCard {
		background: var(--card);
		color: var(--card-foreground);
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
		background-color: var(--secondary);
		color: var(--secondary-foreground);
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
</style>
