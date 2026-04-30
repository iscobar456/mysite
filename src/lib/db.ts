import Database from 'better-sqlite3';
import { z } from 'zod';


export const db = new Database('mysite.db');
db.pragma('journal_mode = WAL');


export const Session = z.object({
    id: z.string(),
    userId: z.number(),
    expiresAt: z.date(),
})


export const User = z.object({
    id: z.number(),
    email: z.string(),
    password: z.string(),
})


export type Session = z.infer<typeof Session>;
export type User = z.infer<typeof User>;

