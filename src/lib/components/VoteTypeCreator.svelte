<script lang="ts">
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import type { Dictionary } from '$lib/i18n';
	import type { VoteCard } from '$lib/types';
	import { getContrastYIQ, getRandomPresetColor } from '$lib/utils/colors';
	import PlusCircleIcon from '@lucide/svelte/icons/plus-circle';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';

	export type CustomVoteCard = VoteCard & {
		id: number;
	};

	let {
		cards = $bindable(),
		i18n
	}: {
		cards: CustomVoteCard[];
		i18n: Dictionary['pages']['new']['createRoomForm']['customVoteCard'];
	} = $props();

	function addCard() {
		const max = Math.max(0, ...cards.map((c) => c.id));

		cards = [
			...cards,
			{
				id: max + 1,
				color: getRandomPresetColor(),
				value: String(cards.length + 1)
			}
		];
	}

	function deleteCard(id: number) {
		cards = cards.filter((card) => card.id !== id);
	}
</script>

<div class="flex flex-wrap items-center gap-0.5 mt-3">
	{#each cards as card (card.id)}
		<div
			class="voteCard"
			style:background-color={card.color}
			style:color={getContrastYIQ(card.color)}
		>
			<input id={`vote_${card.id}`} size="1" bind:value={card.value} />

			<button
				type="button"
				class="deleteButton"
				title={i18n.delete}
				onclick={() => deleteCard(card.id)}
			>
				<Trash2Icon size={14} />
			</button>

			<ColorPicker bind:hex={card.color} />
		</div>
	{/each}

	<button class="addButton" type="button" onclick={addCard}>
		<PlusCircleIcon size={20} />
	</button>
</div>

<style>
	.voteCard {
		border-width: 1px;
		border-radius: var(--radius);
		font-weight: 600;
		width: 60px;
		padding: 24px 8px;
		background-color: transparent;
		color: black;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.voteCard input {
		width: min-content;
		text-align: center;
		border: 0px;
	}

	.voteCard input:focus {
		outline: 0px;
	}

	.voteCard input:active {
		border: 0px;
		outline: none;
	}

	.addButton {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-weight: 600;
		min-width: 60px;
		height: 74px;
		border-width: 1px;
		border-radius: var(--radius);
	}

	.addButton:hover {
		color: var(--primary);
	}

	.deleteButton {
		border-radius: var(--radius);
		padding: 4px;
		cursor: pointer;
	}

	.deleteButton {
		position: absolute;
		top: 0px;
		right: 0px;
	}
</style>
