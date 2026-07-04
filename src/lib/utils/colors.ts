export const PRESET_COLORS: string[] = ['#9ec8fe', '#a3dff2', '#9dd49a', '#f4dd94', '#f39893'];

export function getContrastYIQ(hexcolor: string) {
	const r = parseInt(hexcolor.substring(1, 3), 16);
	const g = parseInt(hexcolor.substring(3, 5), 16);
	const b = parseInt(hexcolor.substring(5, 7), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? 'black' : 'white';
}

export function getRandomPresetColor(): string {
	const index = Math.floor(Math.random() * PRESET_COLORS.length);
	return PRESET_COLORS[index];
}
