<script lang="ts">
	import { i18n } from '$lib/i18n/state.svelte';
	import { getPreferredTheme, setTheme, type Theme } from '$lib/theme';
	import { MoonIcon, SunIcon } from '@lucide/svelte';
	const title = i18n.messages.pages.room.settings.theme;
	let theme: Theme = $state('light');

	$effect(() => {
		theme = getPreferredTheme();
		setTheme(theme);
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		setTheme(theme);
	}
</script>

<button class="btn relative" onclick={toggleTheme} {title}>
	<SunIcon
		class=" transition-all duration-300 {theme === 'dark'
			? 'hidden scale-0 -rotate-90'
			: 'scale-100 rotate-0'}"
	/>
	<MoonIcon
		class=" transition-all duration-300 {theme === 'dark'
			? 'scale-100 rotate-0'
			: 'hidden scale-0 rotate-90'}"
	/>
</button>
