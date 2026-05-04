import { isLoggedIn, validateSessionToken } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ cookies }) => {
    const token = cookies.get("sessiontoken");
    if (!isLoggedIn(token)) {
        throw redirect(303, "/login");
    }
}
