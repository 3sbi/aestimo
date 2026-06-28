<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Dictionary } from '$lib/i18n';
	import type { ClientRoom } from '$lib/types';

	import { DoorClosedIcon, DoorOpenIcon, SearchXIcon } from '@lucide/svelte';

	type Props = {
		rooms: ClientRoom[];
		i18n: Dictionary['pages']['new']['joinRoomForm'];
	};
	let { i18n, rooms }: Props = $props();

	function getHref(room: ClientRoom) {
		return resolve('/rooms/[slug]/join', { slug: room.slug });
	}
</script>

{#if rooms.length === 0}
	<div class="empty">
		<SearchXIcon size={32} />
		<h5>{i18n.empty}</h5>
	</div>
{:else}
	<ul class="flex flex-col">
		{#each rooms as room (room.slug)}
			<li>
				<a href={getHref(room)} class="roomItem">
					<div class="icon">
						<div class="doorOpenIcon">
							<DoorOpenIcon />
						</div>
						<div class="doorClosedIcon">
							<DoorClosedIcon />
						</div>
					</div>

					<div class="roomName">
						{room.name}
					</div>
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.roomItem {
		padding: 8px 16px;
		cursor: pointer;
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--border);
		gap: 8px;
	}

	.roomItem:hover .roomName {
		text-decoration: underline;
	}

	.roomItem .icon .doorOpenIcon {
		display: none;
	}

	.roomItem:hover .doorClosedIcon {
		display: none;
	}

	.roomItem:hover .icon .doorOpenIcon {
		display: block;
	}

	.empty {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		align-items: center;
		text-align: center;
		color: var(--muted-foreground);
	}
</style>
