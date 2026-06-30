import { DICTIONARIES, i18nConfig, type I18nLocale } from '.';

class I18n {
	messages = $state(DICTIONARIES[i18nConfig.defaultLocale]);

	setLocale(locale: I18nLocale) {
		this.messages = DICTIONARIES[locale];
	}
}

export const i18n = new I18n();
