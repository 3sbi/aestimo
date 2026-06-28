<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	import Input from '$lib/components/Input.svelte';
	import { api } from '$lib/utils/api';

	import { LoaderCircleIcon } from '@lucide/svelte';

	import type { Dictionary } from '$lib/i18n/index';

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
			const res = await api.post(`/api/rooms/${roomSlug}/join`, {
				username
			});

			if (res.ok) {
				await goto(`/rooms/${roomSlug}`, {
					replaceState: true
				});
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
