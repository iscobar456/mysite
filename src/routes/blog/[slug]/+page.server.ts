import type { PageServerLoad } from './$types';
import { marked } from 'marked';
import { readFile, access } from 'fs/promises';
import path from 'path';
import { error } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (post === null) {
        console.log("A post with this slug does not exist.")
        error(404, "This post does not exist.")
    }

    const file = path.resolve(`src/posts/${post.file}`);
    try {
        await access(file);
    } catch {
        error(404, "This post does not exist.")
    }

    const content = await readFile(file, 'utf-8');
    const rendered = await marked.parse(content);

    return { post: rendered };
}

