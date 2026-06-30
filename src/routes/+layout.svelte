<script lang="ts">
	import { browser } from '$app/environment';
	import favicon from '$lib/assets/favicon.ico';
	import { locale } from '$lib/i18n';
	import './layout.css';

	let { children } = $props();

	$effect(() => {
		if (browser) {
			document.documentElement.lang = $locale;
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
