<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import type { Dictionary } from '$lib/i18n';
	import type { ClientRoom } from '$lib/types';
	import { CircleQuestionMarkIcon, Settings } from '@lucide/svelte';
	import LeaveRoomButton from './LeaveRoomButton.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	interface Props {
		room: ClientRoom;
		i18n: Dictionary['pages']['room']['settings'];
		currentUserId: number;
		isAdmin: boolean;
	}

	let { room, i18n, currentUserId, isAdmin }: Props = $props();

	let opened = $state(false);

	async function onPrivateChange(value: boolean) {
		try {
			await fetch(`/api/rooms/${room.slug}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ private: value })
			});
		} catch (err) {
			console.error(err);
		}
	}

	async function onAutorevealChange(value: boolean) {
		try {
			await fetch(`/api/rooms/${room.slug}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ autoreveal: value })
			});
		} catch (err) {
			console.error(err);

		}
	}

	function onOverlayClick(e: MouseEvent) {
		if (e.currentTarget === e.target) {
			opened = false;
		}
	}
</script>

<Button variant="ghost" title={i18n.label} onclick={() => (opened = true)} iconOnly>
	<Settings />
</Button>

{#if opened}
	<div
		class="overlay"
		role="dialog"
		tabindex={1}
		aria-modal="true"
		onclick={onOverlayClick}
		onkeydown={(e) => {
			if (e.key === 'Escape') opened = false;
		}}
	>
		<div class="popup">
			<h2 class="title">{i18n.label}</h2>

			{#if isAdmin}
				<label class="row">
					<span>{i18n.private}</span>
					<Switch checked={room.private} onChange={onPrivateChange} />
				</label>

				<label class="row">
					<div class="flex items-center gap-2">
						<span>{i18n.autoreveal.label}</span>
						<Tooltip text={i18n.autoreveal.tooltip}>
							<CircleQuestionMarkIcon size={14} />
						</Tooltip>
					</div>
					<Switch checked={room.autoreveal} onChange={onAutorevealChange} />
				</label>
			{/if}

			<LeaveRoomButton {room} i18n={i18n.leave} {currentUserId} {isAdmin} />
		</div>
	</div>
{/if}

<style>
	.overlay {
		height: 100%;
		width: 100%;
		background-color: color-mix(in oklab, #000000 50%, transparent);
		display: flex;
		justify-content: center;
		align-items: center;
		left: 0;
		top: 0;
		position: fixed;
		z-index: 120;
		cursor: pointer;
	}

	.popup {
		background: var(--color-card);
		color: var(--color-card-foreground);
		border-radius: var(--radius);
		border-width: 1px;
		box-shadow: var(--shadow-lg);
		padding: 24px;
		min-width: 280px;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		cursor: auto;
	}

	.title {
		font-size: var(--text-xl);
		font-weight: 700;
		text-align: center;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		font-size: var(--text-sm);
		font-weight: 600;
		cursor: pointer;
	}
</style>
