import { db } from "$lib/db";
import { createSession, generateSessionToken } from "$lib/server/auth";
import argon2 from 'argon2';
import { redirect, type Actions } from "@sveltejs/kit";
import z from "zod";

const LoginFormSubmission = z.object({
    password: z.string(),
})

export const actions = {
    default: async ({ cookies, request }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const result = LoginFormSubmission.safeParse(data);
        if (!result.success) {
            console.log(result.error);
            return { success: false };
        }

        const userRow = db.prepare(
            "SELECT password FROM user WHERE username = 'admin' LIMIT 1"
        ).get() as { password: string };
        const truePassword = userRow.password;
        console.log(truePassword);

        if (!await argon2.verify(truePassword, result.data.password)) {
            return { success: false };
        }

        const sessionToken = generateSessionToken();
        createSession(sessionToken);
        cookies.set(
            'sessiontoken',
            sessionToken,
            { path: '/' }
        )

        throw redirect(303, "/admin/")
    }
} satisfies Actions
