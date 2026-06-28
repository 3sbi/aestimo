<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label: string;
		helper?: string;
		class?: string;
	}

	let {
		label,
		helper,
		class: className = '',
		value = $bindable(),
		id,
		type = 'text',
		...rest
	}: Props = $props();
</script>

<div class="mb-3 flex flex-col space-y-1">
	<label for={id}>{label}</label>

	<input
		bind:value
		{id}
		{type}
		class={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-(--color-muted-foreground) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
		{...rest}
	/>

	{#if helper}
		<span class="text-(--color-muted-foreground)">
			{helper}
		</span>
	{/if}
</div>
