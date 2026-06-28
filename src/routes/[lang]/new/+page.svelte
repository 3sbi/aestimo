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
	<div class="tabs">
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

<style>
	.tabs {
		border-top-left-radius: inherit;
		border-top-right-radius: inherit;
		align-items: center;
		width: 100%;
		background-color: var(--color-secondary);
		color: var(--color-secondary-foreground);
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.tabs .tab {
		display: flex;
		justify-content: center;
		flex-grow: 1;
		padding: 8px;
		background-color: var(--color-background);
		color: var(--color-foreground);
		cursor: pointer;
	}

	.tabs .tab > a {
		height: 100%;
		width: 100%;
		text-align: center;
		cursor: inherit;
	}

	.tabs .tab.active {
		cursor: auto;
		background-color: var(--color-card);
	}

	.tabs .tab:not(.active) {
		box-shadow: inset 0px -4px 4px hsl(0 0% 0% / 0.1);
	}

	.tabs .tab:first-child {
		border-top-left-radius: inherit;
	}

	.tabs .tab:last-child {
		border-top-right-radius: inherit;
	}

	.tabs .tab:not(:last-child) {
		border-right: 1px solid var(--color-border);
	}

	.card {
		background-color: var(--color-card);
		color: var(--color-card-foreground);
		border-radius: var(--radius);
		border-width: 1px;
		box-shadow: var(--shadow-lg);
	}
</style>
