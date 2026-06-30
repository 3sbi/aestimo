<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Not Found' : 'Error'} - Aestimo</title>
</svelte:head>

<div class="flex flex-col h-full grow">
	<section class="grow w-full flex flex-col items-center justify-center px-6 py-16">
		<h1 class="text-6xl font-extrabold text-foreground mb-4">
			{page.status}
		</h1>
		<p class="text-xl text-muted-foreground mb-8 text-center max-w-md">
			{page.status === 404 ? 'Page not found' : 'Something went wrong'}
		</p>
	</section>
</div>
