<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import type { Dictionary } from '$lib/i18n';
	import type { ClientRoom } from '$lib/types';

	interface Props {
		room: ClientRoom;
		i18n: Dictionary['pages']['room']['settings']['leave'];
		currentUserId: number;
		isAdmin: boolean;
	}

	let { room, i18n, currentUserId, isAdmin }: Props = $props();

	let confirmOpened = $state(false);

	async function onLeave() {
		if (isAdmin) {
			confirmOpened = true;
		} else {
			await leaveRoom();
		}
	}

	async function confirmDelete() {
		confirmOpened = false;

		try {
			const res = await fetch(`/api/rooms/${room.slug}`, { method: 'DELETE' });
			const json: { success: boolean } = await res.json();

			if (res.ok && json.success) {
				await goto(resolve('/'), { replaceState: true });
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function leaveRoom() {
		try {
			const res = await fetch(`/api/users/${currentUserId}`, { method: 'DELETE' });
			const json: { success: boolean } = await res.json();

			if (res.ok && json.success) {
				await goto(resolve('/'), { replaceState: true });
			}
		} catch (err) {
			console.error(err);
		}
	}

	function onConfirmOverlayClick(e: MouseEvent) {
		if (e.currentTarget === e.target) {
			confirmOpened = false;
		}
	}
</script>

<Button variant="destructive" onclick={onLeave}>
	{i18n.label}
</Button>

{#if confirmOpened}
	<div
		class="overlay"
		role="alertdialog"
		tabindex={1}
		aria-modal="true"
		onclick={onConfirmOverlayClick}
		onkeydown={(e) => {
			if (e.key === 'Escape') confirmOpened = false;
		}}
	>
		<div class="popup">
			<h2 class="title">{i18n.modal.header}</h2>
			<p class="confirm-help">{i18n.modal.help}</p>

			<div class="confirm-actions">
				<Button variant="ghost" onclick={() => (confirmOpened = false)}>
					{i18n.modal.cancel}
				</Button>
				<Button variant="destructive" onclick={confirmDelete}>
					{i18n.modal.confirm}
				</Button>
			</div>
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
		z-index: 130;
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

	.confirm-help {
		font-size: var(--text-sm);
		line-height: 1.5;
		color: var(--muted-foreground);
		text-align: center;
	}

	.confirm-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
	}
</style>
