<script lang="ts">
	import { getContrastYIQ } from '$lib/utils/colors';

	type Props = { color: string; value: string; rainbow?: boolean };
	const { color, value, rainbow }: Props = $props();

	const textColor = $derived(getContrastYIQ(color));
</script>

<div title={value} class="smallVoteCard" class:rainbow style:color={textColor}>
	{value}
</div>

<style>
	.smallVoteCard {
		border-width: 1px;
		border-radius: 4px;
		font-weight: 600;
		padding: 4px;
		background-color: transparent;
		color: black;
		max-width: 80px;
		min-width: 20px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		text-align: center;
	}

	.rainbow {
		background: #f39893;
		animation: hueSpin 30s linear infinite;
		filter: hue-rotate(0deg);
	}

	@keyframes hueSpin {
		to {
			filter: hue-rotate(360deg);
		}
	}
</style>
