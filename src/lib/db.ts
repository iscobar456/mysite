import Database from 'better-sqlite3';
import { z } from 'zod';
import type { Book, Post } from './types/blog';


export const db = new Database('mysite.db');
db.pragma('journal_mode = WAL');

export const getPosts = (): Post[] => {
    return db.prepare("SELECT * FROM post ORDER BY id DESC").all() as Post[];
}

export const getPostBySlug = (slug: string): Post | undefined => {
    return db.prepare("SELECT * FROM post WHERE slug = ? LIMIT 1").get(slug) as Post | undefined;
}

// Most recently read first; books without a read date go last.
export const getBooks = (): Book[] => {
    return db.prepare(
        "SELECT * FROM book ORDER BY read_date IS NULL, read_date DESC, id DESC"
    ).all() as Book[];
}

export const getBookBySlug = (slug: string): Book | undefined => {
    return db.prepare("SELECT * FROM book WHERE slug = ? LIMIT 1").get(slug) as Book | undefined;
}

export const Session = z.object({
    id: z.string(),
    expiresAt: z.date(),
})

export type Session = z.infer<typeof Session>;

