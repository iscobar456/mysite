import { getBooks } from "$lib/db";
import { adminActions } from "$lib/server/admin";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({ items: getBooks() });

export const actions = adminActions("book");
