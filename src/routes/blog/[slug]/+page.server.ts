import type { PageServerLoad } from './$types';
import { marked } from 'marked';
import { readFile, access } from 'fs/promises';
import path from 'path';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const file = path.resolve(`src/posts/${params.slug}.md`);

    try {
        await access(file);
    } catch {
        error(404, "This post does not exist.")
    }

    const content = await readFile(file, 'utf-8');
    const rendered = await marked.parse(content);

    return { post: rendered };
}

