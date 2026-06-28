<script lang="ts">
	import { getPreferredTheme, setTheme, type Theme } from '$lib/theme';
	import { MoonIcon, SunIcon } from '@lucide/svelte';

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

<button onclick={toggleTheme} class="relative">
	<SunIcon
		class="h-[1.2rem] w-[1.2rem] transition-all duration-300 {theme === 'dark' ? 'scale-0 -rotate-90' : 'scale-100 rotate-0'}"
	/>
	<MoonIcon
		class="absolute left-0 top-0 h-[1.2rem] w-[1.2rem] transition-all duration-300 {theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'}"
	/>
</button>
