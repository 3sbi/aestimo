<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';

	const PRESET_COLORS: string[] = ['#9ec8fe', '#a3dff2', '#9dd49a', '#f4dd94', '#f39893'];
</script>

<ColorPicker swatches={PRESET_COLORS} sliderDirection="horizontal" />
