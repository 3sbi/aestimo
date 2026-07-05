<script>
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { i18n as locales } from '$lib/i18n/state.svelte';
	import { LinkIcon, RocketIcon } from '@lucide/svelte';
	const i18n = locales.messages.pages.home;
</script>

<div class="flex flex-col h-full grow">
	<header class="flex gap-2 p-4 justify-between items-center m-auto w-full xl:max-w-6xl">
		<a href={resolve('/')} class="flex gap-2 items-center">
			<img src={asset('/icon.svg')} alt="icon" width={32} height={32} />
			<div class="text-2xl">Aestimo</div>
		</a>
		<div class="flex gap-2 items-center">
			<ThemeSwitcher />
			<LanguageSelector />
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
					{i18n.header}
				</h1>

				<p class="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6">
					{i18n.subheader}
				</p>

				<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<a href={resolve(`/${page.params.lang}/new?tab=create`)}>
						<Button>
							<RocketIcon />
							{i18n.buttons.new}
						</Button>
					</a>
					<a href={resolve(`/${page.params.lang}/new?tab=join`)}>
						<Button>
							<LinkIcon />
							{i18n.buttons.join}
						</Button>
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
