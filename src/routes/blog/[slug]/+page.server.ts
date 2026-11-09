import type { PageServerLoad } from './$types';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
    const item = getPostBySlug(params.slug);
    if (item === undefined) {
        error(404, "This page does not exist.");
    }
    return { post: await marked.parse(item.content) };
}
