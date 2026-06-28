import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import en from './dictionaries/en.json';
import ru from './dictionaries/ru.json';

export const DICTIONARIES = { ru, en } as const;

export type I18nLocale = keyof typeof DICTIONARIES;

export const i18nConfig: { defaultLocale: I18nLocale; locales: I18nLocale[] } = {
	defaultLocale: 'en',
	locales: ['ru', 'en']
} as const;

function getStored(): I18nLocale {
	if (!browser) return i18nConfig.defaultLocale;
	const value = localStorage.getItem('locale');

	if (value && value in DICTIONARIES) {
		return value as I18nLocale;
	}
	return i18nConfig.defaultLocale;
}

export const locale = writable<I18nLocale>(getStored());

locale.subscribe((v) => {
	if (browser) localStorage.setItem('locale', v);
});

export const getDictionary = (locale: string) => {
	if (locale in DICTIONARIES) {
		return DICTIONARIES[locale as I18nLocale];
	}
	return DICTIONARIES[i18nConfig.defaultLocale];
};

export type Dictionary = ReturnType<typeof getDictionary>;
