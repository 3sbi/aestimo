<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { Dictionary } from '$lib/i18n';
	import type { ClientRoom, ClientUser } from '$lib/types';
	import type { NextRoundEvent, RestartEvent } from '$lib/types/EventData';
	import ArrowRightCircleIcon from '@lucide/svelte/icons/arrow-right-circle';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';

	interface Props {
		room: ClientRoom;
		i18n: Dictionary['pages']['room']['toolbar'];
		revealVotes: (data: ClientUser[]) => void;
		restartRound: (data: RestartEvent['data']) => void;
		goToNextRound: (data: NextRoundEvent['data']) => void;
	}

	let { room, i18n, revealVotes, restartRound, goToNextRound }: Props = $props();

	let loadingButton = $state<'reveal' | 'next' | 'restart' | null>(null);

	async function execute<T>(
		action: 'reveal' | 'next' | 'restart',
		url: string,
		callback: (data: T) => void
	) {
		if (loadingButton) return;

		loadingButton = action;

		try {
			const res = await fetch(url, { method: 'POST' });
			const data = (await res.json()) as T;

			callback(data);
		} catch (err) {
			console.error(err);
		} finally {
			loadingButton = null;
		}
	}
</script>

<div class="toolbar">
	{#if room.status !== 'finished' && !room.autoreveal}
		<Button
			class="toolbarBtn"
			onclick={() => execute<ClientUser[]>('reveal', `/api/rooms/${room.slug}/reveal`, revealVotes)}
			disabled={loadingButton === 'reveal'}
		>
			<EyeIcon />
			{i18n.reveal}
		</Button>
	{/if}

	{#if room.status === 'finished'}
		<Button
			class="toolbarBtn"
			onclick={() =>
				execute<NextRoundEvent['data']>('next', `/api/rooms/${room.slug}/next`, goToNextRound)}
			disabled={loadingButton === 'next'}
		>
			<ArrowRightCircleIcon />
			{i18n.next}
		</Button>
	{/if}

	{#if room.status !== 'finished'}
		<Button
			class="toolbarBtn"
			onclick={() =>
				execute<RestartEvent['data']>('restart', `/api/rooms/${room.slug}/restart`, restartRound)}
			disabled={loadingButton === 'restart'}
		>
			<RotateCwIcon />
			{i18n.restart}
		</Button>
	{/if}
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 0px auto;
		background: var(--color-card);
		color: var(--color-card-foreground);
		border-radius: var(--radius);
		border-width: 1px;
		border-bottom-width: 0px;
		box-shadow: var(--shadow-lg);
		padding: 12px 20px;
		max-width: 800px;
		width: 100%;
	}

	:global(.toolbarBtn) {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex-grow: 1;
		min-width: 124px;
	}

	@media (width >= 48rem) {
		.toolbar {
			gap: 12px;
		}
	}
</style>
