<script lang="ts">
	import { PRESET_COLORS } from '$lib/utils/colors';
	import { PaintBucketIcon } from '@lucide/svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	type Props = {
		hex: string;
	};

	let { hex = $bindable() }: Props = $props();

	let isOpen = $state(false);
</script>

<button type="button" class="paintButton" onclick={() => (isOpen = !isOpen)}>
	<PaintBucketIcon size={14} />
	<ColorPicker bind:hex {isOpen} swatches={PRESET_COLORS} label="" --input-size="0px" />
</button>

<style>
	:global(:root[data-theme='dark']) {
		--cp-bg-color: var(--color-card);
		--cp-border-color: var(--color-border);
		--cp-text-color: var(--color-card-foreground);
		--cp-input-color: var(--color-input);
		--cp-button-hover-color: var(--color-secondary);
	}

	.paintButton {
		position: absolute;
		top: 0px;
		left: 0px;
		padding: 4px;
	}
</style>
