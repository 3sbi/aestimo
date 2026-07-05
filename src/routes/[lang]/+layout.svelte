<script lang="ts">
	import { page } from '$app/state';
	import { locale } from '$lib/i18n';
	import type { I18nLocale } from '$lib/i18n';

	let { children } = $props();

	$effect(() => {
		locale.set(page.params.lang as I18nLocale);
	});
</script>

{@render children()}
