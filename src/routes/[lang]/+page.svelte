<script>
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { i18n } from '$lib/i18n/state.svelte';
	import { LinkIcon, RocketIcon } from '@lucide/svelte';
</script>

<div class="flex flex-col h-full grow">
	<header class="flex gap-2 p-4 justify-between items-center m-auto w-full xl:max-w-6xl">
		<a href={resolve('/')} class="flex gap-2 items-center">
			<img src={asset('/icon.svg')} alt="icon" width={32} height={32} />
			<div class="text-2xl">Aestimo</div>
		</a>
		<div class="flex gap-2 items-center">
			<ThemeSwitcher />
		</div>
	</header>
	<section
		class="grow w-full flex flex-col items-center justify-center px-6 py-16 xl:max-w-6xl m-auto"
	>
		<div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
			<div class="text-center lg:text-left">
				<h1
					class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-4"
				>
					{i18n.messages.pages.home.header}
				</h1>

				<p class="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6">
					{i18n.messages.pages.home.subheader}
				</p>

				<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<a href={resolve(`/${page.params.lang}/new?tab=create`)}>
						<button class="btn">
							<RocketIcon />
							{i18n.messages.pages.home.buttons.new}
						</button>
					</a>
					<a href={resolve(`/${page.params.lang}/new?tab=join`)}>
						<button class="btn">
							<LinkIcon />
							{i18n.messages.pages.home.buttons.join}
						</button>
					</a>
				</div>
			</div>

			<div class="w-full flex justify-center">
				<img
					src={asset('/room.webp')}
					width={550}
					height={458}
					alt="room"
					class="rounded-lg shadow-lg w-full"
				/>
			</div>
		</div>
	</section>
</div>
