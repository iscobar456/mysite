import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { db, type Session } from "../db";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";


const DAY_MS = 1000 * 60 * 60 * 24;


export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}


export function createSession(token: string): Session {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        expiresAt: new Date(Date.now() + DAY_MS * 30)
    }
    const insertStmt = db.prepare("INSERT INTO session (id, expires_at) VALUES (?, ?)");
    insertStmt.run(
        session.id,
        Math.floor(session.expiresAt.getTime() / 1000)
    )
    return session;
}


export function validateSessionToken(token: string): SessionValidationResult {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const row = db.prepare(
        "SELECT session.id, session.expires_at \
         FROM session WHERE session.id = ?"
    ).get(sessionId) as { id: string, expiresAt: number };

    if (row === null) {
        return { session: null };
    }

    const session: Session = {
        id: row.id,
        expiresAt: new Date(row.expiresAt * 1000)
    };

    // Delete session if expired.
    if (session.expiresAt.getTime() <= Date.now()) {
        db.prepare(
            "DELETE FROM session WHERE id = ?"
        ).run(session.id);
    }

    // Update expiresAt if within 15 days.
    if (session.expiresAt.getTime() - DAY_MS * 15 <= Date.now()) {
        session.expiresAt = new Date(Date.now() + DAY_MS * 30);
        db.prepare(
            "UPDATE session SET expires_at = ? WHERE id = ?"
        ).run(
            Math.floor(session.expiresAt.getTime() / 1000),
            session.id
        )
    }

    return { session };
}


export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
    event.cookies.set("session", token, {
        httpOnly: true,
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });
}


export function deleteSessionTokenCookie(event: RequestEvent) {
    event.cookies.set("session", "", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
}


export function invalidateSession(sessionId: string): void {
    db.prepare(
        "DELETE FROM sessions WHERE id = ?"
    ).run(sessionId);
}


export function invalidateAllSessions(): void {
    db.prepare(
        "DELETE FROM sessions"
    ).run();
}

export function isLoggedIn(token: string | undefined | null): boolean {
    return (
        token !== undefined
        && token !== null
        && validateSessionToken(token).session !== null
    );
}


export type SessionValidationResult = { session: Session | null }

