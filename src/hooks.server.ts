import { i18nConfig } from '$lib/i18n';
import { decodeSession } from '$lib/server/session';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const supported = i18nConfig.locales as unknown as string[];

export const handle: Handle = async ({ event, resolve }) => {
	// -----------------------------
	// Session
	// -----------------------------
	const token = event.cookies.get('session');

	event.locals.session = null;

	if (token) {
		event.locals.session = decodeSession(token);
	}

	// -----------------------------
	// Localization
	// -----------------------------
	const path = event.url.pathname;

	if (path.startsWith('/api/')) {
		return resolve(event);
	}

	const hasLocale = supported.some((lang) => path === `/${lang}` || path.startsWith(`/${lang}/`));

	if (!hasLocale) {
		const acceptLanguage = event.request.headers.get('accept-language') ?? '';
		const preferred = acceptLanguage.split(',')[0]?.split('-')[0];
		const locale =
			preferred && supported.includes(preferred) ? preferred : i18nConfig.defaultLocale;
		throw redirect(307, `/${locale}${path}`);
	}

	return resolve(event);
};
