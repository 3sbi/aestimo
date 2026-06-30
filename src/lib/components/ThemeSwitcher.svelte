<script lang="ts">
	import { i18n } from '$lib/i18n/state.svelte';
	import { setTheme } from '$lib/theme';
	import { MoonIcon, SunIcon } from '@lucide/svelte';
	import Button from './Button.svelte';
	const title = i18n.messages.pages.room.settings.theme;

	function toggleTheme() {
		const attr = document.documentElement.getAttribute('data-theme');
		setTheme(attr === 'dark' ? 'light' : 'dark');
	}
</script>

<Button variant="ghost" class="btn relative" onclick={toggleTheme} {title}>
	<SunIcon class="transition-all duration-300 icon-sun" />
	<MoonIcon class="transition-all duration-300 icon-moon" />
</Button>
