export type Theme = 'light' | 'dark';

export function setTheme(theme: Theme) {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);
}

export function getPreferredTheme(): Theme {
	const stored = localStorage.getItem('theme');

	if (stored === 'light' || stored === 'dark') {
		return stored;
	}

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
