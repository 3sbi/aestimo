<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.ico';
	import { locale } from '$lib/i18n';
	import type { I18nLocale } from '$lib/i18n';
	import './layout.css';

	let { children } = $props();

	locale.set(page.params.lang as I18nLocale);

	$effect(() => {
		if (browser) {
			document.documentElement.lang = $locale;
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
