<script lang="ts">
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n/state.svelte';
	import { locale } from '$lib/i18n';
	import type { I18nLocale } from '$lib/i18n';

	let { children } = $props();

	function syncLocale() {
		const lang = page.params.lang as I18nLocale;
		i18n.setLocale(lang);
		locale.set(lang);
	}

	syncLocale();

	$effect(syncLocale);
</script>

{@render children()}
