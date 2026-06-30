<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		children?: Snippet;
		variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
	};
	let { children, variant = 'primary', ...restProps }: Props = $props();
</script>

<button {...restProps} class="btn {variant} {restProps.class}">
	{#if children}
		{@render children()}
	{/if}
</button>

<style>
	button.btn {
		display: inline-flex;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 1rem;
		padding-right: 1rem;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 500;
		white-space: nowrap;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 300ms;
		cursor: pointer;
		border: 1px solid transparent;
	}

	button.btn.primary {
		color: var(--color-primary-foreground);
		background-color: var(--color-primary);
	}

	button.btn.primary:hover {
		background-color: color-mix(in oklab, var(--color-primary) 90%, transparent);
	}

	button.btn.primary:active {
		background-color: var(--primary-active);
	}

	button.btn.primary:active {
		background-color: var(--color-accent);
	}

	button.btn:disabled {
		cursor: not-allowed;
	}

	button.btn.ghost {
		color: var(--color-secondary-foreground);
		fill: var(--color-secondary-foreground);
		background-color: color-mix(in oklab, var(--color-card) 30%, transparent);
		backdrop-filter: blur(8px);
		border-color: color-mix(in oklab, var(--color-secondary-foreground) 20%, transparent);
	}

	button.btn.ghost:hover {
		background-color: color-mix(in oklab, var(--color-card) 50%, transparent);
		backdrop-filter: blur(12px);
		border-color: color-mix(in oklab, var(--color-secondary-foreground) 40%, transparent);
	}

	button.btn.secondary {
		color: var(--color-secondary-foreground);
		fill: var(--color-secondary-foreground);
		border-color: var(--color-foreground);
	}

	button.btn.destructive {
		background-color: var(--color-destructive);
		color: var(--color-destructive-foreground);
	}

	button.btn.destructive:hover {
		background-color: color-mix(in oklab, var(--color-destructive) 90%, transparent);
	}
</style>
