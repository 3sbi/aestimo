<script lang="ts">
	import JoinRoomForm from '../../../new/JoinRoomForm.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const i18n = $derived(data.i18n);
	const slug = $derived(data.slug);
</script>

<JoinRoomForm roomSlug={slug} {i18n} />
