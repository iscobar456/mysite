import type { PageServerLoad } from './$types';
import { getBooks } from '$lib/db';

export const load: PageServerLoad = async () => {
    return { books: getBooks() };
}
