<script lang="ts">
	import SmallVoteCard from '$lib/components/SmallVoteCard.svelte';
	import { i18n as locales } from '$lib/i18n/state.svelte';
	import type { RoundHistory } from '$lib/types/EventData';
	import { FrownIcon } from '@lucide/svelte';

	type Props = { round: RoundHistory; roundNumber: string; endedAtText: string | null };
	const { round, roundNumber, endedAtText }: Props = $props();
	const i18n = $derived(locales.messages.pages.room['vote-history']);
</script>

<div class="roundItem">
	<div class="flex items-baseline gap-1">
		<h4 class="truncate text-lg font-semibold">
			{i18n.round}
			{roundNumber}
		</h4>

		{#if endedAtText}
			<span class="timestamp" title={endedAtText}>
				{endedAtText}
			</span>
		{/if}
	</div>

	<div class="roundItemVotes">
		{#if round.votes.length === 0}
			<div class="noVotes" title={i18n['no-votes']}>
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

<style>
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
		align-items: center;
		gap: 4px;
		color: var(--muted-foreground);
	}
</style>
