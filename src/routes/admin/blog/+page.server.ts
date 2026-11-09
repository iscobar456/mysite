import { db, getAllPosts } from "$lib/db";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Post } from "$lib/types/blog";
import type { PageServerLoad } from "./$types";
import { fail, redirect, type Actions, type Cookies } from "@sveltejs/kit";
import { isLoggedIn } from "$lib/server/auth";
import { z, string } from "zod/v4";

const POSTS_DIR = path.resolve("src/posts/");

const FILE_NAME = /^[A-Za-z0-9_-]+\.md$/;

const PostFormSubmission = z.object({
    id: string().regex(z.regexes.number),
    title: string().min(1),
    slug: string().min(1),
    type: z.enum(["book", "project", "other"]),
    file: string().regex(FILE_NAME),
    content: string()
})

const requireLogin = (cookies: Cookies) => {
    if (!isLoggedIn(cookies.get("sessiontoken"))) {
        throw redirect(303, "/login")
    }
}

export const load: PageServerLoad = async () => {
    const posts = getAllPosts();
    const files = (await readdir(POSTS_DIR)).filter((f) => FILE_NAME.test(f));
    const contents: Record<string, string> = {};
    for (const file of files) {
        contents[file] = await readFile(path.join(POSTS_DIR, file), "utf-8");
    }

    return { posts, files, contents };
}

export const actions = {
    save: async ({ cookies, request }) => {
        requireLogin(cookies);
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const result = PostFormSubmission.safeParse(data);
        if (!result.success) {
            return fail(400, {
                error: "Invalid input: title, slug and a file name like my-post.md are required.",
            });
        }
        const { content, ...fields } = result.data;
        const post: Post = {
            id: parseInt(fields.id),
            title: fields.title,
            slug: fields.slug,
            type: fields.type,
            file: fields.file
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
        } catch (error) {
            console.log(error);
            return fail(400, {
                error: "Could not save: the title or slug is already used by another post.",
                post,
                content
            });
        }

        try {
            await writeFile(path.join(POSTS_DIR, post.file), content, "utf-8");
        } catch (error) {
            console.log(error);
            return fail(500, {
                error: "The post was saved, but writing the markdown file failed.",
                post,
                content
            });
        }
        return { success: `Saved "${post.title}".` };
    },

    delete: async ({ cookies, request }) => {
        requireLogin(cookies);
        const formData = await request.formData();
        const id = parseInt(String(formData.get("id")));
        if (Number.isNaN(id) || id < 0) {
            return fail(400, { error: "Invalid post id." });
        }
        const info = db.prepare("DELETE FROM post WHERE id = ?").run(id);
        if (info.changes === 0) {
            return fail(404, { error: "That post no longer exists." });
        }
        return { success: "Post deleted. Its markdown file was kept on disk." };
    },
} satisfies Actions
