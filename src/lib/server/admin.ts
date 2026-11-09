import { db } from "$lib/db";
import { isLoggedIn } from "$lib/server/auth";
import { fail, redirect, type Actions, type Cookies } from "@sveltejs/kit";
import { z, string } from "zod/v4";

export type Kind = "post" | "book";

const base = {
    id: string().regex(z.regexes.number),
    title: string().min(1),
    slug: string().min(1),
    content: string(),
};

const schemas = {
    post: z.object({ ...base, type: z.enum(["project", "other"]) }),
    book: z.object({
        ...base,
        // Empty means "unknown"; otherwise an ISO date from <input type="date">.
        read_date: string().regex(/^(\d{4}-\d{2}-\d{2})?$/),
    }),
};

const requireLogin = (cookies: Cookies) => {
    if (!isLoggedIn(cookies.get("sessiontoken"))) {
        throw redirect(303, "/login");
    }
};

// Admin form actions for the `post` or `book` table. `kind` is a fixed literal
// chosen by the route, never user input, so interpolating it into SQL is safe.
export const adminActions = (kind: Kind): Actions => ({
    save: async ({ cookies, request }) => {
        requireLogin(cookies);
        const data = Object.fromEntries(await request.formData());
        const result = schemas[kind].safeParse(data);
        if (!result.success) {
            return fail(400, { error: "Invalid input: title and slug are required." });
        }
        const { id: rawId, ...fields } = result.data as Record<string, string>;
        const id = parseInt(rawId);
        const extra = kind === "post" ? fields.type : fields.read_date || null;
        const extraCol = kind === "post" ? "type" : "read_date";

        try {
            if (id === -1) {
                db.prepare(
                    `INSERT INTO ${kind} (title, slug, ${extraCol}, content) VALUES (?,?,?,?)`
                ).run(fields.title, fields.slug, extra, fields.content);
            } else {
                db.prepare(
                    `UPDATE ${kind} SET title = ?, slug = ?, ${extraCol} = ?, content = ? WHERE id = ?`
                ).run(fields.title, fields.slug, extra, fields.content, id);
            }
        } catch (error) {
            console.log(error);
            return fail(400, {
                error: "Could not save: the title or slug is already used.",
                item: { id, title: fields.title, slug: fields.slug, [extraCol]: extra, content: fields.content },
            });
        }
        return { success: `Saved "${fields.title}".` };
    },

    delete: async ({ cookies, request }) => {
        requireLogin(cookies);
        const id = parseInt(String((await request.formData()).get("id")));
        if (Number.isNaN(id) || id < 0) {
            return fail(400, { error: "Invalid id." });
        }
        const info = db.prepare(`DELETE FROM ${kind} WHERE id = ?`).run(id);
        if (info.changes === 0) {
            return fail(404, { error: "That entry no longer exists." });
        }
        return { success: "Deleted." };
    },
});
