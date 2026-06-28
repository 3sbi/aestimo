import { drizzle } from 'drizzle-orm/postgres-js';
import { config } from '../config';

export const db = drizzle({ connection: config.dbUrl, casing: 'snake_case' });
