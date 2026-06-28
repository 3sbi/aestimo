import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { getDbUrl } from './getDbUrl';

const envSchema = z.object({
	POSTGRES_USER: z.string().min(1),
	POSTGRES_PASSWORD: z.string().min(1),
	POSTGRES_DB: z.string().min(1),
	POSTGRES_HOST: z.string().min(1),
	POSTGRES_PORT: z.coerce.number().min(1).default(5432),
	SESSION_SECRET: z.string().min(32),
	NODE_ENV: z.enum(['development', 'production']).default('production'),
	PORT: z.coerce.number().default(8080)
});

function validateEnv(data: unknown) {
	const result = envSchema.safeParse(data);
	if (!result.success) {
		throw new Error(
			result.error.issues.reduce(
				(acc, { path, message }) => acc + '\n' + `[${path.join('.')}]: ${message}`,
				'Errors found while parsing environment:'
			)
		);
	}
	return result.data;
}


const instance = Symbol('config');

export class ConfigInstance {
	static [instance]: ConfigInstance;

	public readonly port!: number;
	public readonly dbUrl!: string;
	public readonly sessionSecret!: string;
	public readonly isProduction!: boolean;

	constructor() {
		if (ConfigInstance[instance]) return ConfigInstance[instance];
		const config = validateEnv(env);

		this.port = config.PORT;
		this.dbUrl = getDbUrl(env);
		this.sessionSecret = config.SESSION_SECRET;
		this.isProduction = config.NODE_ENV === 'production';

		ConfigInstance[instance] = this;
	}
}

export const config = new ConfigInstance();
