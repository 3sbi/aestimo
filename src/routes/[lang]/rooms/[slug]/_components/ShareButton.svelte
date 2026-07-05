<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import Share2Icon from '@lucide/svelte/icons/share-2';

	type Props = {
		slug: string;
		i18n: {
			title: string;
			copied: string;
		};
	};

	let { slug, i18n }: Props = $props();

	let copied = $state<boolean>(false);
	let timeout: number;

	async function onClickInvite() {
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/rooms/${slug}/join`);
		} catch (err) {
			console.error(err);
		}

		clearTimeout(timeout);
		copied = true;
		timeout = window.setTimeout(() => {
			copied = false;
		}, 1000);
	}
</script>

<Tooltip text={i18n.copied} show={copied} offset={4}>
	<Button variant="ghost" iconOnly title={i18n.title} onclick={onClickInvite}>
		<Share2Icon />
	</Button>
</Tooltip>
