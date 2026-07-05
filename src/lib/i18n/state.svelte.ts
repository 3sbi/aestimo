import { DICTIONARIES, i18nConfig, locale } from '.';

class I18n {
	messages = $state(DICTIONARIES[i18nConfig.defaultLocale]);

	constructor() {
		locale.subscribe((localeValue) => {
			this.messages = DICTIONARIES[localeValue];
		});
	}
}

export const i18n = new I18n();
