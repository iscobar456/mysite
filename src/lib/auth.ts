import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "./db";
import { sha256 } from "@oslojs/crypto/sha2";


export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export function createSession(token: string, userId: number): Session {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token));
	const session: Session = {
		id: sessionId,
		userId: userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	}
	const insertStmt = db.prepare("INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)");
	insertStmt.run(
		session.id,
		session.userId,
		Math.floor(session.expiresAt.getTime() / 1000)
	)
	return session;
}

export function validateSessionToken(token: string): SessionValidationResult {
	// TODO
}

export function invalidateSession(sessionId: string): void {
	// TODO
}

export async function invalidateAllSessions(userId: number): Promise<void> {
	// TODO
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Session {
	id: string;
	userId: number;
	expiresAt: Date;
}

export interface User {
	id: number;
}

