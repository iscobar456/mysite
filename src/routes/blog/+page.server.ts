import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/db';


export const load: PageServerLoad = async () => {
    const posts = getPosts();
    return {
        posts: posts,
    }
}
