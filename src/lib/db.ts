import Database from 'better-sqlite3';
import { z } from 'zod';
import type { Post } from './types/blog';


export const db = new Database('mysite.db');
db.pragma('journal_mode = WAL');

export const getPosts = (): Post[] | null => {
    const query = db.prepare("SELECT * FROM post").get();
    return (Array.isArray(query) ? query : [query]) as Post[];
}

export const getPostBySlug = (slug: string): Post | null => {
    return db.prepare(
        "SELECT * FROM post WHERE slug = ? LIMIT 1"
    ).get(slug) as Post;
}

export const Session = z.object({
    id: z.string(),
    expiresAt: z.date(),
})

export type Session = z.infer<typeof Session>;

