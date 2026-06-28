import { defineConfig } from 'drizzle-kit';
import { getDbUrl } from './src/lib/server/config/getDbUrl';

export default defineConfig({
	out: './drizzle',
	schema: './src/lib/server/db/schemas',
	dialect: 'postgresql',
	dbCredentials: { url: getDbUrl(process.env) },
	verbose: true,
	strict: true
});
