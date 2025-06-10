export const PRESET_COLORS: string[] = [
  "#9ec8fe",
  "#a3dff2",
  "#9dd49a",
  "#f4dd94",
  "#f39893",
];

export function getRandomPresetColor(): string {
  const index = Math.floor(Math.random() * PRESET_COLORS.length);
  return PRESET_COLORS[index];
}
