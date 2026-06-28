import crypto from 'node:crypto';
import { config } from './config';

const SECRET = crypto.createHash('sha256').update(config.sessionSecret).digest();

export type Session = {
	userId: number;
	roomSlug: string;
};

export function encodeSession(session: Session): string {
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv('aes-256-gcm', SECRET, iv);
	const plaintext = JSON.stringify(session);
	const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
	const tag = cipher.getAuthTag();
	return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

export function decodeSession(token: string): Session | null {
	try {
		const data = Buffer.from(token, 'base64url');
		const iv = data.subarray(0, 12);
		const tag = data.subarray(12, 28);
		const encrypted = data.subarray(28);
		const decipher = crypto.createDecipheriv('aes-256-gcm', SECRET, iv);
		decipher.setAuthTag(tag);
		const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()]);
		return JSON.parse(plaintext.toString('utf8'));
	} catch {
		return null;
	}
}
