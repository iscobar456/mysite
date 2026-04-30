import { db, User } from "$lib/db";
import { createSession, generateSessionToken } from "$lib/server/auth";
import argon2 from 'argon2';
import type { Actions } from "@sveltejs/kit";

export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        // TODO: better form validation maybe zod
        if (email === null || password === null) {
            return { success: false }
        }

        console.log(email, password);

        const user = db.prepare(
            'SELECT id, email, password FROM "user" WHERE email = ? LIMIT 1'
        ).get(email) as User;
        // returns {'1': 1} or undefined
        console.log(user);

        if (user === undefined) {
            return { success: false };
        }

        if (! await argon2.verify(user.password, password as string)) {
            return { success: false };
        }

        const sessionToken = generateSessionToken();
        createSession(sessionToken, user.id);
        cookies.set(
            'sessiontoken',
            sessionToken,
            { path: '/' }
        )

        return { success: true };
    }
} satisfies Actions
