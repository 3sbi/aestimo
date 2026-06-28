<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Input from '$lib/components/Input.svelte';
	import type { Dictionary } from '$lib/i18n/index';
	import { LoaderCircleIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		i18n: Dictionary['pages']['new']['joinRoomForm'];
		roomSlug: string;
	}

	let { i18n, roomSlug }: Props = $props();

	let loading = $state(false);
	let username = $state('');

	async function onFinish(e: SubmitEvent) {
		e.preventDefault();
		loading = true;

		try {
			const res = await fetch(`/api/rooms/${roomSlug}/join`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username })
			});

			if (res.ok) {
				await goto(resolve(`/${page.params.lang}/rooms/${roomSlug}`), { replaceState: true });
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

<form class="flex grow flex-col px-6 pt-3 pb-6" onsubmit={onFinish}>
	<div class="grow">
		<Input id="username" label={i18n.username} bind:value={username} />
	</div>

	<button type="submit" class="mt-4" disabled={loading}>
		{#if loading}
			<LoaderCircleIcon class="animate-spin" size={20} />
		{/if}

		{i18n.join}
	</button>
</form>
