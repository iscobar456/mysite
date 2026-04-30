import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { db, type Session, type User } from "../db";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";


const DAY_MS = 1000 * 60 * 60 * 24;


export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}


export function createSession(token: string, userId: number): Session {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        userId: userId,
        expiresAt: new Date(Date.now() + DAY_MS * 30)
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
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const row = db.prepare(
        "SELECT session.id, session.user_id, session.expires_at, user.email, user.password \
         FROM session INNER JOIN user ON session.user_id = user.id \
         WHERE session.id = ?"
    ).get(sessionId) as { id: string, userId: number, expiresAt: number, email: string, password: string };

    if (row === null) {
        return { session: null, user: null };
    }

    const session: Session = {
        id: row.id,
        userId: row.userId,
        expiresAt: new Date(row.expiresAt * 1000)
    };
    const user: User = {
        id: row.userId,
        email: row.email,
        password: row.password
    }

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

    return { session, user };
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


export function invalidateAllSessions(userId: number): void {
    db.prepare(
        "DELETE FROM sessions WHERE user_id = ?"
    ).run(userId);
}


export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

