import { readdir } from 'fs/promises';
import type { PageServerLoad } from './$types';
import path from 'path';


export const load: PageServerLoad = async () => {
    const dir = path.resolve("src/posts/");
    const postFiles = await readdir(dir);
    const posts = postFiles.map(postFile => {
        const postSlug = postFile.split('.')[0];
        let postName = postSlug.replaceAll("-", " ");
        postName = postName
            .split(" ")
            .map(word => word[0].toUpperCase() + word.slice(1))
            .join(" ");

        return {
            name: postName,
            slug: postSlug,
        }
    });

    return {
        posts: posts,
    }
}
