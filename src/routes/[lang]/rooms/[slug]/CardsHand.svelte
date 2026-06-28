<script lang="ts">
	import type { ClientRoom, VoteCard } from '$lib/types';

	import { getContrastYIQ } from '$lib/utils/colors';

	interface Props {
		voteOptions: VoteCard[];
		room: ClientRoom;
		setVoted: () => void;
		selectedIndex: number | null;
	}

	let { voteOptions, room, setVoted, selectedIndex = $bindable() }: Props = $props();

	const roundFinished = $derived(room.status === 'finished');

	async function vote(index: number) {
		if (roundFinished || index === selectedIndex) {
			return;
		}

		try {
			const res = await fetch(`/api/rooms/${room.slug}/vote`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ voteIndex: index })
			});

			const json: { success: boolean } = await res.json();

			if (res.ok && json.success) {
				setVoted();
				selectedIndex = index;
			}
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div class="m-4 flex flex-wrap items-center justify-center gap-4 md:gap-6">
	{#each voteOptions as voteOption, index (voteOption.value)}
		<button
			class={[
				'cursor-pointer rounded-lg border-2 px-4 py-4 text-4xl font-bold shadow-md transition md:px-6 md:py-8',
				selectedIndex === index && '-translate-y-6 scale-110 border-card-foreground',
				roundFinished && 'cursor-not-allowed opacity-60'
			].join(' ')}
			style:background-color={voteOption.color}
			style:color={getContrastYIQ(voteOption.color)}
			style:border-color={selectedIndex === index ? 'var(--card-foreground)' : undefined}
			title={voteOption.value}
			onclick={() => vote(index)}
		>
			{voteOption.value}
		</button>
	{/each}
</div>
