import type { RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/db";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    const userExists = db.prepare(
        'SELECT EXISTS ( SELECT 1 FROM "user" WHERE email = \'?\' LIMIT 1)'
    ).run(
        email
    );

    console.log(userExists);

    return new Response('User created');
}
