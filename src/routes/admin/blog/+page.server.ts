import { db, getPosts } from "$lib/db";
import { readdir } from "fs/promises";
import path from "path";
import type { Post } from "$lib/types/blog";
import type { PageServerLoad } from "./$types";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { isLoggedIn } from "$lib/server/auth";
import { z, string } from "zod/v4";


const PostFormSubmission = z.object({
    id: string().regex(z.regexes.number),
    title: string(),
    slug: string(),
    type: z.enum(["book", "project", "other"]),
    file: string()
})

export const load: PageServerLoad = async () => {
    const posts = getPosts();
    const dir = path.resolve("src/posts/");
    const postFiles = await readdir(dir);

    return { posts: posts, files: postFiles };
}

export const actions = {
    default: async ({ cookies, request }) => {
        if (!isLoggedIn(cookies.get("sessiontoken"))) {
            throw redirect(303, "/login")
        }
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const result = PostFormSubmission.safeParse(data);
        if (!result.success) {
            return fail(400, { badData: true });
        }
        const post: Post = {
            id: parseInt(result.data.id),
            title: result.data.title,
            slug: result.data.slug,
            type: result.data.type,
            file: result.data.file
        };

        try {
            if (post.id == -1) {
                db.prepare(
                    "INSERT INTO post(title, slug, type, file) VALUES (?,?,?,?)"
                ).run(post.title, post.slug, post.type, post.file);
            } else {
                db.prepare(
                    "UPDATE post SET title = ?, slug = ?, type = ?, file = ? WHERE id = ?"
                ).run(post.title, post.slug, post.type, post.file, post.id);
            }
            return { success: true };
        } catch (error) {
            console.log(error);
            return fail(400, { databaseConflict: true, post: post });
        }
    },
} satisfies Actions
