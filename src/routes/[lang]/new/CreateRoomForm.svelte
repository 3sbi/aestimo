<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import RadioButton from '$lib/components/RadioButton.svelte';
	import SmallVoteCard from '$lib/components/SmallVoteCard.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import VoteTypeCreator, { type CustomVoteCard } from '$lib/components/VoteTypeCreator.svelte';
	import { i18n as locales } from '$lib/i18n/state.svelte';
	import type { DefinedVoteType } from '$lib/server/consts/predefinedVoteTypes';
	import type { VoteCard } from '$lib/types';
	import { slugify } from '$lib/utils/slugify';
	import { LoaderCircleIcon } from '@lucide/svelte';

	type Props = {
		predefinedVoteTypes: DefinedVoteType[];
	};
	const { predefinedVoteTypes }: Props = $props();

	const i18n = $derived(locales.messages.pages.new.createRoomForm);
	let loading = $state<boolean>(false);
	let userVoteTypeId = $state<string | null>(null);
	let voteTypeId = $derived(userVoteTypeId ?? predefinedVoteTypes[0].id);
	let customCards = $state<CustomVoteCard[]>([]);
	let prefix = $state<string>('');

	const renderSlugHelper = (): string => {
		if (!prefix.length) {
			return i18n.slug.random;
		}
		const url: string = `${location.origin}/${slugify(prefix)}-xxxxxxx`;
		return `${i18n.slug.helper} ${url}`;
	};

	const getVoteOptions = (): VoteCard[] => {
		if (voteTypeId === 'custom') {
			return customCards;
		}
		const voteType = predefinedVoteTypes.find((voteType) => voteType.id === voteTypeId);
		return voteType?.values ?? [];
	};

	const onSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		loading = true;

		const form = e.target as HTMLFormElement;
		const data = new FormData(form);

		const body = {
			name: data.get('name') as string,
			username: data.get('username') as string,
			prefix: data.get('prefix') as string,
			private: data.has('private'),
			voteOptions: getVoteOptions()
		};

		const res = await fetch('/api/rooms', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (res.ok) {
			const room: { slug: string } = await res.json();
			const url = resolve(`/${page.params.lang}/rooms/${room.slug}`);
			await goto(url);
		}
		loading = false;
	};
</script>

<div>
	<div class="px-6 py-3">
		<h1 class="text-center font-semibold text-lg">{i18n.header}</h1>
	</div>
	<hr class="w-full" />
	<form class="flex flex-col px-6 pb-6 pt-3 grow" onsubmit={onSubmit}>
		<div class="grow">
			<Input name="name" label={i18n.roomName} required />
			<Input type="text" name="username" label={i18n.username} required />
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
				<legend class="font-semibold mb-3">
					<span>{i18n.checkboxes}</span>
					<span class="text-(--color-destructive)"> *</span>
				</legend>
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
				<div class="flex gap-2 items-center">
					<RadioButton
						id="custom"
						name="voteType"
						value="custom"
						checked={voteTypeId === 'custom'}
						onChange={() => (userVoteTypeId = 'custom')}
					>
						<b class="min-w-32">{i18n.custom}</b>
						<VoteTypeCreator bind:cards={customCards} i18n={i18n.customVoteCard} />
					</RadioButton>
				</div>
			</fieldset>
		</div>
		<Button>
			{#if loading}
				<LoaderCircleIcon class="animate-spin" size={20} />
			{/if}
			{i18n.create}
		</Button>
	</form>
</div>
