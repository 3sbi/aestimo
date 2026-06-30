<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { i18n } from '$lib/i18n/state.svelte';
	import { locale, DICTIONARIES, i18nConfig } from '$lib/i18n';
	import type { I18nLocale } from '$lib/i18n';
	import { LanguagesIcon, CheckIcon } from '@lucide/svelte';
	import Button from './Button.svelte';

	let open = $state(false);

	function toggle() {
		open = !open;
	}

	function select(localeValue: I18nLocale) {
		const current = page.params.lang as I18nLocale;
		if (localeValue === current) {
			open = false;
			return;
		}

		locale.set(localeValue);
		i18n.setLocale(localeValue);

		const path = `/${localeValue}${page.url.pathname.slice(current.length + 1)}${page.url.search}`;
		goto(path);
	}

	$effect(() => {
		if (!browser || !open) return;

		function onClick(e: MouseEvent) {
			const target = e.target as HTMLElement;
			if (!target.closest('.language-switcher')) {
				open = false;
			}
		}

		document.addEventListener('click', onClick);
		return () => document.removeEventListener('click', onClick);
	});
</script>

<div class="language-switcher relative">
	<Button
		variant="ghost"
		class="btn relative"
		onclick={toggle}
		title={i18n.messages.pages.room.settings.language}
	>
		<LanguagesIcon />
	</Button>

	{#if open}
		<div class="dropdown" role="listbox">
			{#each i18nConfig.locales as localeValue (localeValue)}
				{@const active = page.params.lang === localeValue}
				<button
					class="option"
					class:active
					role="option"
					aria-selected={active}
					onclick={() => select(localeValue)}
				>
					{DICTIONARIES[localeValue].language}
					{#if active}
						<CheckIcon size={14} class="ml-auto" />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.dropdown {
		display: flex;
		flex-direction: column;
		gap: 4px;
		position: absolute;
		top: calc(100% + 4px);
		right: 0;
		min-width: 140px;
		padding: 4px;
		background: var(--color-card);
		color: var(--color-card-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		box-shadow: var(--shadow-lg);
		z-index: 50;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 6px 8px;
		border-radius: calc(var(--radius) - 2px);
		font-size: 0.875rem;
		line-height: 1.25rem;
		cursor: pointer;
		background: transparent;
		color: inherit;
		border: none;
		text-align: left;
	}

	.option:hover {
		background: var(--color-muted);
	}

	.option.active {
		background: var(--color-muted);
	}
</style>
