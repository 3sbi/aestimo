<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import RadioButton from '$lib/components/RadioButton.svelte';
	import SmallVoteCard from '$lib/components/SmallVoteCard.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import { i18n as locales } from '$lib/i18n/state.svelte';
	import type { DefinedVoteType } from '$lib/server/consts/predefinedVoteTypes';
	import { slugify } from '$lib/utils/slugify';
	import { LoaderCircleIcon } from '@lucide/svelte';

	type Props = {
		predefinedVoteTypes: DefinedVoteType[];
	};
	const { predefinedVoteTypes }: Props = $props();

	const i18n = locales.messages.pages.new.createRoomForm;
	let loading = $state<boolean>(false);
	let userVoteTypeId = $state<string | null>(null);
	let voteTypeId = $derived(userVoteTypeId ?? predefinedVoteTypes[0].id);
	let prefix = $state<string>('');

	const renderSlugHelper = (): string => {
		if (!prefix.length) {
			return i18n.slug.random;
		}
		const url: string = `${location.origin}/${slugify(prefix)}-xxxxxxx`;
		return `${i18n.slug.helper} ${url}`;
	};
</script>

<div>
	<div class="px-6 py-3">
		<h1 class="text-center font-semibold text-lg">{i18n.header}</h1>
	</div>
	<hr class="w-full" />
	<form class="flex flex-col px-6 pb-6 pt-3 grow" method="POST" action="?/create">
		<div class="grow">
			<Input name="name" label={i18n.roomName} />
			<Input type="text" name="username" label={i18n.username} />
			<Input
				type="text"
				name="prefix"
				label={i18n.slug.label}
				helper={renderSlugHelper()}
				bind:value={prefix}
			/>
			<div class="flex items-center gap-2 mb-3">
				<Switch name="private" id="private" />
				<label for="private">{i18n.private.label}</label>
			</div>
			<fieldset class="flex flex-col gap-4 mt-8 mb-8">
				<legend class="font-semibold mb-3">{i18n.checkboxes}</legend>
				{#each predefinedVoteTypes as option (option.id)}
					<div class="flex gap-2 items-center">
						<RadioButton
							id={option.id}
							name="voteType"
							value={option.id}
							checked={option.id === voteTypeId}
							onChange={() => (userVoteTypeId = option.id)}
						>
							<b class="min-w-32">{option.name}</b>
							<div class="flex gap-0.5 flex-wrap">
								{#each option.values as card (card.value)}
									<SmallVoteCard {...card} />
								{/each}
							</div>
						</RadioButton>
					</div>
				{/each}
			</fieldset>
		</div>
		<button class="btn" type="submit">
			{#if loading}
				<LoaderCircleIcon class="animate-spin" size={20} />
			{/if}
			{i18n.create}
		</button>
	</form>
</div>
