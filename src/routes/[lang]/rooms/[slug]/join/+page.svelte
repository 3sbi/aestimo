<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { LoaderCircleIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const i18n = $derived(data.i18n);
	const slug = $derived(data.slug);

	let loading = $state(false);
	let username = $state('');

	async function onFinish(e: SubmitEvent) {
		e.preventDefault();
		loading = true;

		try {
			const res = await fetch(`/api/rooms/${slug}/join`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username })
			});

			if (res.ok) {
				await goto(resolve(`/${page.params.lang}/rooms/${slug}`), { replaceState: true });
			} else {
				const data = await res.json();
				toast.error(data.error);
			}
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex justify-end gap-2 p-4">
	<ThemeSwitcher />
	<LanguageSelector />
</div>
<div class="m-auto card relative w-120 flex flex-col max-h-3/5">
	<form class="flex grow flex-col px-6 pt-3 pb-6" onsubmit={onFinish}>
		<div class="grow">
			<Input id="username" label={i18n.username} bind:value={username} required />
		</div>

		<Button class="btn mt-4" type="submit" disabled={loading}>
			{#if loading}
				<LoaderCircleIcon class="animate-spin" size={20} />
			{/if}

			{i18n.join}
		</Button>
	</form>
</div>

<style>
	.card {
		background-color: var(--color-card);
		color: var(--color-card-foreground);
		border-radius: var(--radius);
		border-width: 1px;
		box-shadow: var(--shadow-lg);
	}
</style>
