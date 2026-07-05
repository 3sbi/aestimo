<script lang="ts">
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { i18n as locales } from '$lib/i18n/state.svelte';
	import { untrack } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import type { PageProps } from './$types';
	import CardsHand from './_components/CardsHand.svelte';
	import Settings from './_components/Settings/Settings.svelte';
	import ShareButton from './_components/ShareButton.svelte';
	import Toolbar from './_components/Toolbar.svelte';
	import UserCard from './_components/UserCard.svelte';
	import VoteHistory from './_components/VoteHistoryDrawer/VoteHistoryDrawer.svelte';
	import { createRoomState } from './room-state.svelte';

	const i18n = $derived(locales.messages.pages.room);
	const { data }: PageProps = $props();
	const initialData = untrack(() => data);
	const state = createRoomState(initialData);
	const currentUserId = $derived(data.user.id);

	$effect(() => {
		return state.connect();
	});
</script>

<div class="room">
	<div class="absolute gap-2 justify-between top-5 left-5 flex right-5 z-30">
		<div class="chip">
			<div class="flex gap-2 items-center">
				<b>{state.room.name}</b>
				<ShareButton slug={state.room.slug} i18n={i18n.header.share} />
			</div>
			<h2>{`${i18n.header.round} ${state.room.round}`}</h2>
		</div>
		<div class="chip">
			<Settings room={state.room} i18n={i18n.settings} {currentUserId} isAdmin={state.isAdmin} />
			<VoteHistory roundsHistory={state.roundsHistory} />
			<ThemeSwitcher />
			<LanguageSelector />
		</div>
	</div>
	<div class="flex flex-col gap-4 m-auto">
		<div class="userCardList">
			{#each state.users as user (user.id)}
				<UserCard {user} {currentUserId} {i18n} roomState={state} />
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
	.room {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 20px;
		padding: 0px 20px;
		flex-grow: 1;
	}

	.chip {
		display: flex;
		align-items: center;
		gap: 8px;
		width: fit-content;
		background: var(--color-card);
		color: var(--color-card-foreground);
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
</style>
