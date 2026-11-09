import type { PageServerLoad } from './$types';
import { getPostsByType } from '$lib/db';


export const load: PageServerLoad = async () => {
    return {
        posts: getPostsByType('book'),
    }
}
