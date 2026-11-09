import { getPosts } from "$lib/db";
import { adminActions } from "$lib/server/admin";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({ items: getPosts() });

export const actions = adminActions("post");
