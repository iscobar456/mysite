import { invalidateSessionToken } from "$lib/server/auth";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = ({ cookies }) => {
    const token = cookies.get("sessiontoken");
    if (token) {
        invalidateSessionToken(token);
    }
    cookies.delete("sessiontoken", { path: "/" });
    throw redirect(303, "/login");
}
