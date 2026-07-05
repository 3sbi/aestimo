<script lang="ts">
	import { page } from '$app/state';
	import { DICTIONARIES, i18nConfig } from '$lib/i18n';
	import type { I18nLocale } from '$lib/i18n';

	const locale = $derived.by((): I18nLocale => {
		const match = page.url.pathname.match(/^\/(ru|en)\b/);
		return (match?.[1] ?? i18nConfig.defaultLocale) as I18nLocale;
	});
	const dict = $derived(DICTIONARIES[locale]);
</script>

<svelte:head>
	<title>{page.status === 404 ? dict.pages['not-found'].header : dict.pages.error.header} - Aestimo</title>
</svelte:head>

<div class="flex flex-col h-full grow">
	<section class="grow w-full flex flex-col items-center justify-center px-6 py-16">
		<h1 class="text-6xl font-extrabold text-foreground mb-4">
			{page.status}
		</h1>
		<p class="text-xl text-muted-foreground mb-8 text-center max-w-md">
			{page.status === 404 ? dict.pages['not-found'].description : dict.pages.error.description}
		</p>
	</section>
</div>
