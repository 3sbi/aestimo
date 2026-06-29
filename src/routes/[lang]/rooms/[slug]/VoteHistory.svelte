<script lang="ts">
	import SmallVoteCard from '$lib/components/SmallVoteCard.svelte';
	import { i18n as locales } from '$lib/i18n/state.svelte';
	import type { RoundHistory } from '$lib/types/EventData';
	import { ArchiveIcon, FrownIcon } from '@lucide/svelte';
	import HistoryIcon from '@lucide/svelte/icons/history';
	import { fly } from 'svelte/transition';
	interface Props {
		roundsHistory: Record<number, RoundHistory>;
	}

	let { roundsHistory }: Props = $props();

	let opened = $state(false);

	const i18n = locales.messages.pages.room['vote-history'];

	function formatTimestamp(timestampMs: number) {
		const d = new Date(timestampMs);

		return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
	}

	function onDrawerClick(e: MouseEvent) {
		if (e.currentTarget === e.target) {
			opened = false;
		}
	}
</script>

<button class="btn" title={i18n.header} onclick={() => (opened = true)}>
	<HistoryIcon />
</button>

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

				{#if Object.keys(roundsHistory).length === 0}
					<div class="empty">
						<ArchiveIcon size={32} />
						<p class="text-sm">{i18n.empty}</p>
					</div>
				{:else}
					{#each Object.entries(roundsHistory).reverse() as [roundNumber, round] (roundNumber)}
						<div class="roundItem">
							<div class="flex items-baseline gap-1">
								<h4 class="truncate text-lg font-semibold">
									{i18n.round}
									{roundNumber}
								</h4>

								{#if round.endedAt}
									<span class="timestamp" title={formatTimestamp(round.endedAt)}>
										{formatTimestamp(round.endedAt)}
									</span>
								{/if}
							</div>

							<div class="roundItemVotes">
								{#if round.votes.length === 0}
									<div class="noVotes">
										{i18n['no-votes']}
										<FrownIcon size={12} />
									</div>
								{:else}
									{#each round.votes as vote (vote.userId)}
										<div title={vote.userName}>
											<SmallVoteCard {...vote.option} />
										</div>
									{/each}
								{/if}
							</div>
						</div>
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

	.roundItemVotes {
		display: flex;
		gap: 2px;
		flex-wrap: wrap;
	}

	.roundItem {
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
	}

	.roundItem .timestamp {
		font-size: var(--text-xs);
		line-height: var(--text-xs--line-height);
		color: var(--muted-foreground);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.noVotes {
		display: flex;
		gap: 4px;
		color: var(--muted-foreground);
	}

	@media (width >= 48rem) {
		.drawer {
			display: block;
		}
	}
</style>
