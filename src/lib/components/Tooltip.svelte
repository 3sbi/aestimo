<script lang="ts">
	type Placement = 'top' | 'bottom' | 'left' | 'right';
	const PREFERRED: Placement = 'top';

	interface Props {
		text: string;
		offset?: number;
		delay?: number;
		show?: boolean;
		children: import('svelte').Snippet;
	}

	let { text, offset = 8, delay = 250, show, children }: Props = $props();

	let trigger = $state<HTMLElement | null>(null);
	let tooltip = $state<HTMLElement | null>(null);
	let hover = $state<boolean>(false);

	let visible = $derived<boolean>(show ?? hover);

	let top = $state<number>(0);
	let left = $state<number>(0);
	let placement = $state<Placement>(PREFERRED);

	let timeoutId: number;

	const placements: Placement[] = ['top', 'bottom', 'right', 'left'];

	async function open() {
		if (show !== undefined) return;

		clearTimeout(timeoutId);

		timeoutId = window.setTimeout(() => {
			position();
			hover = true;
		}, delay);
	}

	function close() {
		if (show !== undefined) return;

		clearTimeout(timeoutId);
		hover = false;
	}

	function fits(rect: DOMRect, tip: DOMRect, p: Placement) {
		switch (p) {
			case 'top':
				return rect.top >= tip.height + offset;

			case 'bottom':
				return window.innerHeight - rect.bottom >= tip.height + offset;

			case 'left':
				return rect.left >= tip.width + offset;

			case 'right':
				return window.innerWidth - rect.right >= tip.width + offset;
		}
	}

	function compute(rect: DOMRect, tip: DOMRect, p: Placement) {
		switch (p) {
			case 'top':
				return {
					top: rect.top - tip.height - offset,
					left: rect.left + rect.width / 2 - tip.width / 2
				};

			case 'bottom':
				return {
					top: rect.bottom + offset,
					left: rect.left + rect.width / 2 - tip.width / 2
				};

			case 'left':
				return {
					top: rect.top + rect.height / 2 - tip.height / 2,
					left: rect.left - tip.width - offset
				};

			case 'right':
				return {
					top: rect.top + rect.height / 2 - tip.height / 2,
					left: rect.right + offset
				};
		}
	}

	function clamp(pos: { top: number; left: number }, tip: DOMRect) {
		const padding = 8;

		pos.left = Math.max(padding, Math.min(pos.left, window.innerWidth - tip.width - padding));

		pos.top = Math.max(padding, Math.min(pos.top, window.innerHeight - tip.height - padding));

		return pos;
	}

	function position() {
		if (!trigger || !tooltip) return;

		const rect = trigger.getBoundingClientRect();
		const tip = tooltip.getBoundingClientRect();

		const order = [PREFERRED, ...placements.filter((p) => p !== PREFERRED)];

		placement = order.find((p) => fits(rect, tip, p)) ?? PREFERRED;

		const pos = clamp(compute(rect, tip, placement), tip);

		top = pos.top;
		left = pos.left;
	}

	function update() {
		if (visible) position();
	}

	$effect(() => {
		if (!visible) return;

		position();
		window.addEventListener('scroll', update, true);
		window.addEventListener('resize', update);

		return () => {
			window.removeEventListener('scroll', update, true);
			window.removeEventListener('resize', update);
		};
	});
</script>

<div
	bind:this={trigger}
	role="button"
	tabindex="0"
	onmouseenter={open}
	onmouseleave={close}
	onfocus={open}
	onblur={close}
>
	{@render children()}
</div>

<div
	bind:this={tooltip}
	class="tooltip {placement}"
	class:visible
	style={`top:${top}px;left:${left}px`}
	role="tooltip"
	aria-hidden={!visible}
>
	{text}
</div>

<style>
	.trigger {
		display: inline-flex;
	}

	.tooltip {
		position: fixed;
		z-index: 1000;
		max-width: 260px;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		background: var(--color-secondary-foreground);
		color: var(--color-secondary);
		font-size: 0.875rem;
		line-height: 1.3;
		pointer-events: none;
		transform: translateY(4px) scale(0.98);
		box-shadow: var(--shadow-lg);
		opacity: 0;
		transition:
			opacity 0.15s,
			transform 0.15s;
	}

	.tooltip.visible {
		opacity: 1;
		transform: none;
	}

	.tooltip.top {
		transform: translateY(8px);
	}
	.tooltip.top.visible {
		transform: translateY(0);
	}
	.tooltip.bottom {
		transform: translateY(-8px);
	}
	.tooltip.bottom.visible {
		transform: translateY(0);
	}
	.tooltip.left {
		transform: translateX(8px);
	}
	.tooltip.left.visible {
		transform: translateX(0);
	}
	.tooltip.right {
		transform: translateX(-8px);
	}
	.tooltip.right.visible {
		transform: translateX(0);
	}
</style>
