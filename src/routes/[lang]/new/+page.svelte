<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import CreateRoomForm from './CreateRoomForm.svelte';
	import PublicRoomsList from './PublicRoomsList.svelte';

	let { data }: PageProps = $props();

	const currentTab = $derived(page.url.searchParams.get('tab'));
	const TABS = [
		{ value: 'create', label: 'Create' },
		{ value: 'join', label: 'join' }
	];
</script>

<div class="m-auto card relative w-120 flex flex-col max-h-3/5">
	<div>
		{#each TABS as tab (tab.value)}
			<div class="tab" class:active={tab.value === currentTab}>
				<a href={resolve(`/${page.params.lang}/new?tab=${tab.value}`)}>
					{tab.label}
				</a>
			</div>
		{/each}
	</div>

	{#if currentTab === 'create'}
		<CreateRoomForm predefinedVoteTypes={data.predefinedVoteTypes} />
	{/if}

	{#if currentTab === 'join'}
		<PublicRoomsList i18n={data.i18n.joinRoomForm} rooms={data.roomsToJoin} />
	{/if}
</div>
