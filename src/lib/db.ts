import Database from 'better-sqlite3';
import { z } from 'zod';
import type { Post } from './types/blog';


export const db = new Database('mysite.db');
db.pragma('journal_mode = WAL');

export const getPosts = (): Post[] | undefined => {
    const query = db.prepare("SELECT * FROM post").get();
    if (query === undefined) {
        return undefined;
    }
    return (Array.isArray(query) ? query : [query]) as Post[];
}

export const getPostBySlug = (slug: string): Post | undefined => {
    const post = db.prepare(
        "SELECT * FROM post WHERE slug = ? LIMIT 1"
    ).get(slug);
    if (post === undefined) {
        return undefined;
    }
    return post as Post;
}

export const Session = z.object({
    id: z.string(),
    expiresAt: z.date(),
})

export type Session = z.infer<typeof Session>;

