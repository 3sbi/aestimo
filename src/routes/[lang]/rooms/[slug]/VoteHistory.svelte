<script lang="ts">
	import { i18n as locales } from '$lib/i18n/state.svelte';
	import type { RoundHistory } from '$lib/types/EventData';
	import { ArchiveIcon } from '@lucide/svelte';
	import HistoryIcon from '@lucide/svelte/icons/history';
	import { fly } from 'svelte/transition';
	import VoteHistoryRound from './VoteHistoryRound.svelte';
	import Button from '$lib/components/Button.svelte';
	interface Props {
		roundsHistory: Record<number, RoundHistory>;
	}

	let { roundsHistory }: Props = $props();

	let opened = $state(false);

	const i18n = locales.messages.pages.room['vote-history'];

	function onDrawerClick(e: MouseEvent) {
		if (e.currentTarget === e.target) {
			opened = false;
		}
	}

	function formatTimestamp(timestampMs: number) {
		const d = new Date(timestampMs);

		return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
	}

	const rounds = $derived.by(() =>
		Object.entries(roundsHistory)
			.reverse()
			.map(([number, round]) => ({
				number,
				round,
				endedAtText: round.endedAt ? formatTimestamp(round.endedAt) : null
			}))
	);

	const hasRounds = $derived(rounds.length > 0);
</script>

<Button variant="ghost" title={i18n.header} onclick={() => (opened = true)}>
	<HistoryIcon />
</Button>

{#if opened}
	<div
		class="overlay"
		role="dialog"
		tabindex={1}
		aria-modal="true"
		onclick={onDrawerClick}
		onkeydown={(e) => {
			if (e.key === 'Escape') opened = false;
		}}
	>
		<aside class="drawer" in:fly={{ x: 256 }} out:fly={{ x: 256 }}>
			<div class="history">
				<h2 class="mb-2 text-center text-2xl font-semibold">
					{i18n.header}
				</h2>

				{#if !hasRounds}
					<div class="empty">
						<ArchiveIcon size={32} />
						<p class="text-sm">{i18n.empty}</p>
					</div>
				{:else}
					{#each rounds as { number, endedAtText, round } (number)}
						<VoteHistoryRound {round} roundNumber={number} {endedAtText} />
					{/each}
				{/if}
			</div>
		</aside>
	</div>
{/if}

<style>
	.overlay {
		height: 100%;
		width: 100%;
		background-color: color-mix(in oklab, #000000 50%, transparent);
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
		left: 0;
		top: 0;
		overflow-y: auto;
		position: fixed;
		z-index: 120;
		padding: 0;
		cursor: pointer;
	}

	.drawer {
		display: none;
		position: fixed;
		top: 0px;
		right: 0px;
		height: 100%;
		width: 256px;
		z-index: 50;
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
		border-left: 1px solid var(--border);
		box-shadow: var(--shadow-md);
		background-color: var(--color-card);
		color: var(--color-card-foreground);
		cursor: auto;
	}

	.drawer .empty {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: var(--muted-foreground);
	}

	.drawer .history {
		width: 100%;
		height: 100%;
		overflow: auto;
		display: flex;
		gap: 32px;
		position: relative;
		min-width: 254px;
		flex-direction: column;
		padding: 24px;
	}

	@media (width >= 48rem) {
		.drawer {
			display: block;
		}
	}
</style>
